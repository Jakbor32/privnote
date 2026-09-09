-- Fixes GitHub issue #18 ("Critical: Missing RLS policies expose entire
-- privnote table to anonymous users").
--
-- Today `privnote` has no effective RLS, so anon can SELECT/UPDATE/DELETE
-- every row directly via the REST API using only the public anon key --
-- including note_password and note_email in plaintext.
--
-- This migration locks the table down completely (no SELECT/UPDATE/DELETE/
-- INSERT grants for anon or authenticated at all) and moves every operation
-- behind three SECURITY DEFINER functions that:
--   - never return note_password to the client,
--   - only return `value` (still client-side AES encrypted) after the
--     password and expiry have been checked *server-side*,
--   - keep note creation and note reading fully anonymous/unauthenticated --
--     same no-login UX as today, just no longer a full-table read/write.
--
-- The matching client changes (OpenNote.tsx, CreateNote.tsx) are in this
-- same PR and call these functions via supabase.rpc(...) instead of
-- querying the table directly.
--
-- ASSUMPTIONS -- verify these against your actual schema before running
-- (`\d public.privnote` in the SQL editor), and adjust if different:
--   public.privnote(
--     note_uid      uuid primary key default gen_random_uuid(),
--     value         text,
--     note_time     text,      -- '12h' | '24h' | '48h' | '120h'
--     note_password text,      -- '' when not password protected
--     note_views    text,      -- '1' | '2' | '3' | '5'
--     note_email    text,      -- '' when not set
--     created_at    timestamptz default now()
--   )
--
-- Run the whole file in the Supabase SQL editor (or `supabase db push` if
-- you link the CLI). No app redeploy is required beyond this PR's client
-- changes -- the RPC names/signatures are what the client now calls.

begin;

alter table public.privnote enable row level security;

-- Defensive: drop whatever permissive policy may currently exist. Missing
-- ones just no-op ("policy does not exist" is expected and fine). If you
-- want to see what's actually there first, run:
--   select policyname, cmd, roles from pg_policies where tablename = 'privnote';
drop policy if exists "Enable read access for all users" on public.privnote;
drop policy if exists "Enable insert for all users" on public.privnote;
drop policy if exists "Enable update for all users" on public.privnote;
drop policy if exists "Enable delete for all users" on public.privnote;

-- No policies are (re)created for anon/authenticated on purpose: with RLS
-- enabled and zero policies, every direct SELECT/INSERT/UPDATE/DELETE from
-- those roles is denied. All access goes through the functions below.
revoke all on public.privnote from anon, authenticated;

-- Turns note_time ('12h' / '24h' / '48h' / '120h', or legacy 'Nm') into an
-- interval so expiry is enforced here instead of only in client UI state.
create or replace function public._privnote_ttl(note_time text)
returns interval
language sql
immutable
as $ttl$
  select case right(note_time, 1)
    when 'h' then (left(note_time, -1))::int * interval '1 hour'
    when 'm' then (left(note_time, -1))::int * interval '1 minute'
    else interval '0'
  end;
$ttl$;

-- Creates a note anonymously (same UX as today) and hands back only the
-- new note_uid -- never anything the caller just wrote back via a SELECT
-- policy (there isn't one), which is what let the old
-- `.insert(...).select("note_uid")` pattern get away with zero RLS review.
create or replace function public.create_note(
  p_value text,
  p_note_time text,
  p_note_password text,
  p_note_views text,
  p_note_email text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $create_note$
declare
  v_note_uid uuid;
begin
  insert into public.privnote (value, note_time, note_password, note_views, note_email)
  values (
    p_value,
    p_note_time,
    coalesce(p_note_password, ''),
    p_note_views,
    coalesce(p_note_email, '')
  )
  returning note_uid into v_note_uid;

  return v_note_uid;
end;
$create_note$;

revoke all on function public.create_note(text, text, text, text, text) from public;
grant execute on function public.create_note(text, text, text, text, text) to anon;

-- Metadata needed to render the "open note" page BEFORE any password is
-- entered and BEFORE a view is consumed: whether a password is required,
-- how many views are left, whether it's expired. Deliberately never
-- returns `value`, `note_password`, or `note_email`.
create or replace function public.get_note_meta(p_note_uid uuid)
returns table (
  found boolean,
  requires_password boolean,
  note_views text,
  is_expired boolean
)
language plpgsql
security definer
set search_path = public
as $get_note_meta$
declare
  r record;
begin
  select * into r from public.privnote where note_uid = p_note_uid;

  if r is null then
    return query select false, false, null::text, false;
    return;
  end if;

  return query select
    true,
    coalesce(r.note_password, '') <> '',
    r.note_views,
    (now() - r.created_at) > public._privnote_ttl(r.note_time);
end;
$get_note_meta$;

revoke all on function public.get_note_meta(uuid) from public;
grant execute on function public.get_note_meta(uuid) to anon;

-- The actual reveal: checks expiry + password *server-side*, consumes a
-- view (deletes on the last one, exactly like the old client-side logic),
-- and only then returns the encrypted `value` and `note_email`.
-- `note_password` is never returned to the client. Status values:
--   'ok' | 'not_found' | 'expired' | 'invalid_password'
create or replace function public.reveal_note(p_note_uid uuid, p_password text)
returns table (
  status text,
  value text,
  note_email text
)
language plpgsql
security definer
set search_path = public
as $reveal_note$
declare
  r record;
begin
  select * into r from public.privnote where note_uid = p_note_uid;

  if r is null then
    return query select 'not_found'::text, null::text, null::text;
    return;
  end if;

  if (now() - r.created_at) > public._privnote_ttl(r.note_time) then
    delete from public.privnote where note_uid = p_note_uid;
    return query select 'expired'::text, null::text, null::text;
    return;
  end if;

  if coalesce(r.note_password, '') <> '' and r.note_password <> p_password then
    return query select 'invalid_password'::text, null::text, null::text;
    return;
  end if;

  if coalesce(r.note_views, '1')::int <= 1 then
    delete from public.privnote where note_uid = p_note_uid;
  else
    update public.privnote
      set note_views = (coalesce(note_views, '1')::int - 1)::text,
          note_email = ''
      where note_uid = p_note_uid;
  end if;

  return query select 'ok'::text, r.value, r.note_email;
end;
$reveal_note$;

revoke all on function public.reveal_note(uuid, text) from public;
grant execute on function public.reveal_note(uuid, text) to anon;

commit;

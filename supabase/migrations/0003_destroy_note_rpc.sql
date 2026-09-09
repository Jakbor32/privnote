-- DestroyNoteButton.tsx ("Destroy Note" early-burn action) was missed by
-- migration 0001: it still did `.from("privnote").delete()` directly,
-- which migration 0001's `revoke all ... from anon, authenticated` now
-- blocks outright. Same capability model as reveal_note already assumes
-- (unguessable note_uid = the credential) -- no password check here,
-- matching the pre-migration behavior of this button.

begin;

create or replace function public.destroy_note(p_note_uid uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $destroy_note$
declare
  v_deleted int;
begin
  delete from public.privnote where note_uid = p_note_uid;
  get diagnostics v_deleted = row_count;
  return v_deleted > 0;
end;
$destroy_note$;

revoke all on function public.destroy_note(uuid) from public;
grant execute on function public.destroy_note(uuid) to anon;

commit;

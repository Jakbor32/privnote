-- Fixes GitHub issue #19 ("Critical: Storage bucket file_storage allows
-- unauthenticated listing and direct download, bypassing signed-URL
-- expiry").
--
-- Today anon can list every object in `file_storage` and download any of
-- them directly with just the public anon key -- no signed URL involved --
-- which means the expiry picked in ExpirationSelector is purely cosmetic.
--
-- This migration keeps the exact same anonymous upload + createSignedUrl
-- flow UploadToStorage.tsx already uses (no login added anywhere): anon can
-- still upload, and can still mint a signed URL for the file it just
-- uploaded. What it can no longer do is `list` the bucket or fetch an
-- object directly without going through that signed URL.
--
-- This relies on the storage.allow_only_operation() helper, which is only
-- available on newer Supabase Storage versions. Before running this in the
-- SQL editor, check it exists:
--   select storage.allow_only_operation('storage.object.list');
-- If that errors with "function does not exist", your project's Storage
-- service is on an older version -- upgrade the project first (Supabase
-- dashboard: Settings -> Infrastructure -> Upgrade), then re-run this file.
--
-- Verified against the real project (2026-09-09): the existing permissive
-- policies on storage.objects are named "all access 1ktu8c8_0" (INSERT),
-- "all access 1ktu8c8_1" (SELECT), "all access 1ktu8c8_2" (UPDATE),
-- "all access 1ktu8c8_3" (DELETE), role `public` -- i.e. every operation,
-- open to anyone. This migration drops exactly those four.
--
-- The operation name for the SELECT policy below was confirmed by reading
-- the storage-api source directly (supabase/storage-api
-- dist/http/routes/operations.js): `createSignedUrl` maps to
-- SIGN_OBJECT_URL = 'storage.object.sign'. An earlier draft of this
-- migration used 'object.get_authenticated_info', which the same source
-- marks `// legacy` and does NOT gate the /object/sign endpoint -- tested
-- locally and confirmed createSignedUrl fails (404) with that name.

begin;

-- A "public" bucket serves any object via a plain URL, bypassing signed
-- URLs and RLS entirely -- make sure that's off regardless of how the
-- bucket was created.
update storage.buckets set public = false where id = 'file_storage';

drop policy if exists "all access 1ktu8c8_0" on storage.objects;
drop policy if exists "all access 1ktu8c8_1" on storage.objects;
drop policy if exists "all access 1ktu8c8_2" on storage.objects;
drop policy if exists "all access 1ktu8c8_3" on storage.objects;

create policy "anon can upload to file_storage"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'file_storage');

-- Scoped so supabase.storage.from('file_storage').createSignedUrl(...)
-- keeps working right after upload, without allowing `list` or a direct
-- unsigned `get`.
create policy "anon can sign file_storage objects only"
  on storage.objects
  for select
  to anon
  using (
    bucket_id = 'file_storage'
    and storage.allow_only_operation('storage.object.sign')
  );

commit;

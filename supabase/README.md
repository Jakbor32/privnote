# Supabase migrations

These SQL files close [#18](https://github.com/Jakbor32/privnote/issues/18)
and [#19](https://github.com/Jakbor32/privnote/issues/19). They are not
applied automatically by deploying the app -- **run them by hand** in the
Supabase SQL editor for this project (Table Editor -> SQL Editor), in order:

1. `migrations/0001_privnote_rls_and_rpc.sql`
2. `migrations/0002_file_storage_policies.sql`

Both files list their assumptions about the current schema/policies at the
top -- skim those before running, since this repo has no prior migration
history to diff against (they were never tracked as code until now).

## Why manual, not automatic

Applying these requires a Supabase service-role/database connection to this
specific project, which isn't available to this environment (or Claude in
general) -- and shouldn't be, since it's effectively full DB access on a
public app with real user data in it. The SQL is written to be idempotent
enough to re-run safely, but review it before pasting it into the SQL
editor.

## Verifying the fix

After running both files, the reproduction steps from the two issues should
now fail closed:

```bash
# #18 -- should now return {"code":"PGRST..."} / empty, not the full table
curl "https://<project>.supabase.co/rest/v1/privnote?select=*" \
  -H "apikey: <anon_key>" -H "Authorization: Bearer <anon_key>"

# #19 -- should now return an empty/forbidden result, not a folder listing
curl "https://<project>.supabase.co/storage/v1/object/list/file_storage" \
  -X POST -H "apikey: <anon_key>" -H "Authorization: Bearer <anon_key>" \
  -H "Content-Type: application/json" -d '{"prefix":"","limit":100}'
```

Then smoke-test the app itself: create a note (with and without a
password), open it in an incognito window, upload a file and download it
via the generated link -- all of that should work exactly as before, since
none of the anonymous, no-login flows changed on the client side.

## Known follow-ups (not in this PR)

- `note_time`/`note_views`/`note_password` are stored as free-form `text`
  rather than typed columns -- the new functions coerce/parse them
  defensively, but tightening the column types is a separate, non-security
  cleanup.
- If your project's Storage version doesn't have
  `storage.allow_only_operation` yet (see the note at the top of
  `0002_file_storage_policies.sql`), upgrading the project's infrastructure
  from the Supabase dashboard is the fix, not a workaround here.

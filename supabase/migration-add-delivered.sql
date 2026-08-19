-- ============================================================================
-- Migration: allow the "Delivered" case status
--
-- WHY THIS IS NEEDED
--   The cases table has a rule (a CHECK constraint) listing the statuses it
--   will accept. "Delivered" is not in that list yet, so saving a case with
--   that status would be rejected by the database.
--
-- HOW TO RUN (one time, ~30 seconds)
--   1. supabase.com/dashboard → open your project
--      (if it shows a "paused" banner, click Restore first and wait for it)
--   2. SQL Editor → New query
--   3. Paste this whole file → Run
--   4. Expect: "Success. No rows returned"
--
-- Safe to run: it only changes which values are allowed. No data is touched.
-- ============================================================================

alter table public.cases
  drop constraint if exists cases_status_check;

alter table public.cases
  add constraint cases_status_check
  check (status in (
    'Received',
    'In Design',
    'In Production',
    'Quality Check',
    'Shipped',
    'Delivered'
  ));

-- Verify it worked — should list all six statuses:
-- select pg_get_constraintdef(oid) from pg_constraint
-- where conname = 'cases_status_check';

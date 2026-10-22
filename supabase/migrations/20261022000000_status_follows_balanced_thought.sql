-- An entry is done once it has an alternative thought (column 6), no longer
-- evidence (column 4). Older entries without one go back to draft so they
-- show under "belum diuji" and can be finished.
update public.entries set status = 'draft' where balanced_thought is null and status = 'done';

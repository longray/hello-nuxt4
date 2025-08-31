BEGIN TRANSACTION;

-- Step 1: Rename old tables that lack the ON DELETE CASCADE constraint.
ALTER TABLE issues RENAME TO issues_old;
ALTER TABLE issue_tags RENAME TO issue_tags_old;
ALTER TABLE issue_sources RENAME TO issue_sources_old;

-- Step 2: Create the new tables using the correct schema from schema.sql, which includes ON DELETE CASCADE.
-- This ensures that when an issue is deleted, its related tags and sources are also removed.
CREATE TABLE issues (
    id TEXT PRIMARY KEY,
    example TEXT,
    context TEXT,
    problem TEXT,
    cause TEXT,
    solution TEXT,
    code TEXT,
    verified BOOLEAN DEFAULT FALSE,
    last_updated DATE
);

CREATE TABLE issue_tags (
    issue_id TEXT,
    tag TEXT,
    PRIMARY KEY (issue_id, tag),
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
);

CREATE TABLE issue_sources (
    issue_id TEXT,
    source TEXT,
    PRIMARY KEY (issue_id, source),
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
);

-- Step 3: Copy the data from the old tables into the new, correctly structured tables.
-- This preserves all existing data.
INSERT INTO issues (id, example, context, problem, cause, solution, code, verified, last_updated)
SELECT id, example, context, problem, cause, solution, code, verified, last_updated FROM issues_old;

INSERT INTO issue_tags (issue_id, tag)
SELECT issue_id, tag FROM issue_tags_old;

INSERT INTO issue_sources (issue_id, source)
SELECT issue_id, source FROM issue_sources_old;

-- Step 4: Drop the temporary old tables, as the data has been successfully migrated.
DROP TABLE issues_old;
DROP TABLE issue_tags_old;
DROP TABLE issue_sources_old;

-- All operations are complete, commit the transaction to make the changes permanent.
COMMIT;
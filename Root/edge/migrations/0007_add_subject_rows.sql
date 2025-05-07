-- Migration number: 0007 	 2025-04-20T23:35:01.154Z
ALTER TABLE subjectanswers
ADD COLUMN answers JSON;

ALTER TABLE subjectanswers
ADD COLUMN rawScore REAL;

ALTER TABLE tests
ADD COLUMN mean REAL;

ALTER TABLE tests
ADD COLUMN standardDeviation REAL;

CREATE INDEX idx_subjects_session ON subjects (testingSessionId);
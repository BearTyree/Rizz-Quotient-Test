-- Migration number: 0006 	 2025-04-20T03:26:26.595Z
-- Migration number: 0006
-- Add age column to subjects table
ALTER TABLE subjects
ADD COLUMN age INTEGER;

-- Add index to the new age column
CREATE INDEX idx_subjects_age ON subjects (age);
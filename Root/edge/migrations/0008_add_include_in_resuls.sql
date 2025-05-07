-- Migration number: 0008 	 2025-04-29T01:02:04.535Z
ALTER TABLE testingSessions
ADD COLUMN includeInResults BOOLEAN;

-- Migration number: 0005 	 2025-04-20T01:20:50.573Z
CREATE TABLE
	Users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		passwordHash INTEGER NOT NULL,
		passwordSalt INTEGER NOT NULL,
		subjectId INTEGER,
		FOREIGN KEY (subjectId) REFERENCES Subjects (id)
	);

-- CREATE TABLE
-- 	Admins (
-- 		id INTEGER PRIMARY KEY AUTOINCREMENT,
-- 		username TEXT NOT NULL UNIQUE,
-- 		passwordHash INTEGER NOT NULL,
-- 		passwordSalt INTEGER NOT NULL
-- 	);
CREATE TABLE
	Subjects (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		testingSessionId INTEGER NOT NULL,
		testingUsername INTEGER NOT NULL UNIQUE,
		testingPassword INTEGER NOT NULL UNIQUE,
		linkingCode VARCHAR(12) UNIQUE,
		FOREIGN KEY (testingSessionId) REFERENCES TestingSessions (id)
	);

-- CREATE TABLE
-- 	SubjectAnswers (
-- 		id INTEGER PRIMARY KEY AUTOINCREMENT,
-- 		testingSessionId INTEGER NOT NULL,
-- 		subjectId INTEGER NOT NULL,
-- 		FOREIGN KEY (subjectId) REFERENCES Subjects (id),
-- 		FOREIGN KEY (testingSessionId) REFERENCES TestingSessions (id)
-- 	);
CREATE TABLE
	TestingSessions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		location TEXT NOT NULL,
		testId INTEGER NOT NULL,
		startTime DATETIME NOT NULL,
		endTime DATETIME NOT NULL,
		FOREIGN KEY (testId) REFERENCES Tests (id)
	);

CREATE TABLE
	Tests (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL UNIQUE
	);

CREATE TABLE
	Attempts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		userId INTEGER NOT NULL,
		FOREIGN KEY (userId) REFERENCES Users (id)
	);
export async function getTestSessions(env) {
	const stmt = await env.DB.prepare(`SELECT * FROM TestingSessions`).all();
	return await stmt.results;
}

export async function newTestSession(
	location,
	startTime,
	endTime,
	testName,
	includeInResults,
	env
) {
	try {
		const testQuery = await env.DB.prepare(
			`SELECT id FROM Tests WHERE name = ?`
		)
			.bind(testName)
			.first();

		if (!testQuery) {
			return false;
		}

		const testId = testQuery.id;

		const addTestingSessionStmt = await env.DB.prepare(
			`INSERT INTO TestingSessions (location, testId, startTime, endTime, includeInResults) VALUES (?, ?, ?, ?, ?)`
		)
			.bind(location, testId, startTime, endTime, includeInResults)
			.run();

		if (!addTestingSessionStmt.success) {
			return false;
		}
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}

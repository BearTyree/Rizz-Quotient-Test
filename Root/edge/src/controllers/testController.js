export async function newTest(name, env) {
	try {
		const addTestStmt = await env.DB.prepare(
			`INSERT INTO Tests (name) VALUES (?)`
		)
			.bind(name)
			.run();
		if (!addTestStmt.success) {
			return "stmt failed";
		}
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}

export async function getTests(env) {
	const stmt = await env.DB.prepare(`SELECT * FROM Tests`).all();
	return await stmt.results;
}

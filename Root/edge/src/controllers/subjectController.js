import jwt from "@tsndr/cloudflare-worker-jwt";
import hash from "../utils/hash";

export async function generateAccessToken(username, env) {
	let token;
	try {
		token = await jwt.sign(
			{
				username,
				exp: Math.floor(Date.now() / 1000) + 2 * (60 * 60), // Expires: Now + 2h
			},
			env.TOKEN_SECRET
		);
	} catch (err) {
		console.log(err);
		return false;
	}
	return token;
}

export async function getSubjects(testId, env) {
	const stmt = await env.DB.prepare(
		`SELECT * FROM Subjects WHERE testingSessionId = ?`
	)
		.bind(testId)
		.all();
	return await stmt.results;
}

export async function deleteSubject(id, env) {
	try {
		const answersStmt = await env.DB.prepare(
			`DELETE FROM SubjectAnswers WHERE subjectId = ?`
		)
			.bind(id)
			.run();
		if (!answersStmt.results) return false;
		const stmt = await env.DB.prepare(`DELETE FROM Subjects WHERE id = ?`)
			.bind(id)
			.run();
		if (!stmt.results) return false;
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}

export async function newSubject(
	firstName,
	lastName,
	age,
	testingSessionId,
	env
) {
	if (firstName == "" || lastName == "" || age == "") {
		return { err: "gotta provide values" };
	}
	let uuid = crypto.randomUUID().split("-");
	let testingUsername = uuid.slice(0, 2).join("");
	let testingPassword = uuid.slice(2, 4).join("");
	let linkingCode = uuid.slice(4, 5).join("");
	try {
		let stmt = await env.DB.prepare(
			`INSERT INTO Subjects (name, testingSessionId, testingUsername, testingPassword, linkingCode, age) VALUES (?, ?, ?, ?, ?, ?)`
		)
			.bind(
				firstName + " " + lastName,
				testingSessionId,
				testingUsername,
				testingPassword.toString(),
				linkingCode,
				age
			)
			.run();
		if (!stmt.success) {
			return false;
		}
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}

export async function newSubjectAnswers(answers, rawScore, username, env) {
	try {
		const subjectStmt = await env.DB.prepare(
			`SELECT * FROM Subjects WHERE testingUsername = ?`
		)
			.bind(username)
			.all();

		const alreadyAnsweredStmt = await env.DB.prepare(
			`SELECT * FROM SubjectAnswers WHERE subjectId = ?`
		)
			.bind(subjectStmt.results[0].id)
			.all();

		if (alreadyAnsweredStmt.results[0]) {
			return false;
		}

		console.log();
		let answersStmt = await env.DB.prepare(
			`INSERT INTO SubjectAnswers (testingSessionId, subjectId, answers, rawScore) VALUES (?, ?, ?, ?)`
		)
			.bind(
				subjectStmt.results[0].testingSessionId,
				subjectStmt.results[0].id,
				JSON.stringify(answers),
				rawScore
			)
			.run();
		if (!answersStmt.success) {
			return false;
		}
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}

export async function checkPassword(username, password, env) {
	const stmt = await env.DB.prepare(
		`SELECT * FROM Subjects WHERE testingUsername = ?`
	)
		.bind(username)
		.all();

	if (!stmt.results[0]) {
		return false;
	}

	let testingPassword = await stmt.results[0]["testingPassword"];

	if (password.toString() !== testingPassword.toString()) {
		return false;
	}

	return true;
}

export async function verifyToken(token, env) {
	const verifiedToken = await jwt.verify(token, env.TOKEN_SECRET);

	if (!verifiedToken) return false;

	const { payload } = verifiedToken;
	if (payload.exp < Math.floor(Date.now() / 1000)) {
		return { err: "Token expired" };
	}
	return payload.username;
	// return true;
}

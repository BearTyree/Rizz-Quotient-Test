import jwt from "@tsndr/cloudflare-worker-jwt";
import { getTestSessions } from "../controllers/testSessionsController";

export async function calculateResults(env) {
	try {
		let testSessions = await getTestSessions(env);
		let newTestSessions = [];
		const subjectAnswersStmt = await env.DB.prepare(
			`SELECT *
			FROM SubjectAnswers
			FULL OUTER JOIN Subjects
			ON SubjectAnswers.subjectId = Subjects.id
			`
		).all();
		let subjectAnswers = subjectAnswersStmt.results
			.filter(
				(sa) =>
					testSessions.find((ts) => ts.id == sa.testingSessionId)
						.includeInResults
			)
			.filter((s) => s.answers);
		for (let testSession of testSessions) {
			if (!testSession.includeInResults) {
				continue;
			}
			const subjectAnswersStmt = await env.DB.prepare(
				`SELECT *
			FROM SubjectAnswers
			FULL OUTER JOIN Subjects
			ON SubjectAnswers.subjectId = Subjects.id
			WHERE SubjectAnswers.testingSessionId = ?
			`
			)
				.bind(testSession.id)
				.all();
			newTestSessions.push({
				testSession,
				subjects: subjectAnswersStmt.results,
			});
		}

		// const subjectAnswersStmt = await env.DB.prepare(
		// 	`SELECT *
		// 	FROM TestingSessions
		// 	FULL OUTER JOIN Subjects
		// 	ON Subjects.testingSessionId = TestingSessions.id`
		// ).all();

		let totalPoints = 0;
		let totalVariance = 0;

		for (let subjectAnswer of subjectAnswers) {
			totalPoints += subjectAnswer.rawScore;
		}

		let mean = totalPoints / subjectAnswers.length;

		for (let subjectAnswer of subjectAnswers) {
			let variance = subjectAnswer.rawScore - mean;
			totalVariance += variance * variance;
		}

		let standardDeviation = Math.sqrt(
			totalVariance / (subjectAnswers.length - 1)
		);

		return { mean, standardDeviation, testSessions: newTestSessions };
	} catch (err) {
		console.log(err);
		return { err };
	}
}

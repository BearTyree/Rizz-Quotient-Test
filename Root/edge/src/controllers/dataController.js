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

		let questionsJson = await env.RIZZ_KV.get("questions");

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

			let newSubjects = subjectAnswersStmt.results;

			for (let subject of newSubjects) {
				let sections = JSON.parse(questionsJson);
				let questions = [];
				let answers = JSON.parse(subject.answers);

				let pointsPerQuestion = [];

				for (let section of sections) {
					questions.push(...section.questions);
				}

				for (let answer of answers) {
					if (answer.selection == -1) {
						pointsPerQuestion.push(0);
						continue;
					}

					pointsPerQuestion.push(
						questions.find((v) => v.id == answer.id).options[answer.selection]
							.points
					);
				}

				newSubjects[newSubjects.findIndex((s) => s.id == subject.id)] = {
					...subject,
					pointsPerQuestion,
				};
			}

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

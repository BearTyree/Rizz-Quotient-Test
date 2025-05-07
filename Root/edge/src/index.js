import { handleAdminRequest } from "./routes/adminRoutes";
import { handleSubjectRequest } from "./routes/subjectRoutes";
import { getTestSessions } from "./controllers/testSessionsController";
import {
	newSubjectAnswers,
	verifyToken as verifySubjectToken,
} from "./controllers/subjectController";
import { getTests } from "./controllers/testController";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*", // or set this to a specific domain
	"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
	"Access-Control-Max-Age": "86400",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
	async fetch(req, env, ctx) {
		// Handle preflight OPTIONS requests
		if (req.method == "OPTIONS") {
			return new Response(null, { headers: corsHeaders });
		}
		const url = new URL(req.url);
		let path = url.pathname.slice(1).split("/");
		if (!path[0]) {
			return env.ASSETS.fetch(req);
		}
		switch (path[0]) {
			case "api": {
				return handleApiRequest(path.slice(1), req, env);
			}
			default: {
				return env.ASSETS.fetch(req);
			}
		}
	},
};

async function handleApiRequest(path, req, env) {
	switch (path[0]) {
		case "norming": {
			if (env.NORMING) {
				return new Response(JSON.stringify(true), {
					status: 200,
					headers: corsHeaders,
				});
			}
			return new Response(JSON.stringify(false), {
				status: 200,
				headers: corsHeaders,
			});
		}
		case "questions": {
			if (!env.NORMING) {
				let questionsJson = await env.RIZZ_KV.get("questions");
				let sections = JSON.parse(questionsJson);
				let questionsToSend = sections.map((section) => {
					let newQuestions = section.questions.map((item) => {
						let newItem = item.options?.map((option) => {
							delete option.points;
							return option;
						});
						return { ...item, options: newItem };
					});
					return { ...section, questions: newQuestions };
				});

				return new Response(JSON.stringify(await questionsToSend), {
					headers: corsHeaders,
				});
			}
			const headers = req.headers;

			const token = headers.get("Authorization").replace("Bearer ", "");

			let verified;

			try {
				verified = await verifySubjectToken(token, env);
			} catch (err) {
				console.log(err);
				return new Response("error", {
					status: 500,
					headers: corsHeaders,
				});
			}

			if (!verified || verified.err) {
				return new Response("error", {
					status: 401,
					headers: corsHeaders,
				});
			}

			let questionsJson = await env.RIZZ_KV.get("questions");
			let sections = JSON.parse(questionsJson);
			let questionsToSend = sections.map((section) => {
				let newQuestions = section.questions.map((item) => {
					let newItem = item.options?.map((option) => {
						delete option.points;
						return option;
					});
					return { ...item, options: newItem };
				});
				return { ...section, questions: newQuestions };
			});

			return new Response(JSON.stringify(await questionsToSend), {
				headers: corsHeaders,
			});
		}
		case "info": {
			if (!env.NORMING) {
				let infoJson = await env.RIZZ_KV.get("info");
				return new Response(infoJson, { headers: corsHeaders });
			}
			const headers = req.headers;

			const token = headers.get("Authorization").replace("Bearer ", "");

			let verified;

			try {
				verified = await verifySubjectToken(token, env);
			} catch (err) {
				console.log(err);
				return new Response("error", {
					status: 500,
					headers: corsHeaders,
				});
			}

			if (!verified || verified.err) {
				return new Response("error", {
					status: 401,
					headers: corsHeaders,
				});
			}

			let infoJson = await env.RIZZ_KV.get("info");
			return new Response(infoJson, { headers: corsHeaders });
		}
		case "answers": {
			if (!env.NORMING) {
				let questionsJson = await env.RIZZ_KV.get("questions");
				let answers = await req.json();
				let sections = JSON.parse(questionsJson);
				let questions = [];
				let points = 0;

				for (let section of sections) {
					questions.push(...section.questions);
				}

				for (let answer of answers) {
					if (answer.selection == -1) {
						continue;
					}
					points += questions.find((v) => v.id == answer.id).options[
						answer.selection
					].points;
				}

				console.log(points);
				return new Response(points);
			}

			const headers = req.headers;

			const token = headers.get("Authorization").replace("Bearer ", "");

			let verified;

			try {
				verified = await verifySubjectToken(token, env);
			} catch (err) {
				console.log(err);
				return new Response("error", {
					status: 500,
					headers: corsHeaders,
				});
			}

			if (!verified || verified.err) {
				return new Response("error", {
					status: 401,
					headers: corsHeaders,
				});
			}

			let questionsJson = await env.RIZZ_KV.get("questions");
			let answers = await req.json();
			let sections = JSON.parse(questionsJson);
			let questions = [];
			let points = 0;

			for (let section of sections) {
				questions.push(...section.questions);
			}

			for (let answer of answers) {
				if (answer.selection == -1) {
					continue;
				}
				points += questions.find((v) => v.id == answer.id).options[
					answer.selection
				].points;
			}

			let success = await newSubjectAnswers(answers, points, verified, env);

			if (!success) {
				return new Response("error", { status: 500, headers: corsHeaders });
			}

			return new Response("success", { status: 200, headers: corsHeaders });
		}
		case "admin": {
			return handleAdminRequest(path.slice(1), req, env);
		}
		case "subject": {
			return handleSubjectRequest(path.slice(1), req, env);
		}
		case "testSessions": {
			let testSessions = await getTestSessions(env);
			return new Response(JSON.stringify(testSessions), {
				headers: corsHeaders,
			});
		}
		case "tests": {
			let tests = await getTests(env);
			return new Response(JSON.stringify(tests), {
				headers: corsHeaders,
			});
		}
		default:
			return new Response("Not Found", { status: 404 });
	}
}

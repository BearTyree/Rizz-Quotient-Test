import { getTestSessions } from "../controllers/testSessionsController";
import { getSubjects } from "../controllers/subjectController";
import {
	checkPassword,
	verifyToken,
	generateAccessToken,
} from "../controllers/adminController";
import { newTest } from "../controllers/testController";
import { newTestSession } from "../controllers/testSessionsController";
import { calculateResults } from "../controllers/dataController";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*", // or set this to a specific domain
	"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
	"Access-Control-Max-Age": "86400",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function handleAdminRequest(path, req, env) {
	switch (path[0]) {
		case "login": {
			let { username, password } = await req.json();

			let verified = await checkPassword(username, password, env);

			if (verified == false) {
				return new Response("access denied", {
					status: 401,
					headers: corsHeaders,
				});
			}

			if (verified.err) {
				return new Response(verified.err, {
					status: 403,
					headers: corsHeaders,
				});
			}

			return new Response(await generateAccessToken(username, env), {
				headers: corsHeaders,
			});
		}
		case "new": {
			switch (path[1]) {
				case "test": {
					const headers = req.headers;

					const token = headers.get("Authorization").replace("Bearer ", "");

					let verified = await verifyToken(token, env);

					if (!verified || verified.err) {
						return new Response("error", { status: 401, headers: corsHeaders });
					}

					const { name } = await req.json();

					let success = await newTest(name, env);

					if (!success) {
						return new Response("error making test", {
							status: 500,
							headers: corsHeaders,
						});
					}

					return new Response("success", {
						status: 200,
						headers: corsHeaders,
					});
				}
				case "testSession": {
					const headers = req.headers;

					const token = headers.get("Authorization").replace("Bearer ", "");

					let verified = await verifyToken(token, env);

					if (!verified || verified.err) {
						return new Response("error", {
							status: 401,
							headers: corsHeaders,
						});
					}
					const { location, startTime, endTime, testName, includeInResults } =
						await req.json();

					let success = await newTestSession(
						location,
						startTime,
						endTime,
						testName,
						includeInResults,
						env
					);

					if (!success) {
						return new Response("error making test session", {
							status: 500,
							headers: corsHeaders,
						});
					}

					return new Response("success", {
						status: 200,
						headers: corsHeaders,
					});
				}
				default: {
					return new Response({ status: 404 });
				}
			}
		}
		case "compileResults": {
			const headers = req.headers;

			const token = headers.get("Authorization").replace("Bearer ", "");

			let verified = await verifyToken(token, env);

			if (!verified || verified.err) {
				return new Response("error", {
					status: 401,
					headers: corsHeaders,
				});
			}

			let results = await calculateResults(env);

			if (!results || results.err) {
				return new Response("error", {
					status: 500,
					headers: corsHeaders,
				});
			}

			return new Response(JSON.stringify(results), {
				status: 200,
				headers: corsHeaders,
			});
		}
		case "testSessions": {
			const headers = req.headers;

			const token = headers.get("Authorization").replace("Bearer ", "");

			let verified = await verifyToken(token, env);

			if (!verified || verified.err) {
				return new Response("error", {
					status: 401,
					headers: corsHeaders,
				});
			}
			let testSessions = await getTestSessions(env);
			let newTestSessions = [];

			for (let testSession of testSessions) {
				let subjects = await getSubjects(testSession.id, env);
				newTestSessions.push({ testSession, subjects });
			}

			return new Response(JSON.stringify(newTestSessions), {
				headers: corsHeaders,
			});
		}
		default: {
			return new Response({ status: 404, headers: corsHeaders });
		}
	}
}

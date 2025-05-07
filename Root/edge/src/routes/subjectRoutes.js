import {
	newSubject,
	generateAccessToken,
	checkPassword,
} from "../controllers/subjectController";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*", // or set this to a specific domain
	"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
	"Access-Control-Max-Age": "86400",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function handleSubjectRequest(path, req, env) {
	switch (path[0]) {
		case "new": {
			const { firstName, lastName, age, testingSessionId } = await req.json();

			let success = await newSubject(
				firstName,
				lastName,
				age,
				testingSessionId,
				env
			);

			if (!success) {
				return new Response("error", {
					status: 500,
					headers: corsHeaders,
				});
			}

			if (success.err) {
				return new Response("gotta provide values", {
					status: 401,
					headers: corsHeaders,
				});
			}

			return new Response("success", {
				status: 200,
				headers: corsHeaders,
			});
		}
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
		default: {
			console.log(path);
			return new Response("", {
				status: 404,
				headers: corsHeaders,
			});
		}
	}
}

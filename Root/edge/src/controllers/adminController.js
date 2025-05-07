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

export async function checkPassword(username, password, env) {
	if (
		username != env.ADMIN_USERNAME ||
		(await hash(password + env.ADMIN_PASSWORD_SALT)) != env.ADMIN_PASSWORD_HASH
	) {
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
	return payload.username == env.ADMIN_USERNAME;
}

import crypto from "crypto";

function generateRandomString() {
	return crypto.randomBytes(4).toString("hex");
}

console.log(generateRandomString());

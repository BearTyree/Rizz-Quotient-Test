import { createHash, randomBytes } from "crypto";

const hash = async (password) => {
	// generate a random salt
	const salt = randomBytes(16).toString("hex");
	// create a hash of the salt and password
	const hash = createHash("sha256")
		.update(salt + password)
		.digest("hex");
	// return the salt and hash
	return { salt, hash };
};

console.log(await hash(process.argv[2]));

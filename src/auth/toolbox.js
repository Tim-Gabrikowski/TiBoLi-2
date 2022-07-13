const { createHash } = require("crypto");
function hash(input) {
	return createHash("sha256").update(input).digest("hex");
}

const { generate } = require("generate-password");
function generateSecurePassword() {
	return generate({
		length: 16,
		numbers: true,
		uppercase: true,
		lowercase: true,
		strict: true,
	});
}
module.exports = { hash, generateSecurePassword };

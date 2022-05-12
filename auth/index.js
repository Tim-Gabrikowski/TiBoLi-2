const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { createHash } = require("crypto");
const {
	getUserByUsername,
	getAllUsernames,
	registerNewUser,
} = require("./database");
require("dotenv").config();

let refreshTokens = [];

function hash(input) {
	return createHash("sha256").update(input).digest("hex");
}

router.post("/refreshtoken", (req, res) => {
	const refreshToken = req.body.token;
	if (refreshToken == null) return res.sendStatus(401);
	if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);

		const accessToken = generateAccessToken(user);

		res.json({ accessToken: accessToken, refreshToken: refreshToken });
	});
});

router.delete("/logout", (req, res) => {
	refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
	res.sendStatus(204);
});

router.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const user = { username: username, password: password };

	getUserByUsername(user.username, (err, result) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "auth/login",
				errorObject: err,
				statusCode: 501,
			};
		if (result.length != 1) return res.sendStatus(401);
		resUser = JSON.parse(JSON.stringify(result))[0];

		const password_hash = hash(user.password);

		if (resUser.password_hash != password_hash) {
			return res.sendStatus(401);
		}
		var tokenUser = {
			id: resUser.id,
			username: resUser.username,
			mail: resUser.mail,
			perm_group: resUser.perm_group,
		};

		const accessToken = generateAccessToken(tokenUser);
		const refreshToken = jwt.sign(
			tokenUser,
			process.env.REFRESH_TOKEN_SECRET
		);

		refreshTokens.push(refreshToken);
		res.json({
			accessToken: accessToken,
			refreshToken: refreshToken,
			user: tokenUser,
		});
	});
});

router.post("/register", authenticateToken, (req, res) => {
	const input = req.body;

	if (req.user.perm_group < 3) return res.sendStatus(403); // perm_group 3 = Team member.
	if (input.username === undefined) return res.sendStatus(406); // not acceptable
	if (input.password === undefined) return res.sendStatus(406); // not acceptable

	if (input.perm_group >= req.user.perm_group && req.user.perm_group != 4)
		return res.sendStatus(403); // wenn gleicher oder höherer Rang und nicht admin

	getAllUsernames((err, usernames) => {
		if (err)
			throw {
				request: req,
				response: res,
				message: "Something went wrong",
				origin: "auth/register(get usernames)",
				errorObject: err,
				statusCode: 500,
			};

		pUsernames = JSON.parse(JSON.stringify(usernames));
		uNamesFiltered = pUsernames.filter(
			(elem) => elem.username == input.username
		);

		if (uNamesFiltered.length != 0)
			return res.status(406).send({ message: "Username taken" }); // not acceptable

		var newUser = {
			username: input.username,
			password_hash: hash(input.password),
			mail: input.mail || "",
			perm_group: input.perm_group || 0,
		};

		registerNewUser(newUser, (error, result) => {
			if (error)
				throw {
					request: req,
					response: res,
					message: "Something went wrong",
					origin: "auth/register (register user)",
					errorObject: error,
					statusCode: 500,
				};

			newUser.id = result.insertId;

			res.send(newUser);
		});
	});
});

function generateAccessToken(user) {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "5m",
	});
}
function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}

module.exports = {
	router,
	authenticateToken,
};

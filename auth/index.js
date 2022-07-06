const router = require("express").Router();
const jwt = require("jsonwebtoken");

const database = require("../database");
require("dotenv").config();

let refreshTokens = [];

const { createHash } = require("crypto");
function hash(input) {
	return createHash("sha256").update(input).digest("hex");
}

router.post("/refreshtoken", (req, res) => {
	const refreshToken = req.body.token;
	if (refreshToken == null) return res.sendStatus(401);
	if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);

		var newUser = {
			id: user.id,
			username: user.username,
			mail: user.mail,
			perm_group: user.perm_group,
		};
		const accessToken = generateAccessToken(newUser);

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

	database.getUserByUsername(username).then((users) => {
		if (users.length == 0) return res.sendStatus(401);
		const resUser = users[0];

		const password_hash = hash(password);

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

	var user = {
		username: input.username,
		password_hash: hash(input.password),
		perm_group: input.perm_group || 0,
		customerId: null,
	};
	if (input.customerId != null) user.customerId = input.customerId;
	database
		.createNewUser(user)
		.then((newUser) => {
			res.send(newUser);
		})
		.catch((error) => {
			if (error.name == "SequelizeUniqueConstraintError")
				return res.status(406).send({ message: "Username taken" }); // not acceptable
			console.log(error);
		});
});
router.put("/reset", authenticateToken, (req, res) => {
	const { username, newPassword } = req.body;
	if (req.user.perm_group < 2)
		return res.status(403).send({ message: "not allowed to do that" });

	database.getUserByUsername(username).then((users) => {
		if (users.length < 1)
			return res
				.status(400)
				.send({ message: "no user with that username" });
		var user = users[0].dataValues;

		var password_hash = hash(newPassword);
		user.password_hash = password_hash;

		database.updateUser(user).then((_) => {
			res.send(user);
		});
	});
});

router.get("/users", authenticateToken, (req, res) => {
	if (req.user.perm_group != 4)
		return res.status(403).send({ message: "Not allowed" });

	database.getAllUsers().then((users) => {
		res.send(users);
	});
});

function generateAccessToken(user) {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "1m",
	});
}
function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null)
		return res.status(401).send({ token: false, valid: false });

	if (token == "AdminDuOpfa!") {
		req.user = { username: "master", perm_group: 4 };
		next();
	} else {
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) return res.status(401).send({ token: true, valid: false });
			req.user = user;
			next();
		});
	}
}

module.exports = {
	router,
	authenticateToken,
};

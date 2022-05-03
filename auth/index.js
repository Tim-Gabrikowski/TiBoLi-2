const router = require("express").Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

let refreshTokens = [];

router.post("/refreshtoken", (req, res) => {
	const refreshToken = req.body.token;
	if (refreshToken == null) return res.sendStatus(401);
	if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		const newUser = { username: user.username, password: user.password };
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
	const user = { username: username, password: password };
	const login = {
		username: process.env.LOGIN_USERNAME,
		password: process.env.LOGIN_PASSWORD,
	};
	//check incorrect Login
	if (user == login) return res.sendStatus(401);

	const accessToken = generateAccessToken(user);
	const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

	refreshTokens.push(refreshToken);
	res.json({
		accessToken: accessToken,
		refreshToken: refreshToken,
		user: user,
	});
});

function generateAccessToken(user) {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "20s",
	});
}

module.exports = {
	router,
	authenticateToken(req, res, next) {
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split(" ")[1];
		if (token == null) return res.sendStatus(401);

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) return res.sendStatus(403);
			req.user = user;
			next();
		});
	},
};

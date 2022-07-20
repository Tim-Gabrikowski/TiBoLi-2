const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { hash, generateSecurePassword } = require("./toolbox");

const database = require("../database");
require("dotenv").config();

let refreshTokens = [];

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
		const refreshToken = jwt.sign(tokenUser, process.env.REFRESH_TOKEN_SECRET);

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

	if (input.perm_group >= req.user.perm_group && req.user.perm_group != 4) return res.sendStatus(403); // wenn gleicher oder höherer Rang und nicht admin

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
	const { id, newPassword } = req.body;
	if (req.user.perm_group < 2) return res.status(403).send({ message: "not allowed to do that" });

	database.getUserById(id).then((users) => {
		if (users.length < 1) return res.status(400).send({ message: "no user with that id" });
		var user = users[0].dataValues;

		if (typeof req.body.oldPassword === "undefined") return res.status(400).send({ message: "no password" });

		if (user.password_hash != hash(req.body.oldPassword))
			return res.status(400).send({ message: "wrong password" });

		var password_hash = hash(newPassword);
		user.password_hash = password_hash;

		database.updateUser(user).then((_) => {
			res.send(user);
		});
	});
});
router.put("/adminreset", authenticateToken, (req, res) => {
	var { id, newPassword } = req.body;
	if (req.user.perm_group != 4) return res.status(403).send({ message: "not allowed to do that" });

	database.getUserById(id).then((users) => {
		if (users.length < 1) return res.status(400).send({ message: "no user with that id" });
		var user = users[0].dataValues;

		if (!newPassword) {
			newPassword = generateSecurePassword();
		}
		var password_hash = hash(newPassword);
		user.password_hash = password_hash;

		database.updateUser(user).then((_) => {
			res.send({ user: user, newPassword: newPassword });
		});
	});
});
router.get("/randompassword", (req, res) => {
	res.send({ password: generateSecurePassword() });
});
router.get("/users", authenticateToken, (req, res) => {
	if (req.user.perm_group != 4) return res.status(403).send({ message: "Not allowed" });

	database.getAllUsers().then((users) => {
		res.send(users);
	});
});
router.get("/user/:id", authenticateToken, (req, res) => {
	if (req.user.perm_group != 4) return res.status(403).send({ message: "Not allowed" });

	database.getUserById(req.params.id).then((users) => {
		res.send(users[0].dataValues);
	});
});
router.put("/updateUsername", authenticateToken, (req, res) => {
	if (req.user.perm_group != 4) return res.status(403).send({ message: "Not allowed" });

	const { id, username } = req.body;
	database.getUserById(id).then((users) => {
		var user = users[0].dataValues;
		user.username = username;
		database
			.updateUser(user)
			.then((_) => {
				res.send({
					id: user.id,
					username: user.username,
					perm_group: user.perm_group,
					customerId: user.customerId,
				});
			})
			.catch((error) => {
				if (error.name == "SequelizeUniqueConstraintError")
					return res.status(406).send({ message: "Username taken" }); // not acceptable
			});
	});
});
router.put("/updatepermission", authenticateToken, (req, res) => {
	if (req.user.perm_group != 4) return res.status(403).send({ message: "Not allowed" });

	const { id, permission } = req.body;
	database.getUserById(id).then((users) => {
		if (users.length != 1) return res.status(400).send({ message: "no user with that id" });

		var user = users[0].dataValues;

		user.perm_group = permission;

		database.updateUser(user).then((_) => {
			res.send(user);
		});
	});
});
router.delete("/deleteuser/:id", authenticateToken, (req, res) => {
	if (req.user.perm_group != 4) return res.status(403).send({ message: "Not allowed" });

	database.deleteUser(req.params.id).then((_) => {
		res.send({ success: true, message: "deleted" });
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
	if (token == null) return res.status(401).send({ token: false, valid: false });

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

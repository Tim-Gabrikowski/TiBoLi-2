const color = require("colors");

function handleError(err) {
	console.log(getDate().red);

	console.log(err.origin + "".gray);
	console.log(err.message);
	console.log(err.errorObject);

	if (err.message === undefined) {
		console.log("no error message found. Here is the complete error:");
		console.log(err);
	}

	try {
		err.response.status(500).send(err.message);
	} catch (error) {
		console.log("no response was send".red);
	}
	console.log("======".gray);
}

function getDate() {
	var today = new Date();

	return (
		today.toLocaleDateString("de-DE") +
		" " +
		today.toLocaleTimeString("de-DE")
	);
}

module.exports = handleError;

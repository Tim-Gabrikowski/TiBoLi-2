function mysqlDate() {
	return new Date().toJSON().slice(0, 19).replace("T", " ");
}
function mysqlDateToString(Idate) {
	if (Idate !== null) {
		var dateArray = Idate.split("T");
		var date = dateArray[0];
		var time = dateArray[1];
		var time = time.substring(0, 8);
		return date + " " + time;
	} else {
		return null;
	}
}

module.exports = {
	mysqlDate,
	mysqlDateToString,
};

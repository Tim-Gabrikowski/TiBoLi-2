function date(date) {
	var value = new Date(date);

	var hours = value.getHours();
	var minutes = "0" + value.getMinutes();
	var seconds = "0" + value.getSeconds();
	var day = "0" + value.getDate();
	var month = "0" + value.getMonth();
	var year = value.getFullYear();

	var formattedTime =
		hours +
		":" +
		minutes.substring(minutes.length - 2) +
		":" +
		seconds.substring(seconds.length - 2);

	var formattedDate =
		day.substring(day.length - 2) +
		"." +
		month.substring(month.length - 2) +
		"." +
		year;
	return formattedDate + " " + formattedTime;
}
console.log(date(1648655143021));

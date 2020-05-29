var currentDayEl = $("#currentDay");

// Get current date for the header and display it.
var currentDay = moment().format('LLLL');
currentDayEl.text(currentDay);
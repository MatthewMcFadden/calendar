// Array of times 7 AM to 9 PM
const times = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

// Updates past, present, future time-blocks every 30 seconds(set up at top)
var updateInterval;

// Gets the current date
var currentDate = moment().clone();

// Set's the current date in the header
function setCurrentDateLabel() {
  // Set format: "Day of the Week, Month Day hour:minutes am/pm"
  $("#currentDay").text(currentDate.format('dddd, MMMM Do h:mm a'));
}

// Saving into local storage
function handleSave() {
  var saveInLocal = $(this).siblings(".description");
  var hour = saveInLocal.attr("data-hour");
  var text = saveInLocal.val();
  localStorage.setItem(getStoreDatePrefix() + hour.trim(), text.trim());
}

// Loads current day onto the page
function loadDay() {
  clearInterval(updateInterval);

  $(".container").html(""); // Clear out old data
  // Creates time-blocks (from CONSTANT at top)
  for (var i = 0; i < times.length; i++) {
    $(".container").append(createTimeBlock(times[i]));
  }

  // Updates past, present, and future time-blocks every 30 seconds(set up at top)
  updateInterval = setInterval(checkTimeBlocks, timeBlockCheck);
}

// Checks time blocks to check their past/future tense
function checkTimeBlocks() {
  console.log("Check Time Blocks Active");
  var $descriptions = $('.description');
  $descriptions.each(function (index) {
    // Get the hour
    var hour12 = $(this).attr("data-hour");
    var t = getMoment12H(hour12);
    var tense = getTense(t);

    // if statement to check for past present or future
    if ($(this).hasClass(tense)) {
    } else if (tense === "present") {
        $(this).removeClass("past future");
    } else if (tense === "past") {
        $(this).removeClass("present future");
    } else if (tense === "future") {
        $(this).removeClass("past present");
    } else {
        alert("Unknown Tense");
    }
    $(this).addClass(tense);
  });
}

// Creates time blocks in HTML format
function createTimeBlock(hour24) {
  var row = createEl("div", "row");
  var timeBlock = createEl("div", "time-block");
  timeBlock.appendChild(row);
  var colHour = createEl("div", "col-sm-1 col-12 pt-3 hour", hour24);
  row.appendChild(colHour);
  var colText = createEl("textarea", "col-sm-10 col-12 description", hour24);
  row.appendChild(colText);
  var colSave = createEl("div", "col-sm-1 col-12 saveBtn");
  row.appendChild(colSave);

  // save button icon
  var iconSave = createEl("i", "far fa-save");
  colSave.appendChild(iconSave);

  return timeBlock;
}

// Create a single page element
function createEl(tag, cls, hour24) {
  var el = document.createElement(tag);
  
  if (hour24) {
    var t = getMoment24H(hour24);
    var displayHour = formatAmPm(t);
    if (cls.includes("description")) {
        // description class
        cls += " " + getTense(t);
        el.textContent = localStorage.getItem(getStoreDatePrefix() + displayHour);
        el.setAttribute("data-hour", displayHour);
    } else {
        // hour class
        el.textContent = displayHour.padEnd(4, " ");
    }
  }
  // Sets class on the element
  el.setAttribute("class", cls);
  return el;
}

// Check to see if the specified time is in the past present or future compared to time now.
function getTense(t) {
  var cls;
  var n = moment();

  if (n.isSame(t, "hour") &&
      n.isSame(t, "day") &&
      n.isSame(t, "month") &&
      n.isSame(t, "year")) {
      cls = "present";
  } else if (n.isAfter(t)) {
      cls = "past"
  } else {
      cls = "future";
  }
  return cls;
}

// Get string prefix for localStorage based off currentDate
function getStoreDatePrefix() {
  return currentDate.format("YYYYMMDD");
}

// Return the moment formatted as a 12-hour string with AM/PM time
function formatAmPm(m) {
  return m.format("h A");
}

// Create a new moment based off current date and a 12hr AM/PM format time string
function getMoment12H(hour12) {
  return moment(currentDate.format("YYYYMMDD ") + hour12, "YYYYMMDD hA");
}

// Create a new moment based off current date and a 24hr format time string
function getMoment24H(hour24) {
  return moment(currentDate.format("YYYYMMDD ") + hour24, "YYYYMMDD H");
}

// Gets Webpage Ready
$(function () {
  // Set the date in the header
  setCurrentDateLabel();

  // Setup Save Button Events through the container element
  $(".container").on("click", ".saveBtn", handleSave);

  // Load the day into the view 
  loadDay();
})
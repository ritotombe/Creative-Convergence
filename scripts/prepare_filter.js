// This file contains the logic to change the filters UI, 
// for data change please check at ./filter.js
// However, this file also contains on how the options filled in.

// Initiate the option type contants
const VENUE_SELECTED = "venue"
const TYPE_SELECTED = "type"
const SCHOOL_SELECTED = "school"

// Initiate selected options array
var venuesSelected = []
var schoolsSelected = []
var typesSelected = []

// Initiate which type of option was selected
var filterSelected = ""

// Intitate "check all" button state in each option type
var checkAllState = {
  "venue": true,
  "type": true,
  "school": true
}

// Initiate all data into the selected option array
populateOptions()

// Change the appearance of the chec all button and all the lists if clickled
$('.check-all').click(function() {
  if ($(this).hasClass("active")) {
    $(".list-item").removeClass("active");
    $(".check-all").removeClass("active")
    $(".check-all").html("CheckAll")
  } else {
    $(".list-item").addClass("active");
    $(".check-all").addClass("active")
    $(".check-all").html("Uncheck All")
  }
})

$('#options').on("click", ".list-item",function() {
  if ($(this).hasClass("active")) {
    $(this).removeClass("active");
  } else {
    $(this).addClass("active");
  }
})



// mode = 2 -> initialise ALL
function populateLists(mode){
  if (mode == 2){
    venues = sortOnKeys(venues)
    venuesSelected = Object.keys(venues)
    types = sortOnKeys(types)
    typesSelected = Object.keys(types)
    schools = sortOnKeys(schools)
    schoolsSelected = Object.keys(schools)
    $(".check-all").addClass("active");
    $(".check-all").html("Uncheck All");
  }

  $("#venues-selected").html(venuesSelected.length)
  $("#types-selected").html(typesSelected.length)
  $("#schools-selected").html(schoolsSelected.length)

  initiateOptionPanePopulateClickListener("#venues", venues, "Venue/s", VENUE_SELECTED, venuesSelected)
  initiateOptionPanePopulateClickListener("#schools", schools, "School/s", SCHOOL_SELECTED, schoolsSelected)
  initiateOptionPanePopulateClickListener("#type", types, "Type/s", TYPE_SELECTED, typesSelected)
}


// Click handler on the filter button to populate which data will be shown
function initiateOptionPanePopulateClickListener(id, items, title, type, selected){
  $(id).on("click", () => {
    // Populate the options 
    let innerHTML = "";
    $("#options").html(innerHTML)
    for (item in items){
      if (selected.indexOf(items[item]) >= 0){
        innerHTML += `<li class = "list-item btn btn-block btn-lg btn-info notransition active">${items[item]}</li>`
      } else {
        innerHTML += `<li class = "list-item btn btn-block btn-lg btn-info notransition">${items[item]}</li>`
      }
    }
    $(".title").html(title);
    $("#options").html(innerHTML);
  
    // Setup the check all status based on the type
    if (checkAllState[type]) {
      setCheckAllActive(type)
    } else {
      setCheckAllInactive(type)
    }
  
    // set the state of opened option type
    filterSelected = type
  })
}


function setCheckAllActive(type){
  $(".check-all").addClass("active")
  $(".check-all").html("Uncheck All")
}

function setCheckAllInactive(type){
  $(".check-all").removeClass("active")
  $(".check-all").html("Check All")
}

function populateOptions(filteredData) {
  // whole data
	let data = JSON.parse(localStorage.getItem(SOURCE))
	// filtered data
	if (filteredData) {
		data = filteredData
	}

  venues = {}
  schools = {}
  types = {}
  venuesSelected = []
  schoolsSelected = []
  typesSelected = []

  
  for (item in data) {
      if (!(data[item].venue in venues)) {
          venues[data[item].venue] = data[item].venue
      }
      if (!(data[item].school in schools)) {
          schools[data[item].school] = data[item].school
      }
      if (!(data[item].type in types)) {
          types[data[item].type] = data[item].type
      }
  }

  venues =  sortOnKeys(venues)

  populateLists(2)
}

function removeHelper(array, index) {
  if (index > -1) {
    array.splice(index, 1);
  }
  return array
}

function sortOnKeys(dict) {

  var sorted = [];
  for(var key in dict) {
      sorted[sorted.length] = key;
  }
  sorted.sort();

  var tempDict = {};
  for(var i = 0; i < sorted.length; i++) {
      tempDict[sorted[i]] = dict[sorted[i]];
  }

  return tempDict;
}

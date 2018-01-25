// This contains the logic to change the filters UI, for data change please check at ./filter.js

const VENUE_SELECTED = "venue"
const TYPE_SELECTED = "type"
const SCHOOL_SELECTED = "school"

var venuesSelected = []
var schoolsSelected = []
var typesSelected = []
var filterSelected = ""

var checkAllState = {
  VENUE_SELECTED: true,
  TYPE_SELECTED: true,
  SCHOOL_SELECTED: true
}

populateLists(2)

$("#venues").on("click", () => {
  let innerHTML = "";
  $("#options").html(innerHTML)
  for (item in venues){
    if (venuesSelected.indexOf(venues[item]) >= 0){
      innerHTML += `<li class = "list-item btn btn-block btn-lg btn-info notransition active">${venues[item]}</li>`
    } else {
      innerHTML += `<li class = "list-item btn btn-block btn-lg btn-info notransition">${venues[item]}</li>`
    }
  }
  $(".title").html("Venue/s");
  $("#options").html(innerHTML);

  if (checkAllState.VENUE_SELECTED) {
    setCheckAllActive(VENUE_SELECTED)
  } else {
    setCheckAllInactive(VENUE_SELECTED)
  }

  filterSelected = VENUE_SELECTED
})

$("#schools").on("click", () => {
  let innerHTML = "";
  $("#options").html(innerHTML)
  for (item in schools){
    if (schoolsSelected.indexOf(schools[item]) >= 0){
      innerHTML += `<li class = "list-item btn btn-block btn-lg btn-info notransition active">${schools[item]}</li>`
    } else {
      innerHTML += `<li class = "list-item btn btn-block btn-lg btn-info notransition">${schools[item]}</li>`
    }
  }
  $(".title").html("School/s");
  $("#options").html(innerHTML);

  if (checkAllState.SCHOOL_SELECTED) {
    setCheckAllActive(SCHOOL_SELECTED)
  } else {
    setCheckAllInactive(SCHOOL_SELECTED)
  }

  filterSelected = SCHOOL_SELECTED
})

$("#type").on("click", () => {
  let innerHTML = "";
  $("#options").html(innerHTML)
  for (item in types){
    if (typesSelected.indexOf(types[item]) >= 0){
      innerHTML += `<li class = "list-item btn btn-block btn-lg btn-info notransition active">${types[item]}</li>`
    } else {
      innerHTML += `<li class = "list-item btn btn-block btn-lg btn-info notransition">${types[item]}</li>`
    }
  }
  $(".title").html("Type/s");
  $("#options").html(innerHTML);

  if (checkAllState.TYPE_SELECTED) {
    setCheckAllActive(TYPE_SELECTED)
  } else {
    setCheckAllInactive(TYPE_SELECTED)
  }

  filterSelected = TYPE_SELECTED
})

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

  // if (!$(".check-all").hasClass("active") && mode != 1) {
  //   $(".check-all").addClass("active");
  //   $(".check-all").html("Uncheck All");
  // }
}

function setCheckAllActive(type){
  $(".check-all").addClass("active")
  $(".check-all").html("Uncheck All")
}

function setCheckAllInactive(type){
  $(".check-all").removeClass("active")
  $(".check-all").html("Check All")
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

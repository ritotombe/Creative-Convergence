/*
This file contains all initiation of mthe tool components except the map component.
It also contains all filters contents initialisation
Here are the list of the components:
- Filter:
	1. Main search (Typeahead - Bootstrap - Flat-ui.js)
	2. Date picker (Datepicker - Flatpickr.js)
	3. Options such as Venues, Participating Schools, and Types
	4. Sliders for Young People Percentage and Household Income (Sliders - Bootstrap - Flat-ui.js)
	5. Switch for Population Density Layer (Switch - Bootstrap - Flat-ui.js)
- List View:
	1. The table and its components (pagination, row per page, export to spread sheet) Uses DataTable.js
*/

//  All component content initiation
var rawDataTable;
var rawSchoolTable;
var searchQuery = []
var selectedCompany = [];
var selectedWork = [];
var selectedPlace = [];
var selectedSchool = [];

// Main Pane Selector
$('#tab-buttons a').click(function () {
	var $index = $(this).index();
	$('#main-panel-container').animate({
		left: -$('#main_panel').width() * $index
	}, 400);
});

// Initiate filters
initiateTypeahead();
initiateDatePicker();
initiateOptions();
initiateSliders();
initiateInfo();
initiateSwitch();

// initiate table
rawDataTable = initiateRawData();
schoolDataTable = initiateSchoolData();




// FUNCTIONS
function initiateTypeahead() {

	// Initiate list of company, works, and place that will be listed in suggestion
	let companyNames = []
	let workNames = []
	let placeNames = []
	let schoolNames = []

	// Do not show an item if it has been selected
	let filter = function (suggestions, selected) {
		return $.grep(suggestions, function (suggestion) {
			return $.inArray(suggestion, selected) === -1;
		});
	}

	// Get all data and fill the list of company, works, and place
	let data = JSON.parse(localStorage.getItem(SOURCE))
	let schoolData = JSON.parse(localStorage.getItem('school-data'))

	for (item in data) {
		if (companyNames.indexOf(data[item].company) == -1) {
			companyNames.push(data[item].company)
		}
		if (workNames.indexOf(data[item].creative_work) == -1) {
			workNames.push(data[item].creative_work)
		}
		if (placeNames.indexOf(data[item].venue.split(', ')[1]) == -1) {
			placeNames.push(data[item].venue.split(', ')[1])
		}
	}

	// School data
	for (item in schoolData) {

		if (schoolNames.indexOf(schoolData[item].school) == -1) {
			schoolNames.push(schoolData[item].school)
		}
	}

	// Setup the suggestion engines
	let company = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.whitespace,
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		limit: 5,
		local: companyNames
	});
	let work = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.whitespace,
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		limit: 5,
		local: workNames
	});
	let place = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.whitespace,
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		limit: 5,
		local: placeNames
	});
	let school = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.whitespace,
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		limit: 5,
		local: schoolNames
	});


	company.initialize()
	work.initialize()
	place.initialize()
	school.initialize()

	// set colors based on item category
	$(".tagsinput").tagsinput({
		tagClass: function (item) {
			switch (item.kind) {
				case 'company':
					return 'label label-blue';
				case 'work':
					return 'label label-green';
				case 'place':
					return 'label label-brown';
				case 'school':
					return 'label label-purple';
			}
		},
		itemValue: 'text',
		itemText: 'text'
	});

	// The input field initiation
	$('.bootstrap-tagsinput input').attr("placeholder", "");

	// Set up the suggestion engine to the input field
	$('.bootstrap-tagsinput input').typeahead({
		highlight: true
	}, {
			name: 'company',
			source: function (query, cb) {
				company.get(query, function (suggestions) {
					cb(filter(suggestions, searchQueryCompany));
				});
			},
			displayKey: function (s) {
				return s
			},
			templates: {
				header: '<hr><small class="tt-category-header">Company</small><hr>'
			}
		}, {
			name: 'work',
			source: function (query, cb) {
				work.get(query, function (suggestions) {
					cb(filter(suggestions, searchQueryWork));
				});
			},
			displayKey: function (s) {
				return s
			},
			templates: {
				header: '<hr><small class="tt-category-header">Creative Work</small><hr>'
			}
		}, {
			name: 'place',
			source: function (query, cb) {
				place.get(query, function (suggestions) {
					cb(filter(suggestions, searchQueryLocation));
				});
			},
			displayKey: function (s) {
				return s
			},
			templates: {
				header: '<hr><small class="tt-category-header">Place</small><hr>'
			}
		}, {
			name: 'school',
			source: function (query, cb) {
				school.get(query, function (suggestions) {
					cb(filter(suggestions, searchQuerySchool));
				});
			},
			displayKey: function (s) {
				return s
			},
			templates: {
				header: '<hr><small class="tt-category-header">School</small><hr>'
			}
		})
		.on('typeahead:selected', function (ev, s, dsName) {
			if (dsName == 'company') {
				selectedCompany.push(s)
			} else if (dsName == 'work') {
				selectedWork.push(s)
			} else if (dsName == 'place') {
				selectedPlace.push(s)
			} else if (dsName == 'school') {
				selectedSchool.push(s)
			}

			$('.tagsinput').tagsinput('add', {
				text: s,
				kind: dsName
			})
			$('.bootstrap-tagsinput input').typeahead('close');
			$('.bootstrap-tagsinput input').typeahead('val', '');
		});
}


function initiateDatePicker() {
	$("#date_picker_from").flatpickr({
		allowInput: true,
		dateFormat: "d/m/Y"
	});

	$("#date_picker_to").flatpickr({
		allowInput: true,
		dateFormat: "d/m/Y"
	});

}

function initiateOptions() {
	$("#options-container").css('height',
		$("#filter_panel").height() -
		(
			$(".options-pane").offset().top +
			$(".options-pane-head").height() +
			$(".check-all").height() +
			parseInt($("#tab-buttons").css("marginBottom")) + 3
		)
	)

	$('.filter-btn').click(function () {
		$('.filter-group, #main-search-panel').animate({
			left: -$('#filter_panel').width(),
		}, 200, function () {
		});
		$('.options-pane').animate({
			right: 0,
		}, 200, function () {
		});
	})

	$('.back-button').click(function () {
		$('.filter-group, #main-search-panel').animate({
			left: 0,
		}, 200, function () {
		});
		$('.options-pane').animate({
			right: -$('#filter_panel').width(),
		}, 200, function () {
		});
	})
}

function initiateSliders() {
	$('#flat-slider-age').slider({
		orientation: 'horizontal',
		range: true,
		values: [20, 60],
		max: 60,
		min: 20,
		slide: function (event, ui) {
			$("#min-age").html(ui.values[0] + " %");
			$("#max-age").html(ui.values[1] + " %");
		}
	});
	$("#min-age").html($("#flat-slider-age").slider("values", 0) + " %");
	$("#max-age").html($("#flat-slider-age").slider("values", 1) + " %");

	$('#flat-slider-household').slider({
		orientation: 'horizontal',
		range: true,
		values: [700, 2100],
		max: 2100,
		min: 700,
		slide: function (event, ui) {
			$("#min-income").html("$" + ui.values[0]);
			$("#max-income").html("$" + ui.values[1]);
		}
	});
	$("#min-income").html("$" + $("#flat-slider-household").slider("values", 0));
	$("#max-income").html("$" + $("#flat-slider-household").slider("values", 1));
}


function initiateInfo() {
	$('#popover-age-info').popover({
		trigger: 'hover',
		container: '#filter_panel'
	});

	$('#popover-income-info').popover({
		trigger: 'hover',
		container: '#filter_panel'
	});
}

function initiateSwitch() {
	$('#label-switch').bootstrapSwitch('onText', 'On');
	$('#label-switch').bootstrapSwitch('offText', 'Off');
	$('.bootstrap-switch-id-label-switch').on('switchChange.bootstrapSwitch', function () {
		if ($(this).hasClass('bootstrap-switch-on')) {
			$('.population').show()
		} else {
			$('.population').hide()
		}
	});

	$('#arc-label-switch').bootstrapSwitch('onText', 'On');
	$('#arc-label-switch').bootstrapSwitch('offText', 'Off');
	$('#arc-label-switch').bootstrapSwitch('state', false);
	$('.bootstrap-switch-id-arc-label-switch').on('switchChange.bootstrapSwitch', function () {
		if ($(this).hasClass('bootstrap-switch-on')) {
			$('.arcs').show()
		} else {
			$('.arcs').hide()
		}
	});

	$('#datatable-switch').bootstrapSwitch('onText', 'Main');
	$('#datatable-switch').bootstrapSwitch('offText', 'School');
	$(function () {
		$('#school-data_wrapper').hide()
		$('#toggle-table').hide()
		if (localStorage.getItem('school-data')) {
			$('#toggle-table').show()
		} else {
			$('#toggle-table').hide()
		}

	})
	$('.bootstrap-switch-id-datatable-switch').on('switchChange.bootstrapSwitch', function () {
		if ($(this).hasClass('bootstrap-switch-on')) {
			$('#raw-data_wrapper').show()
			$('#school-data_wrapper').hide()
		} else {
			$('#raw-data_wrapper').hide()
			$('#school-data_wrapper').show()
		}
	});

	$('#toggle-legend').click(function () {
		$('#legend').toggle()
	})

	$('#show-only-venue').click(function () {
		$('#show-only-venue').addClass('active')
		$('#show-both').removeClass('active')
		$('#show-only-school').removeClass('active')
		$('#arc-label-switch').bootstrapSwitch('state', true);
		$('.arcs').show()
		$('.nodes').show()
		$('.school-nodes').hide()
	})

	$('#show-both').click(function () {
		$('#show-only-venue').removeClass('active')
		$('#show-both').addClass('active')
		$('#show-only-school').removeClass('active')
		$('#arc-label-switch').bootstrapSwitch('state', true);
		$('.arcs').show()
		$('.nodes').show()
		$('.school-nodes').show()
	})

	$('#show-only-school').click(function () {
		$('#show-only-venue').removeClass('active')
		$('#show-both').removeClass('active')
		$('#show-only-school').addClass('active')
		$('#arc-label-switch').bootstrapSwitch('state', false);
		$('.arcs').hide()
		$('.nodes').hide()
		$('.school-nodes').show()
	})
}

function initiateRawData() {
	return $('#raw-data').DataTable({
		data: JSON.parse(localStorage.getItem(SOURCE)),
		columns: [{
			"data": "company"
		},
		{
			"data": "creative_work"
		},
		{
			"data": "venue"
		},
		{
			"data": "suburb"
		},
		{
			"data": "latitude"
		},
		{
			"data": "longitude"
		},
		{
			"data": "date",
			"type": "date"
		},
		{
			"data": "school"
		},
		{
			"data": "type"
		},
		{
			"data": "age"
		},
		{
			"data": "income"
		},
		],
		order: [
			[6, "asc"]
		],
		//  searching: false,
		dom: 'flBtip',
		buttons: [{
			extend: 'excel',
			text: 'Export to Spreadsheet..',
			exportOptions: {
				format: {
					header: function (data, columnIdx) {
						return data.toLowerCase().replace(/ /g, "_");
					}
				},
				page: "all"
			}
		}],
		scrollX: true
	});
}

function initiateSchoolData() {
	return $('#school-data').DataTable({
		data: JSON.parse(localStorage.getItem('school-data')),
		columns: [{
			"data": "company"
		},
		{
			"data": "creative_work"
		},
		{
			"data": "school"
		},
		{
			"data": "suburb"
		},
		{
			"data": "avg_ticket_cost"
		},
		{
			"data": "student_attended"
		},
		{
			"data": "date",
			"type": "date"
		},
		{
			"data": "venue"
		},
		{
			"data": "type"
		},
		{
			"data": "age"
		},
		{
			"data": "income"
		},
		],
		order: [
			[6, "asc"]
		],
		//  searching: false,
		dom: 'flBtip',
		buttons: [{
			extend: 'excel',
			text: 'Export to Spreadsheet..',
			exportOptions: {
				format: {
					header: function (data, columnIdx) {
						return data.toLowerCase().replace(/ /g, "_");
					}
				},
				page: "all"
			}
		}],
		scrollX: true
	});
}



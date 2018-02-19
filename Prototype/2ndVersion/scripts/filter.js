// This file is to change state of data that shown in the main panel, for UI changes please check ./prepare_filter.js
// As such this is where the logic of the filters 

// initiate filtered data (subset of whole data that has been filtered)
var filteredData = []

// Search query fom main search, divided by its category
var searchQueryCompany = []
var searchQueryWork = []
var searchQueryLocation = []

// Initiate min date and max date
var dateMin = 0,
	dateMax = 0

// Logic of the main search
$('.tagsinput-primary > input').on('change', () => {
    
    // 1. Clear all filtered data as this is always the start point
	filteredData = []
	searchQueryCompany = []
	searchQueryWork = []
	searchQueryLocation = []

    // 2. Populate all the inputs from the search field into query variable
	searchQuery = $('.tagsinput-primary > input').tagsinput('items');
	if (searchQuery.length > 0) {
		kind = searchQuery[0].kind
		for (item in searchQuery) {
			if (searchQuery[item].kind == 'company') {
				searchQueryCompany.push(searchQuery[item].text)
			} else if (searchQuery[item].kind == 'work') {
				searchQueryWork.push(searchQuery[item].text)
			} else if (searchQuery[item].kind == 'place') {
				searchQueryLocation.push(searchQuery[item].text)
			}
		}
        // 3. Reinitialise the table in the list view to show all the data
		rawDataTable
			.search('')
			.columns().search('')
			.draw();

        // 4. Query the table based on the query variables
		if (searchQueryCompany.length > 0) {
			searchBar('company', searchQueryCompany)
		}
		if (searchQueryWork.length > 0) {
			searchBar('creative_work', searchQueryWork)
		}
		if (searchQueryLocation.length > 0) {
			searchBar('place', searchQueryLocation)
		}

	} else {
		rawDataTable
			.search('')
			.columns().search('')
			.draw();
	}

	// // PANDORA BOX - Uncomment only if smart (not really smart thou) search turned on (only show data that has been filtered from the search bar)
	// let data = JSON.parse(localStorage.getItem("data"))
	// if (!(searchQueryCompany.length == 0 & searchQueryWork.length == 0 & searchQueryLocation.length == 0)){
	//   if (searchQueryCompany.length == 0) {
	//     for (item in data) {
	//       if (searchQueryCompany.indexOf(data[item].company) == -1 & !containsObject(data[item], filteredData)){
	//         searchQueryCompany.push(data[item].company)
	//       }
	//     }
	//   }
	//   if (searchQueryWork.length == 0) {
	//     for (item in data) {
	//       if (searchQueryWork.indexOf(data[item].creative_work) == -1 & !containsObject(data[item], filteredData)){
	//         searchQueryWork.push(data[item].creative_work)
	//       }
	//     }
	//   }
	//   if (searchQueryLocation.length == 0) {
	//     for (item in data) {
	//       if (searchQueryLocation.indexOf(data[item].venue.split(', ')[1]) == -1 & !containsObject(data[item], filteredData)){
	//         searchQueryLocation.push(data[item].venue.split(', ')[1])
	//       }
	//     }
	//   }
	// }

	renderAll()
})

// CUSTOM SEARCH (QUERY) FOR DATE, AGE, AND INCOME
// Add custom search function for date filter automatically changes if table rendered
$.fn.dataTable.ext.search.push(
	function(settings, data, dataIndex) {
		var date = Date.parse(data[5]) || 0;
		if ((dateMin == 0 && dateMax == 0) ||
			(dateMin == 0 && date <= dateMax) ||
			(dateMin <= date && dateMax == 0) ||
			(dateMin <= date && date <= dateMax)) {
			return true;
		}
		return false;
	}
);

// Add custom search function for age filter
$.fn.dataTable.ext.search.push(
	function(settings, data, dataIndex) {
		let minAge = $("#flat-slider-age").slider("values", 0)
		let maxAge = $("#flat-slider-age").slider("values", 1)
		var age = data[8] || 0;
		if ((minAge == 0 && maxAge == 30) ||
			(minAge == 0 && age <= maxAge) ||
			(minAge <= age && maxAge == 30) ||
			(minAge <= age && age <= maxAge)) {
			return true;
		}
		return false;
	}
);

// Add custom search function for income filter
$.fn.dataTable.ext.search.push(
	function(settings, data, dataIndex) {
		let minIncome = $("#flat-slider-household").slider("values", 0)
		let maxIncome = $("#flat-slider-household").slider("values", 1)
		var income = data[9] || 0;
		if ((minIncome == 200 && maxIncome == 3000) ||
			(minIncome == 200 && income <= maxIncome) ||
			(minIncome <= income && maxIncome == 3000) ||
			(minIncome <= income && income <= maxIncome)) {
			return true;
        }
        
		return false;
	}
);
// END - CUSTOM SEARCH (QUERY) FOR DATE, AGE, AND INCOME

$('#date_picker_from, #date_picker_to').on('change', changeDate)

// Handler function if date schanges
function changeDate() {
	filteredData = []
	filteredDateMin = $("#date_picker_from").val()
	filteredDateMax = $("#date_picker_to").val()
	dateMin = getDateFromFormat(filteredDateMin, 'dd/MM/yyyy')
	dateMax = getDateFromFormat(filteredDateMax, 'dd/MM/yyyy')
	rawDataTable.draw()
	renderAll()
}

// Age and Income handler if the slider value changes, I have set timer as we dont want it filters when the user still sliding. 
$('.age-value').on('DOMSubtreeModified', function() {
	clearTimeout($(this).data('keytimer'));
	$(this).data('keytimer', setTimeout(function() {
		filteredData = []
		rawDataTable.draw()
		renderAll()
	}, 500));
})
$('.income-value').on('DOMSubtreeModified', function() {
	clearTimeout($(this).data('keytimer'));
	$(this).data('keytimer', setTimeout(function() {
		filteredData = []
		rawDataTable.draw()
		renderAll()
	}, 500));
})

// Populate the options list and variables if 
$('.check-all').click(function() {
    filteredData = []

    // Column number in the table in which we were going to filter
	let columnNumber = ""
    let source = ""
    
    // if there is a filter selected, set the source of the query and column to filter. Furthermore, set the check all state.
	switch (filterSelected) {
		case (VENUE_SELECTED):
			columnNumber = 2 
			if (checkAllState[VENUE_SELECTED]) {
				venuesSelected = []
				checkAllState[VENUE_SELECTED] = false
			} else {
				venuesSelected = Object.keys(venues)
				checkAllState[VENUE_SELECTED] = true
			}
			source = venuesSelected
			break
		case (SCHOOL_SELECTED):
			columnNumber = 6
			if (checkAllState[SCHOOL_SELECTED]) {
				schoolsSelected = []
				checkAllState[SCHOOL_SELECTED] = false
			} else {
				schoolsSelected = Object.keys(schools)
				checkAllState[SCHOOL_SELECTED] = true
			}
			source = schoolsSelected
			break
		case (TYPE_SELECTED):
			columnNumber = 7
			if (checkAllState[TYPE_SELECTED]) {
				typesSelected = []
				checkAllState[TYPE_SELECTED] = false
			} else {
				typesSelected = Object.keys(types)
				checkAllState[TYPE_SELECTED] = true
			}
			source = typesSelected
			break
    }
    
    // Search the table based on selected source and column number
	if (source.length == 0) {
        // if no source, show all data
		rawDataTable
			.columns(columnNumber)
			.search("%%/", true, false)
			.draw();
	} else {
        // there is source, this filter it
		rawDataTable
			.columns(columnNumber)
			.search(prepareQuery(source), true, false)
			.draw();
	}

	let afterFilter = rawDataTable.rows({
		search: 'applied'
	}).data()

    // Apply the filtered table data into the diltered data variable tobe shown in the map
	for (item in afterFilter) {
		if (typeof afterFilter[item] == "object" && afterFilter[item].company) {
			filteredData.push(afterFilter[item])
		}
	}

	renderMap(filteredData);
	populateLists();
})

// The logic is about the same with the check all button 
$('#options').on("click", ".list-item", function() {
	filteredData = []

	let columnNumber = ""
	let source = ""

	switch (filterSelected) {
		case (VENUE_SELECTED):
			columnNumber = 2
			source = venuesSelected
			break
		case (SCHOOL_SELECTED):
			columnNumber = 6
			source = schoolsSelected
			break
		case (TYPE_SELECTED):
			columnNumber = 7
			source = typesSelected
			break
	}

	if ($(this).hasClass("active")) {
		source.push($(this).html())
	} else {
		var selectedItem = $(this).html()
		source = removeHelper(source, source.indexOf(selectedItem))
	}

	queryData(columnNumber, source)

	let afterFilter = rawDataTable.rows({
		search: 'applied'
	}).data()

	for (item in afterFilter) {
		if (typeof afterFilter[item] == "object" && afterFilter[item].company) {
			filteredData.push(afterFilter[item])
		}
	}

	renderMap(filteredData);
	populateLists()
})

// reset all to reinitialise all filters
$("#reset-btn").on("click", function() {
	filteredData = []

	$(".tagsinput").tagsinput("removeAll")
	$("#date_picker_from").val("")
	$("#date_picker_to").val("")
	initiateSliders()
	dateMin = 0
	dateMax = 0

	checkAllState[SCHOOL_SELECTED] = true
	checkAllState[TYPE_SELECTED] = true
	checkAllState[VENUE_SELECTED] = true
})

// rerender map along with the filtered data
function renderAll() {
	let afterFilter = rawDataTable.rows({
		search: 'applied'
	}).data()

	for (item in afterFilter) {
		if (typeof afterFilter[item] == "object" && afterFilter[item].company) {
			filteredData.push(afterFilter[item])
		}
	}

	populateOptions(filteredData)
	renderMap(filteredData);
}

// does the querying of the data based on the column number and query terms
function queryData(columnNumber, source) {
	rawDataTable
		.columns(columnNumber)
		.search(prepareQuery(source), true, false)
		.draw();
}

// main search's filtering logic
function searchBar(mode, queryTerms) {
    // prepare query by joining it with or operator
    queryTerms = prepareQuery(queryTerms)
    
    // search by regex
	switch (mode) {
		case 'company':
			rawDataTable
				.columns(0)
				.search(queryTerms, true, false)
				.draw();
			break;
		case 'creative_work':
			rawDataTable
				.columns(1)
				.search(queryTerms, true, false)
				.draw();
			break;
		case 'place':
			rawDataTable
				.columns(2)
				.search(queryTerms, true, false)
				.draw();
			break;
	}

}

// Join the query term by or operator as it will be searched using regex
function prepareQuery(queryTerms) {
	if (!queryTerms) return '';
	return queryTerms.join('|')
}

function containsObject(obj, list) {
	var i;
	for (i = 0; i < list.length; i++) {
		if (isEquivalent(list[i], obj)) {
			return true;
		}
	}

	return false;
}

//  THESE LAST TWO FUNCTIONS ARE USED ONLY IF THE PANDORA BOX OPENED (LINE 62)
function isEquivalent(a, b) {
	// Create arrays of property names
	var aProps = Object.getOwnPropertyNames(a);
	var bProps = Object.getOwnPropertyNames(b);

	// If number of properties is different,
	// objects are not equivalent
	if (aProps.length != bProps.length) {
		return false;
	}

	for (var i = 0; i < aProps.length; i++) {
		var propName = aProps[i];

		// If values of same property are not equal,
		// objects are not equivalent
		if (a[propName] !== b[propName]) {
			return false;
		}
	}

	// If we made it this far, objects
	// are considered equivalent
	return true;
}

// Render all for initialisation
renderAll()

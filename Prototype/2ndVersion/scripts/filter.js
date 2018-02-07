// This to change state of data that shown in the main panel, for UI changes please check ./prepare_filter.js

var filteredData = []
var searchQueryCompany = []
var searchQueryWork = []
var searchQueryLocation = []
var optionsTypes = {
    "venues" : "venues"
}
var dateMin = 0, dateMax = 0

// $(function() {

    $('.tagsinput-primary > input').on('change', () => {
        filteredData = []
        searchQueryCompany = []
        searchQueryWork = []
        searchQueryLocation = []

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

            rawDataTable
             .search( '' )
             .columns().search( '' )
             .draw();

            // console.log(1, searchQueryCompany, searchQueryWork, searchQueryLocation);
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
           .search( '' )
           .columns().search( '' )
           .draw();
        }

        // let test = rawDataTable.rows({
        //     search: 'applied'
        // }).data()

        // for (item in test) {
        //     if (typeof test[item] == "object" && test[item].company) {
        //         filteredData.push(test[item])
        //     }
        // }
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

        // renderMap(filteredData);
        // populateVenues()
    
        
        renderAll()
    })

    // Add custom search function for date filter
    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {

            // if (data[1]=="The Importance of Being Earnest"){
                // console.log(( Date.parse( data[5] ) ? Date.parse( data[5] )  0), data);
                
            // }

            var date = Date.parse( data[5] ) || 0; 

            if ( ( dateMin == 0 && dateMax == 0 ) ||
                ( dateMin == 0 && date <= dateMax ) ||
                ( dateMin <= date   && dateMax == 0  ) ||
                ( dateMin <= date   && date <= dateMax ) )
            {            
                return true;
            }
            
            return false;
        }
    );

    // Add custom search function for age filter
    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {

            let minAge = $( "#flat-slider-age" ).slider( "values", 0 )
            let maxAge = $( "#flat-slider-age" ).slider( "values", 1 )

            var age = data[8] || 0; 
            

            if ( ( minAge == 3 && maxAge == 90 ) ||
                ( minAge == 3 && age <= maxAge ) ||
                ( minAge <= age   && maxAge == 90 ) ||
                ( minAge <= age   && age <= maxAge ) )
            {            
                return true;
            }


            
            return false;
        }
    );

    // Add custom search function for income filter
    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {

            let minIncome = $( "#flat-slider-household" ).slider( "values", 0 )
            let maxIncome = $( "#flat-slider-household" ).slider( "values", 1 )

            var income = data[9] || 0; 
            

            if ( ( minIncome == 0 && maxIncome == 0 ) ||
                ( minIncome == 0 && income <= maxIncome ) ||
                ( minIncome <= income   && maxIncome == 0  ) ||
                ( minIncome <= income   && income <= maxIncome ) )
            {            
                return true;
            }
       
            
            return false;
        }
    );

    $('#date_picker_from, #date_picker_to').on('change', changeDate)

    function changeDate(){
        filteredData = []

        filteredDateMin = $("#date_picker_from").val()
        filteredDateMax = $("#date_picker_to").val()
      
        dateMin = getDateFromFormat(filteredDateMin, 'dd/MM/yyyy')
        dateMax = getDateFromFormat(filteredDateMax, 'dd/MM/yyyy')
        
        rawDataTable.draw()
        renderAll()  
    }

    $('.age-value').on('DOMSubtreeModified', function (){
        clearTimeout( $(this).data('keytimer') );

        $(this).data('keytimer', setTimeout(function() {
            filteredData = []
            rawDataTable.draw()
            renderAll() 
        },500)); 
    })

    $('.income-value').on('DOMSubtreeModified', function (){
        clearTimeout( $(this).data('keytimer') );

        $(this).data('keytimer', setTimeout(function() {
            filteredData = []
            rawDataTable.draw()
       
            
            renderAll() 
        },500)); 
    })


    $('.check-all').click(function() {
        filteredData = []

        let columnNumber = ""
        let source = ""

        switch (filterSelected) {
            case (VENUE_SELECTED):
                columnNumber = 2
                if (checkAllState.VENUE_SELECTED){
                    venuesSelected = []
                    checkAllState.VENUE_SELECTED = false
                } else {
                    venuesSelected = Object.keys(venues)
                    checkAllState.VENUE_SELECTED = true
                }
                source = venuesSelected
                break
            case (SCHOOL_SELECTED):
                columnNumber = 6
                if (checkAllState.SCHOOL_SELECTED){
                    schoolsSelected = []
                    checkAllState.SCHOOL_SELECTED = false
                } else {
                    schoolsSelected = Object.keys(schools)
                    checkAllState.SCHOOL_SELECTED = true
                }
                source = schoolsSelected
                break
            case (TYPE_SELECTED):
                columnNumber = 7
                if (checkAllState.TYPE_SELECTED){
                    typesSelected = []
                    checkAllState.TYPE_SELECTED = false 
                } else {
                    typesSelected = Object.keys(types)
                    checkAllState.TYPE_SELECTED =  true
                }
                source = typesSelected
                break
        }

        if (source.length == 0) {
            rawDataTable
            .columns(columnNumber)
            .search("%%/", true, false)
            .draw();
        } else {
            rawDataTable
            .columns(columnNumber)
            .search(prepareQuery(source), true, false)
            .draw();
        }
      
        let test = rawDataTable.rows( {search:'applied'} ).data()
      
        for (item in test) {
          if (typeof test[item] == "object" && test[item].company) {
            filteredData.push(test[item])
          }
        }
      
        renderMap(filteredData);
        populateLists(1);
      })

    $('#options').on("click", ".list-item",function() {
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
      
        let test = rawDataTable.rows( {search:'applied'} ).data()
      
        for (item in test) {
          if (typeof test[item] == "object" && test[item].company) {
            filteredData.push(test[item])
          }
        }
      
        renderMap(filteredData);
        populateLists()
    })

    $("#reset-btn").on("click", function(){
        filteredData = []

        $(".tagsinput").tagsinput("removeAll")
        $("#date_picker_from").val("")
        $("#date_picker_to").val("")
        initiateSliders()
        dateMin = 0
        dateMax = 0

        checkAllState.SCHOOL_SELECTED = true
        checkAllState.TYPE_SELECTED = true
        checkAllState.VENUE_SELECTED = true  
    })

    function renderAll() {
        let test = rawDataTable.rows({
            search: 'applied'
        }).data()

        for (item in test) {
            if (typeof test[item] == "object" && test[item].company) {
                filteredData.push(test[item])
            }
        }
        populateVenues()
        renderMap(filteredData);
    }

    function queryData(columnNumber, source){
        rawDataTable
        .columns(columnNumber)
        .search(prepareQuery(source), true, false )
        .draw();
    }

    function searchBar(mode, queryTerms) {
        queryTerms = prepareQuery(queryTerms)
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

    function prepareQuery(queryTerms) {
        if (!queryTerms) return '';
        return queryTerms.join('|')
    }

    function populateVenues() {
        let data = filteredData
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

    function containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (isEquivalent(list[i], obj)) {
                return true;
            }
        }

        return false;
    }

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

  renderAll()

// });

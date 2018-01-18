var filteredData = []
var searchQueryCompany = []
var searchQueryWork = []
var searchQueryLocation = []

$(function() {

    $('.tagsinput-primary > input').on('change', () => {
        filteredData = []
        searchQueryCompany = []
        searchQueryWork = []
        searchQueryLocation = []

        searchQuery = $('.tagsinput-primary > input').tagsinput('items');
        if (searchQuery.length > 0) {
            // console.log(searchQuery);
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

        let test = rawDataTable.rows({
            search: 'applied'
        }).data()

        for (item in test) {
            if (typeof test[item] == "object" && test[item].company) {
                filteredData.push(test[item])
            }
        }
        // // PANDORA BOX - Uncomment only if smart search turned on (only show data that has been filtered from the search bar)
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

        renderMap(filteredData);
        populateVenues()
    })

    // $('#options').on("click", ".list-item",function() {
    //   filteredData = []
    //
    //   console.log(venuesSelected);
    //
    //   rawDataTable
    //   .columns(2)
    //   .search(prepareQuery(venuesSelected), true )
    //   .draw();
    //
    //   let test = rawDataTable.rows( {search:'applied'} ).data()
    //
    //   for (item in test) {
    //     if (typeof test[item] == "object" && test[item].company) {
    //       filteredData.push(test[item])
    //     }
    //   }
    //
    //   console.log(1111, filteredData);
    //
    //   renderMap(filteredData);
    //   console.log(filteredData);
    //   // populateVenues();
    // })

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
        // console.log(queryTerms);
        if (!queryTerms) return '';
        return queryTerms.join('|')
    }

    function populateVenues() {
        let data = filteredData
        venues = {}
        venuesSelected = []
        for (item in data) {
            if (!(data[item].venue in venues)) {
                venues[data[item].venue] = data[item].venue
            }
        }

        populateLists()
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


});

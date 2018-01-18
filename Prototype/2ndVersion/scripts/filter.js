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

});

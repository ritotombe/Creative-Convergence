var geocoded = {}

$(function () {

    var googleMapsGeocodeURI = "http://maps.google.com/maps/api/geocode/json?address="

    $('#company-file-input').on('change', function () {
        var file = $(this)
        $('#upload-status').html("<span style='color:#2C3E50'>Loading..</span>")
        
        //Parse uploaded csv
        var json = Papa.parse(file[0].files[0], {
            header: true,
            complete: function (results, file) { //if parsed
                var promises = [];
                if (file.type == 'text/csv') {

                    //this is the parsed data
                    var mainData = results.data 
                    if (localStorage.getItem('geocode')){
                        geocoded = JSON.parse(localStorage.getItem('geocode'))
                    }
                    
                    
                    //calling google maps api for geocoding
                    for (i in mainData) {

                        //Push each call to promise
                        //I want to make an conditional call here.
                        //For example, if  
                        promises.push(
                            $.getJSON(googleMapsGeocodeURI + mainData[i].venue + ',' + mainData[i].suburb + ",victoria,australia")
                        )
                    }

                    $.when.apply($, promises).then(function () {
                        // console.log(arguments);
                        
                        for (i in arguments) {
                            var data = arguments[i][0]

                         
                            mainData[i].age = 0
                            mainData[i].income = 0

                            mainData[i].venue = `${mainData[i].venue}, ${mainData[i].suburb}`
                            
                            if (data.results[0]){
                                // console.log(data.results[0]);
                                
                                var address = data.results[0].address_components
                                var coord = data.results[0].geometry.location

                                mainData[i].latitude = coord.lat
                                mainData[i].longitude = coord.lng

                                if (!geocoded[mainData[i].venue]){
                                    geocoded[mainData[i].venue]  = data.results[0].geometry.location;
                                } 

                            } else {
                                if(geocoded[mainData[i].venue]){
                                    var coord = geocoded[mainData[i].venue]
                                    mainData[i].latitude = coord.lat
                                    mainData[i].longitude = coord.lng
                                } else {
                                    // $.ajaxSetup({
                                    //     async: false
                                    // });

                                    // $.getJSON(googleMapsGeocodeURI + mainData[i].venue + ',' + mainData[i].suburb + ",victoria,australia")

                                    // $.ajaxSetup({
                                    //     async: true
                                    // });
                                }
                            }

                                var AURINlocal = JSON.parse(localStorage.getItem('aurin-data'))
                                    for (j in polygonFeatures) {
                                        //Get the lga name if we found the lga of data item
                                        if(inside([mainData[i].longitude, mainData[i].latitude ], polygonFeatures[j].geometry.coordinates)){
                                        let lgaCode = polygonFeatures[j].properties.feature_code
                                        //Match the lga name with the abs data then map the socio economic data in to the main data
                                        var aurinAge = AURINlocal['age'][lgaCode]
                                        var aurinIncome = AURINlocal['income'][lgaCode]
                                        mainData[i].age = aurinAge
                                        mainData[i].income = aurinIncome
                                    }
                            }
                        }

                        
                        
                        localStorage.setItem("company-data", JSON.stringify(mainData))
                        localStorage.setItem("geocode", JSON.stringify(geocoded))

                        SOURCE = 'company-data'

                        //Reinitialise all contents and filters
                        //TODO: Put it in separate function
                        rawDataTable.destroy()
                        rawDataTable = initiateRawData()
                        $(".tagsinput").tagsinput("removeAll");
                        $('.bootstrap-tagsinput input').typeahead('destroy');
                        initiateTypeahead()
                        filteredData = []
                        renderAll()


                        $('#upload-status').html(file.name + " is uploaded and data is updated.")
                    }, function() {
                        // error occurred
                    });
                    
                } else {
                    $('#upload-status').html("<span style='color:#c0392b'>Please upload only csv file</span>")
                }

            },
            error: function (err, file) {
                $('#upload-status').html(err.message)
            }
        })
    })



})
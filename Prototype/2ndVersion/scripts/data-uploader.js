// This file contains logic if the user upload file into the list view.
// Algorithm:
// 1. Get the uploaded file from the input.
// 2. Put it in a variable.
// 3. Look up each data point on the google maps geocoding to get longitude and latitude.
// 4. Calculate its socio-economic data.
// 5. Reinitialise all components by using the uploaded data.
// 6. Render the map again.

var geocoded = {}

$(function () {

    var googleMapsGeocodeURI = "http://maps.google.com/maps/api/geocode/json?address="

    $('#company-file-input').on('change', function () {
        var file = $(this)
        
        // change the status of the uploading data
        $('#upload-status').html("<span style='color:#2C3E50'>Loading..</span>")
        
        //Parse uploaded csv
        var json = Papa.parse(file[0].files[0], {
            header: true,
            complete: function (results, file) { //if parse successful
                var promises = [];
                var calledObjects = [];
                if (file.type == 'text/csv') {

                    //this is the parsed data
                    var mainData = results.data 
                    if (localStorage.getItem('geocode')){
                        geocoded = JSON.parse(localStorage.getItem('geocode'))
                    }

                    var searchCoordData = []

                    for (i in mainData) {
                        if (!geocoded[`${mainData[i].venue}, ${mainData[i].suburb}`]){
                            searchCoordData.push(mainData[i])
                        }
                    }

                    var i = 0
                    function f() {
                        promises.push(
                            $.getJSON(`${googleMapsGeocodeURI}${searchCoordData[i].venue},${searchCoordData[i].suburb},victoria,australia`)
                        )  
                        calledObjects.push(`${searchCoordData[i].venue}, ${searchCoordData[i].suburb}`)
                        i++;
                        if( i < searchCoordData.length ){
                            if (i % 3 == 0) {
                                setTimeout(f, 1001);
                            } else {
                                f()
                            }
                        } else {
                            load()
                        }
                        $('#upload-status span').html(`${i} of ${searchCoordData.length} rows has been processed`)
                        // $('#upload-status span').html((((i)/mainData.length) * 100).toFixed(0)+ " %")
                    }
                    f();   

                    function load(){
                        $.when.apply($, promises).then(function () {
                            console.log(mainData);
                            for (i in mainData) {
    
                                mainData[i].age = 0
                                mainData[i].income = 0
    
                                mainData[i].venue = `${mainData[i].venue}, ${mainData[i].suburb}`

                                if(geocoded[mainData[i].venue]){
                                    var coord = geocoded[mainData[i].venue]
                                    mainData[i].latitude = coord.lat
                                    mainData[i].longitude = coord.lng
                                } else {
                                    
                                    if (calledObjects.indexOf(mainData[i].venue) >= 0){
                                        var argIndex = calledObjects.indexOf(mainData[i].venue)
                                        var data = arguments[argIndex][0]   
                                        if (data.status=='OK'){
                                            var coord = data.results[0].geometry.location
    
                                            mainData[i].latitude = coord.lat
                                            mainData[i].longitude = coord.lng
            
                                            geocoded[mainData[i].venue]  = coord;
                                        }
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
            
                                        mainData[i].age = extractYoungPeoplePercentage(absData.age[lgaCode]).toFixed(2)
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
                    }

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
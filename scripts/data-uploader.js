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

    var googleMapsGeocodeURI = "https://maps.google.com/maps/api/geocode/json?key=AIzaSyA-1zmQgHV0mECAbC-Uj0JWfLKyS8ygPB4&address="

    $('#company-file-input').on('change', function () {
        upload(1, this)
    })

    $('#school-file-input').on('change', function () {
        upload(2, this)
    })

    // Upload function
    function upload(mode, context) {
        var file = $(context)

        var status = $('#upload-status-company')
        var localData = 'company-data'
        var geocodeData = 'geocode'
        var place = 'venue'

        if (mode == 2) {
            status = $('#upload-status-school')
            localData = 'school-data'
            geocodeData = 'school-geocode'
            place = 'school'
        }
        // change the status of the uploading data
        status.html("<span style='color:#2C3E50'>Loading..</span>")

        //Parse uploaded csv
        var json = Papa.parse(file[0].files[0], {
            header: true,
            complete: function (results, file) { //if parse successful
                var promises = [];
                var calledObjects = [];
                geocodedNew = {}

                if (file.type == 'text/csv' | file.type == 'application/vnd.ms-excel') {

                    //this is the parsed data
                    var mainData = results.data
                    if (localStorage.getItem(geocodeData)) {
                        geocoded = JSON.parse(localStorage.getItem(geocodeData))
                    }

                    // Get coordinate here
                    var searchCoordData = []
                    var deleteIndex = []

                    // 1. If coordinates have been collected directly to the main data 
                    for (i in mainData) {
                        coordinates = geocoded[`${mainData[i][place]}, ${mainData[i].suburb}`]
                        if (!coordinates) {
                            searchCoordData.push(mainData[i])
                            deleteIndex.push(i)
                        } else {
                            mainData[i].latitude = coordinates.lat
                            mainData[i].longitude = coordinates.lng

                            demoData = getDemoData(mainData[i].longitude, mainData[i].latitude)
                            mainData[i].age = demoData[0]
                            mainData[i].income = demoData[1]
                        }
                    }

                    for (i in deleteIndex) {
                        mainData.splice(i, 1)
                    }

                    // 2. If not exists call Google API
                    if (searchCoordData.length > 0) {
                        var i = 0
                        function f() {
                            promises.push(
                                $.getJSON(encodeURI(`${googleMapsGeocodeURI}${searchCoordData[i][place]},${searchCoordData[i].suburb},victoria,australia`))
                            )
                            calledObjects.push(`${searchCoordData[i][place]}, ${searchCoordData[i].suburb}`)
                            i++;
                            if (i < searchCoordData.length) {
                                if (i % 500 == 0) {
                                    setTimeout(f, 1001);
                                } else {
                                    f()
                                }
                            } else {
                                load()
                            }
                            status.html(`${i} of ${searchCoordData.length} rows have been processed`)
                            // $('#upload-status span').html((((i)/mainData.length) * 100).toFixed(0)+ " %")
                        }
                        f();
                        function load() {
                            $.when.apply($, promises).then(function () {
                                for (i in searchCoordData) {

                                    searchCoordData[i].age = 0
                                    searchCoordData[i].income = 0

                                    searchCoordData[i].place = `${searchCoordData[i][place]}, ${searchCoordData[i].suburb}`

                                    if (calledObjects.indexOf(searchCoordData[i].place) >= 0) {
                                        var argIndex = calledObjects.indexOf(searchCoordData[i].place)
                                        var data = arguments[argIndex][0]
                                        if (data.status == 'OK') {
                                            var coord = data.results[0].geometry.location

                                            searchCoordData[i].latitude = coord.lat
                                            searchCoordData[i].longitude = coord.lng

                                            geocodedNew[searchCoordData[i].place] = coord;
                                        }
                                    }

                                    // Get the data demography data
                                    demoData = getDemoData(searchCoordData[i].longitude, searchCoordData[i].latitude)
                                    searchCoordData[i].age = demoData[0]
                                    searchCoordData[i].income = demoData[1]

                                    localStorage.setItem(localData, JSON.stringify(mainData.concat(searchCoordData)))
                                    localStorage.setItem(geocodeData, JSON.stringify(Object.assign({}, geocoded, geocodedNew)))
                                    reinitialise(status, file, mode)
                                }

                                if (mode == 1 && localStorage.getItem('company-data')) {
                                    SOURCE = 'company-data'
                                }
                                $(".tagsinput").tagsinput("removeAll");
                                $('.bootstrap-tagsinput input').typeahead('destroy');
                                initiateTypeahead()
                                filteredData = []
                                initiateSwitch()
                                renderAll()
                                rawDataTable.destroy()
                                rawDataTable = initiateRawData()
                                schoolDataTable.destroy()
                                schoolDataTable = initiateSchoolData()
                        
                                status.html(file.name + " is uploaded and data is updated.")
                        
                                location.reload()


                            }, function () {
                                // error occurred
                            });
                        }
                    } else {
                        localStorage.setItem(localData, JSON.stringify(mainData.concat(searchCoordData)))
                        localStorage.setItem(geocodeData, JSON.stringify(Object.assign({}, geocoded, geocodedNew)))
                        reinitialise(status, file, mode)
                    }

                } else {
                    status.html("<span style='color:#c0392b'>Please upload only csv file</span>")
                }

            },
            error: function (err, file) {
                status.html(err.message)
            }
        })
    }

    function getDemoData(lon, lat) {
        var AURINlocal = JSON.parse(localStorage.getItem('aurin-data'))
        for (j in polygonFeatures) {
            //Get the lga name if we found the lga of data item
            if (inside([lon, lat], polygonFeatures[j].geometry.coordinates)) {
                let lgaCode = polygonFeatures[j].properties.feature_code
                //Match the lga name with the abs data then map the socio economic data in to the main data

                var aurinAge = extractYoungPeoplePercentage(absData.age[lgaCode]).toFixed(2)
                var aurinIncome = AURINlocal['income'][lgaCode]

                return [aurinAge, aurinIncome]
            }
        }
        return [0, 0]
    }

    function reinitialise(status, file, mode) {
        
        //Reinitialise all contents and filters
        //TODO: Put it in separate function

       
    }
})
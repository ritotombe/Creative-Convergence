var venues = {};
var types = {};
var schools = {};
var companies = {};
var place = {};
var events = [];
var mainData = []; // venues -> organisation
var completeData = []; //events -> organisation, venue
var csvDict = [];
var ABSData = [];
var adjency = {}

var SOURCE = 'data'

// $( function(){


var ABSLanguage;
var ABSAge;
var ABSIncome;

var dataJson = JSON.parse(localStorage.getItem("data"))


if (localStorage.getItem("data") == null || localStorage.getItem("data").length == 0){
  getABSData();
  
  //Initial data collection getting list of venues from given partners ids and store it at mainData
  if (mainData.length == 0){
    for (key in partnerIDs) {
      getCompaniesVenues(key);
    }
  }

    //when the requests finished
    $(document).ajaxStop(function(){
      // Populate venues - fetch all venue names from mainData and store it to venues (variable)
      for (data in mainData) {
        for (venue in mainData[data].venues){
          let lat = mainData[data].venues[venue].latitude
          let lon = mainData[data].venues[venue].longitude
          if (!inside([lon, lat], victoria_polygon)) {
            delete mainData[data].venues[venue]
          }
          else {
            if (!(mainData[data].venues[venue] in venues)){
              venues[mainData[data].venues[venue].name] = mainData[data].venues[venue]
            }
          }
        }
      }
      // venues.sort()

      // Populate companies - fetch all company names from mainData and store it to companies (variable)
      for (data in mainData) {
        companies[mainData[data].extra[0].name]= mainData[data].extra[0]
      }

      // Populate place - fetch all suburb names from mainData and store it to place (variable)
      // I will use this to connect with ABS data -?I consider to use postcode here as alternative
      for (venue in venues) {
        if (!(venues[venue].suburb in place)){
          place[venues[venue].suburb]= venues[venue].suburb
        }
      }

      // console.log(Object.keys(venues).length);

      // '''Ajax again here...'''
      // Get all event(s) of given combination of company id and venue id
      if (completeData.length == 0){
        var cnt = 0
        for (data in mainData) {
          for (venue in venues){
            let companyId = mainData[data].extra[0].id
            let venueId = venues[venue].id
            $.getJSON(ausstageEventsURI+"task=organisation&id="+companyId+"&venue="+venueId+"&callback=?",function(json){
              // console.log(cnt++, json);
              completeData.push(json);
            });
          }
        }
      }

      // '''End - Ajax again here...'''

      $(document).ajaxStop(function(){
        if (completeData.length > 0){
          for (data in completeData) {
            for (event in completeData[data].events) {
              let dict = {
                "company": completeData[data].organisation.name,
                "creative_work": completeData[data].events[event].name,
                "venue": completeData[data].name+", "+completeData[data].suburb,
                "latitude": completeData[data].latitude,
                "longitude": completeData[data].longitude,
                "date": completeData[data].events[event].firstDate
              }
              csvDict.push(dict)
            }
          }
          localStorage.setItem("data", JSON.stringify(csvDict))
          localStorage.setItem("timestamp", Math.floor(Date.now() / 1000))
        }
      });
    });
} else {
   var data = JSON.parse(localStorage.getItem("data"))
   var absData = JSON.parse(localStorage.getItem("abs-data"))
   var lgaPolygon = lgaPolygon2016 // JSON.parse(lga_polygon) for v0.1
   var polygonFeatures = lgaPolygon.features

   var medianAge = {}
   if (localStorage.getItem("median-age")){
    medianAge =  JSON.parse(localStorage.getItem("median-age"))
   }
  
   var cnt = 0;
   for (item in data){

      if (!(data[item].venue in venues)){
        venues[data[item].venue] = data[item].venue
      }

      data[item].age = 0
      data[item].income = 0
      
      var lon = data[item].longitude
      var lat = data[item].latitude

      //Combining with ABS data, this is very exhaustive, thus it will take too long time.
      //I recommend to find faster and more efficient way to do this
      // v0.1
      // for (i in polygonFeatures) {
      //   //Get the lga name if we found the lga of data item
      //   if(inside([lon, lat], polygonFeatures[i].geometry.coordinates[0][0])){

      //     let lgaName = polygonFeatures[i].properties.vic_lga__3

      //     if (medianAge[lgaName]) {
      //       data[item].age = medianAge[lgaName]
      //     } else {
      //       //Match the lga name with the abs data then map the socio economic data in to the main data
      //       var absAge = absData['age'][lgaName.toLowerCase()]
      //       data[item].age = getMedian(absAge)
      //       medianAge[lgaName] = data[item].age 

      //       //Todo income

      //       //Todo ethnicity
      //     }
      //   }
      // }

      // v0.2 Using preprocessed data from AURIN (calculated median)
      extractAURINData(AURINData)
      var AURINlocal = JSON.parse(localStorage.getItem('aurin-data'))
      for (i in polygonFeatures) {
        //Get the lga name if we found the lga of data item
        if(inside([lon, lat], polygonFeatures[i].geometry.coordinates[0][0])){
          let lgaCode = polygonFeatures[i].properties.feature_code
          //Match the lga name with the abs data then map the socio economic data in to the main data
          var aurinAge = AURINlocal['age'][lgaCode]
          var aurinIncome = AURINlocal['income'][lgaCode]
          data[item].age = aurinAge
          data[item].income = aurinIncome
        }
      }
      
   }

  //  localStorage.setItem("median-age", JSON.stringify(medianAge))
   localStorage.setItem("data", JSON.stringify(data))

}

  function getCompaniesVenues(key){
    return $.getJSON(ausstageVenuesURI+"type=organisation&id="+partnerIDs[key]+"&callback=?",function(json){
      mainData.push(json[0]);
    });
  }

  function extractAURINData(AURINData){
    var ageData = {}
    var incomeData = {}
    for (i in AURINData.features){
      var code = AURINData.features[i].properties.lga_code_2016
      var age = AURINData.features[i].properties.median_age_persons
      var income =  AURINData.features[i].properties.median_tot_hhd_inc_weekly
      ageData[code] = age
      incomeData[code] = income
    }

    localStorage.setItem('aurin-data', JSON.stringify({
      'age': ageData,
      'income': incomeData,
    }))
  }


  function getMedian(obj) {

    var range = []
    for (i in obj) {
      for (var j = 0; j < obj[i]; j++) {
        if (!isNaN(parseInt(i))){
          range.push(parseInt(i))
        }
      }
    }

    var half = Math.floor(range.length/2);

    let data = 0

    if(range.length % 2)
      data = range[half];
    else
      data = (range[half-1] + range[half]) / 2.0;

    if (isNaN(data)){
      return 0
    } 

    return data
    
  }

  function getABSData(){
    var promises = []

    promises.push($.getJSON(ABSLanguageURI))
    promises.push($.getJSON(ABSAgeURI))
    promises.push($.getJSON(ABSIncomeURI))

    $.when.apply($, promises).then(function(){
      ABSLanguage = arguments[0][0];
      ABSAge = arguments[1][0];
      ABSIncome = arguments[2][0];

      var jsonLanguageData = extractDataBasedOnAreaAndCategory(ABSLanguage)
      var jsonIncomeData = extractDataBasedOnAreaAndCategory(ABSIncome)
      var jsonAgeData =  extractDataBasedOnAreaAndCategory(ABSAge)
      
      localStorage.setItem('abs-data', JSON.stringify({
        'language': jsonLanguageData,
        'income': jsonIncomeData,
        'age': jsonAgeData,
      }))

    })
  }


  function extractDataBasedOnAreaAndCategory(source){

      var data = {}

      var observations = source.dataSets[0].observations // _:language_names:_:_:areas:_
      var areaNames = source.structure.dimensions.observation[4].values //get LGA areas
      var objectNames = source.structure.dimensions.observation[1].values // get languange names
      
      for(i in areaNames) {
        var areaName = areaNames[i].name.split(" ")[0].toLowerCase()
        data[areaName] = {}
        for (j in objectNames) {
          data[areaName][objectNames[j].name] = observations[`0:${j}:0:0:${i}:0`][0]
        }
      }

      return data
  }


  function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
  };

// });

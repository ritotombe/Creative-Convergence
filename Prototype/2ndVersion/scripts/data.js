
$( function(){

  // $.ajaxSetup({
  //    timeout: 1000
  // });

  var partnerIDs = {
    "Bell Shakespeare": 590, //Bell Shakespeare
    "Arena Theatre Company": 151, //Arena Theatre Company
    "Arthur": 36308, //Arthur
    "Creative Victoria": 37428, //Creative Victoria
    "Geelong Performing Arts Centre": 8085, //Geelong Performing Arts Centre
    "HotHouse Theatre": 798, //HotHouse Theatre
    "Melbourne Theatre Company": 2, //Melbourne Theatre Company
  };

  var venues = {};
  var companies = {};
  var place = {};
  var events = [];
  var mainData = []; // venues -> organisation
  var completeData = []; //events -> organisation, venue
  var csvDict = [];

  const ausstageEventsURI = "https://www.ausstage.edu.au/opencms/events?"; //venue id and  company id required
  const ausstageVenuesURI = "https://www.ausstage.edu.au/opencms/markers?" //company id required


if (localStorage.getItem("data") == null || localStorage.getItem("data").length == 0){

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

      console.log(Object.keys(venues).length);

      // Get all event(s) of given combination of company id and venue id
      if (completeData.length == 0){
        var cnt = 0
        for (data in mainData) {
          for (venue in venues){
            let companyId = mainData[data].extra[0].id
            let venueId = venues[venue].id
            $.getJSON(ausstageEventsURI+"task=organisation&id="+companyId+"&venue="+venueId+"&callback=?",function(json){
              console.log(cnt++, json);
              completeData.push(json);
            });
          }
        }
      }

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
        }
      });

      // console.log("-----------VENUES-------------",venues);
      // console.log("-----------COMPANY------------",companies);
      // console.log("-----------PLACE------------",place);
    });
}


  function getCompaniesVenues(key){
    return $.getJSON(ausstageVenuesURI+"type=organisation&id="+partnerIDs[key]+"&callback=?",function(json){
      // console.log(json[0]);
      mainData.push(json[0]);
    });
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

});

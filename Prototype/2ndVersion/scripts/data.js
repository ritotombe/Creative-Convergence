$( function(){

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

  const ausstageEventsURI = "https://www.ausstage.edu.au/opencms/events?"; //venue id and  company id required
  const ausstageVenuesURI = "https://www.ausstage.edu.au/opencms/markers?" //company id required

  //Initial data collection getting list of venues from given partners ids and store it at mainData
  for (key in partnerIDs) {
    getCompaniesVenues(key);
  }

  //when the requests finished
  $(document).ajaxStop(function(){
    // Populate venues - fetch all venue names from mainData and store it to venues (variable)
    for (data in mainData) {
      for (venue in mainData[data].venues){
        if (!(mainData[data].venues[venue] in venues)){
          venues[mainData[data].venues[venue].name] = mainData[data].venues[venue]
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

    // Get all event(s) of given combination of company id and venue id
      var cnt=0;
      for (data in mainData) {
        for (venue in mainData[data].venues){
          //There are too many ajax call here. Consequently, some calls were rejected by the server.
          // I try to remove some unrelevant venues (non Victoria data) before I am doing ajax call here.
          let companyId = mainData[data].extra[0].id
          let venueId = mainData[data].venues[venue].id
          $.getJSON(ausstageEventsURI+"task=organisation&id="+companyId+"&venue="+venueId+"&callback=?",function(json){
            // console.log(json);
            completeData.push(json[0]);
          });
        }
      }

      // $(document).ajaxStop(function(){
      //   console.log(completeData);
      // });

    // console.log("-----------VENUES-------------",venues);
    // console.log("-----------COMPANY------------",companies);
    // console.log("-----------PLACE------------",place);
  });

  function getCompaniesVenues(key){
    return $.getJSON(ausstageVenuesURI+"type=organisation&id="+partnerIDs[key]+"&callback=?",function(json){
      // console.log(json[0]);
      mainData.push(json[0]);
    });
  }

});

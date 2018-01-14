
$( function(){

  // $.ajaxSetup({
  //    timeout: 1000
  // });
  var dateNow = Math.floor(Date.now() / 1000);

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
  var ABSData = [];
  var adjency = {}

  const ausstageEventsURI = "https://www.ausstage.edu.au/opencms/events?" //venue id and  company id required
  const ausstageVenuesURI = "https://www.ausstage.edu.au/opencms/markers?" //company id required

  const ABSAgeURI = "http://stat.data.abs.gov.au/sdmx-json/data/ABS_C16_T01_LGA/1+3+2.TT+0+A04+1+2+3+4+5+A59+6+7+8+9+10+A10+11+12+13+14+15+A15+16+17+18+19+20+A20+21+22+23+24+25+A25+26+27+28+29+30+A30+31+32+33+34+35+A35+36+37+38+39+40+A40+41+42+43+44+45+A45+46+47+48+49+50+A50+51+52+53+54+55+A55+56+57+58+59+60+A60+61+62+63+64+65+A65+66+67+68+69+70+A70+71+72+73+74+75+A75+76+77+78+79+80+A80+81+82+83+84+85+A85+86+87+88+89+90+A90+91+92+93+94+95+A95+96+97+98+99+100+A99+101+102+103+104+105+106+107+108+109+110+111+112+113+114+115.2.LGA2016.20260+20570+20660+20740+20830+20910+21010+21110+21180+21270+21370+21450+21610+21670+21750+21830+21890+22110+22170+22250+22310+22410+22490+22620+22670+22750+22830+22910+22980+23110+23190+23270+23350+23430+23670+23810+23940+24130+24210+24250+24330+24410+24600+24650+24780+24850+24900+24970+25060+25150+25250+25340+25430+25490+25620+25710+25810+25900+25990+26080+26170+26260+26350+26430+26490+26610+26670+26700+26730+26810+26890+26980+27070+27170+27260+27350+27450+27630/all?detail=Full&dimensionAtObservation=AllDimensions&startPeriod=2016"
  const ABSIncomeURI = "http://stat.data.abs.gov.au/sdmx-json/data/ABS_C16_T21_LGA/TOT+110+11+1+120+12+211+21+2+212+221+22+222+310+31+3+320+32+410+41+4+420+42.TOT+10+11+12+13+14+15+16+17+18+19+20+21+22+23+Z+01+02+03+04+05+06+07+08+09.2.LGA2016.20260+20570+20660+20740+20830+20910+21010+21110+21180+21270+21370+21450+21610+21670+21750+21830+21890+22110+22170+22250+22310+22410+22490+22620+22670+22750+22830+22910+22980+23110+23190+23270+23350+23430+23670+23810+23940+24130+24210+24250+24330+24410+24600+24650+24780+24850+24900+24970+25060+25150+25250+25340+25430+25490+25620+25710+25810+25900+25990+26080+26170+26260+26350+26430+26490+26610+26670+26700+26730+26810+26890+26980+27070+27170+27260+27350+27450+27630/all?detail=Full&dimensionAtObservation=AllDimensions&startPeriod=2016"
  const ABSLanguageURI = "http://stat.data.abs.gov.au/sdmx-json/data/ABS_C16_T09_LGA/3.1201+1301+1401+1403+2101+2201+2401+3301+3402+3503+3504+3602+3901+4105+4107+4202+4301+5102+5203+5206+5207+5211+6103+6301+6302+6402+6511+6512+7102+7104+7201+7301+9216+9231+9701+0007.2.LGA2016+LGA.20260+20570+20660+20740+20830+20910+21010+21110+21180+21270+21370+21450+21610+21670+21750+21830+21890+22110+22170+22250+22310+22410+22490+22620+22670+22750+22830+22910+22980+23110+23190+23270+23350+23430+23670+23810+23940+24130+24210+24250+24330+24410+24600+24650+24780+24850+24900+24970+25060+25150+25250+25340+25430+25490+25620+25710+25810+25900+25990+26080+26170+26260+26350+26430+26490+26610+26670+26700+26730+26810+26890+26980+27070+27170+27260+27350+27450+27630/all?detail=Full&dimensionAtObservation=AllDimensions&startPeriod=2016"

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
}


  function getCompaniesVenues(key){
    return $.getJSON(ausstageVenuesURI+"type=organisation&id="+partnerIDs[key]+"&callback=?",function(json){
      mainData.push(json[0]);
    });
  }

  function getABSData(key){
    $.getJSON(ABSLanguageURI,function(json){
      ABSLanguage = json;
    });
    $.getJSON(ABSAgeURI,function(json){
      ABSAge = json;
    });
    $.getJSON(ABSIncomeURI,function(json){
      ABSIncome = json;
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

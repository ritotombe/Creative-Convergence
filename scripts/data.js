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
var adjacency = {}

var SOURCE = 'data'

var dateNow = Math.floor(Date.now() / 1000);

var partnerIDs = {
	"Bell Shakespeare": 590, //Bell Shakespeare
	"Arena Theatre Company": 151, //Arena Theatre Company
	"Arthur": 36308, //Arthur
	// "Creative Victoria": 37428, //Creative Victoria
	"Geelong Performing Arts Centre": 8085, //Geelong Performing Arts Centre
	"HotHouse Theatre": 798, //HotHouse Theatre
	"Melbourne Theatre Company": 2, //Melbourne Theatre Company
};

const ausstageEventsURI = "https://www.ausstage.edu.au/opencms/events?" //venue id and  company id required
const ausstageVenuesURI = "https://www.ausstage.edu.au/opencms/markers?" //company id required

const ABSAgeURI = "http://stat.data.abs.gov.au/sdmx-json/data/ABS_C16_T01_LGA/3.TT+0+A04+1+2+3+4+5+A59+6+7+8+9+10+A10+11+12+13+14+15+A15+16+17+18+19+20+A20+21+22+23+24+25+A25+26+27+28+29+30+A30+31+32+33+34+35+A35+36+37+38+39+40+A40+41+42+43+44+45+A45+46+47+48+49+50+A50+51+52+53+54+55+A55+56+57+58+59+60+A60+61+62+63+64+65+A65+66+67+68+69+70+A70+71+72+73+74+75+A75+76+77+78+79+80+A80+81+82+83+84+85+A85+86+87+88+89+90+A90+91+92+93+94+95+A95+96+97+98+99+100+A99+101+102+103+104+105+106+107+108+109+110+111+112+113+114+115.1+2+4.LGA2016+LGA.44620+10050+20110+20260+20570+20660+20740+20830+20910+21010+21110+21180+21270+21370+21450+21610+21670+21750+21830+21890+22110+22170+22250+22310+22410+22490+22620+22670+22750+22830+22910+22980+23110+23190+23270+23350+23430+23670+23810+23940+24130+24210+24250+24330+24410+24600+24650+24780+24850+24900+24970+25060+25150+25250+25340+25430+25490+25620+25710+25810+25900+25990+26080+26170+26260+26350+26430+26490+26610+26670+26700+26730+26810+26890+26980+27070+27170+27260+27350+27450+27630+29399+29499+29799/all?startPeriod=2016&dimensionAtObservation=AllDimensions&detail=Full"
const ABSIncomeURI = "http://stat.data.abs.gov.au/sdmx-json/data/ABS_C16_T21_LGA/TOT+110+11+1+120+12+211+21+2+212+221+22+222+310+31+3+320+32+410+41+4+420+42.TOT+10+11+12+13+14+15+16+17+18+19+20+21+22+23+Z+01+02+03+04+05+06+07+08+09.2.LGA2016.20260+20570+20660+20740+20830+20910+21010+21110+21180+21270+21370+21450+21610+21670+21750+21830+21890+22110+22170+22250+22310+22410+22490+22620+22670+22750+22830+22910+22980+23110+23190+23270+23350+23430+23670+23810+23940+24130+24210+24250+24330+24410+24600+24650+24780+24850+24900+24970+25060+25150+25250+25340+25430+25490+25620+25710+25810+25900+25990+26080+26170+26260+26350+26430+26490+26610+26670+26700+26730+26810+26890+26980+27070+27170+27260+27350+27450+27630/all?detail=Full&dimensionAtObservation=AllDimensions&startPeriod=2016"
const ABSLanguageURI = "http://stat.data.abs.gov.au/sdmx-json/data/ABS_C16_T09_LGA/3.1201+1301+1401+1403+2101+2201+2401+3301+3402+3503+3504+3602+3901+4105+4107+4202+4301+5102+5203+5206+5207+5211+6103+6301+6302+6402+6511+6512+7102+7104+7201+7301+9216+9231+9701+0007.2.LGA2016+LGA.20260+20570+20660+20740+20830+20910+21010+21110+21180+21270+21370+21450+21610+21670+21750+21830+21890+22110+22170+22250+22310+22410+22490+22620+22670+22750+22830+22910+22980+23110+23190+23270+23350+23430+23670+23810+23940+24130+24210+24250+24330+24410+24600+24650+24780+24850+24900+24970+25060+25150+25250+25340+25430+25490+25620+25710+25810+25900+25990+26080+26170+26260+26350+26430+26490+26610+26670+26700+26730+26810+26890+26980+27070+27170+27260+27350+27450+27630/all?detail=Full&dimensionAtObservation=AllDimensions&startPeriod=2016"

var ABSLanguage;
var ABSAge;
var ABSIncome;

var dataJson = JSON.parse(localStorage.getItem("data"))
var lgaPolygon = Object.assign({}, lgaPolygon2016) // JSON.parse(lga_polygon) for v0.1
var polygonFeatures = lgaPolygon.features

if (localStorage.getItem("data") == null || localStorage.getItem("data").length == 0) {
	getABSData();
	
	//Initial data collection getting list of venues from given partners ids and store it at mainData
	if (mainData.length == 0) {
		var promises = [];
		for (key in partnerIDs) {
			promises.push(getCompaniesVenues(key))	
		}
	}

	// when the requests finished

	$.when.apply($, promises).then(function () {
		for (i in arguments){
			mainData.push(arguments[i][0][0])
		}

		// Populate venues - fetch all venue names from mainData and store it to venues (variable)
		for (data in mainData) {
			for (venue in mainData[data].venues) {
				let lat = mainData[data].venues[venue].latitude
				let lon = mainData[data].venues[venue].longitude
				cnt = 0
				for (i in polygonFeatures) {
					//Get the lga name if we found the lga of data item
					// console.log(polygonFeatures[i].properties.feature_name);
					if (inside([lon, lat], polygonFeatures[i].geometry.coordinates)) {
						cnt++
						break
					}
				}
				if (cnt == 0) {
					delete mainData[data].venues[venue]
				} else {
					if (!(mainData[data].venues[venue] in venues)) {					
						venues[mainData[data].venues[venue].name] = mainData[data].venues[venue]
					}
				}
			}
		}
		
		// Populate companies - fetch all company names from mainData and store it to companies (variable)
		for (data in mainData) {
			companies[mainData[data].extra[0].name] = mainData[data].extra[0]
		}
		
		// Populate place - fetch all suburb names from mainData and store it to place (variable)
		// I will use this to connect with ABS data -?I consider to use postcode here as alternative
		for (venue in venues) {
			if (!(venues[venue].suburb in place)) {
				place[venues[venue].suburb] = venues[venue].suburb
			}
		}

		// '''Ajax again here...'''
		// Get all event(s) of given combination of company id and venue id
		if (completeData.length == 0) {
			for (data in mainData) {
				var locVen = mainData[data].venues
				for (venue in locVen) {
					$('#map').html("Loading initial data from AusStage..")
					let companyId = mainData[data].extra[0].id
					let venueId = locVen[venue].id
					$.getJSON(ausstageEventsURI + "task=organisation&id=" + companyId + "&venue=" + venueId + "&callback=?", function(json) {
						completeData.push(json);
					});
				}
			}
		}

		// '''End - Ajax again here...'''
		$(document).ajaxStop(function() {
			if (completeData.length > 0) {
				for (data in completeData) {
					for (event in completeData[data].events) {
						type = checkType(completeData[data].events[event].name)
						let dict = {
							"company": completeData[data].organisation.name,
							"creative_work": completeData[data].events[event].name,
							"venue": completeData[data].name,
							"suburb":  completeData[data].suburb,
							"latitude": completeData[data].latitude,
							"longitude": completeData[data].longitude,
							"date": completeData[data].events[event].firstDate,
							"type": type,
							"school": "None"
						}
						csvDict.push(dict)
					}
				}
				$('#map').html("Please refresh")
				localStorage.setItem("data", JSON.stringify(csvDict))
				localStorage.setItem("timestamp", Math.floor(Date.now() / 1000))
				location.reload();
			}
		});
		
	})
} else {
	var data = JSON.parse(localStorage.getItem("data"))
  	var absData = JSON.parse(localStorage.getItem("abs-data"))
	// var lgaPolygon = Object.assign({}, lgaPolygon2016) // JSON.parse(lga_polygon) for v0.1
	// var polygonFeatures = lgaPolygon.features
  
	var medianAge = {}
	if (localStorage.getItem("median-age")) {
		medianAge = JSON.parse(localStorage.getItem("median-age"))
	}

	var cnt = 0;
	for (item in data) {

		if (!(data[item].venue in venues)) {
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
		//   if(inside([lon, lat], polygonFeatures[i].geometry.coordinates)){

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
			// console.log(polygonFeatures[i].properties.feature_name);
			if (inside([lon, lat], polygonFeatures[i].geometry.coordinates)) {
				let lgaCode = polygonFeatures[i].properties.feature_code

				//Match the lga name with the abs data then map the socio economic data in to the main data
				var aurinAge = AURINlocal['age'][lgaCode]
        		var aurinIncome = AURINlocal['income'][lgaCode]

				data[item].age = extractYoungPeoplePercentage(absData.age[lgaCode]).toFixed(2)
				data[item].income = aurinIncome
			}
		}

	}
	localStorage.setItem("data", JSON.stringify(data))

}

function extractYoungPeoplePercentage(ageData) {

  var totalYoungPeople = 0

  for (let i in ageData){
    if (!isNaN(parseInt(i))) {
      var age = parseInt(i)
      if (age < 18){
        totalYoungPeople += ageData[i]
      }
    }
  }
  
  return (parseFloat(totalYoungPeople)/ageData['All ages'])*100
  
}

function getCompaniesVenues(key) {
	return $.getJSON(ausstageVenuesURI + "type=organisation&id=" + partnerIDs[key] + "&callback=?", function(json) {
		// mainData.push(json[0]);
	});
}

function extractAURINData(AURINData) {
	var ageData = {}
	var incomeData = {}
	var ancestryData = {}
	var populationData = {}
	var areaData = {}
	for (i in AURINData.features) {
		var code = AURINData.features[i].properties.lga_code_2016
		var age = AURINData.features[i].properties.median_age_persons
		var income = AURINData.features[i].properties.median_tot_hhd_inc_weekly
		ageData[code] = age
		incomeData[code] = income
	}
  
	for (i in AURINPopulation.features){
		var code = AURINPopulation.features[i].properties.lga_code16
		var population = AURINPopulation.features[i].properties.erp_2016pr
		var area = AURINPopulation.features[i].properties.areasqkm16
		
		populationData[code] = population
		areaData[code] = area

	}

	for (i in AURINAncestry.features){
		var code = AURINAncestry.features[i].properties.lga_code_2016
		var ethnic = AURINAncestry.features[i].properties

		ancestryData[code] = ethnic
	}



	localStorage.setItem('aurin-data', JSON.stringify({
		'age': ageData,
		'income': incomeData,
		'population': populationData,
		'area': areaData,
		'ancestry': ancestryData
	}))
}


function getMedian(obj) {

	var range = []
	for (i in obj) {
		for (var j = 0; j < obj[i]; j++) {
			if (!isNaN(parseInt(i))) {
				range.push(parseInt(i))
			}
		}
	}

	var half = Math.floor(range.length / 2);

	let data = 0

	if (range.length % 2)
		data = range[half];
	else
		data = (range[half - 1] + range[half]) / 2.0;

	if (isNaN(data)) {
		return 0
	}

	return data

}

function getABSData() {
  
	var promises = []

	promises.push($.getJSON(ABSLanguageURI))
	promises.push($.getJSON(ABSAgeURI))
	promises.push($.getJSON(ABSIncomeURI))

	$.when.apply($, promises).then(function() {
		ABSLanguage = arguments[0][0];
		ABSAge = arguments[1][0];
		ABSIncome = arguments[2][0];

		console.log(ABSAge.dataSets);
		

		var jsonLanguageData = extractDataBasedOnAreaAndCategory(ABSLanguage)
		var jsonIncomeData = extractDataBasedOnAreaAndCategory(ABSIncome)
		var jsonAgeData = extractDataBasedOnAreaAndCategory(ABSAge)

		localStorage.setItem('abs-data', JSON.stringify({
			'language': jsonLanguageData,
			'income': jsonIncomeData,
			'age': jsonAgeData,
		}))

	})
}


function extractDataBasedOnAreaAndCategory(source) {

	var data = {}

	var observations = source.dataSets[0].observations // _:language_names:_:_:areas:_
	var areaNames = source.structure.dimensions.observation[4].values //get LGA areas
	var stateNames = source.structure.dimensions.observation[2].values //get State
	var objectNames = source.structure.dimensions.observation[1].values // get languange names

	for (i in areaNames) {
	var areaName = areaNames[i].id
		data[areaName] = {}
		for (j in objectNames) {
			// a = parseInt(parseInt(areaName)/10000)-1
			for (a=0; a < 3; a++){
				if(observations[`0:${j}:${a}:0:${i}:0`]){
					data[areaName][objectNames[j].name] = observations[`0:${j}:${a}:0:${i}:0`][0]
				}
			}
		}
	}



	return data
}


function inside(point, vs) {
	// ray-casting algorithm based on
	// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

	var x = point[0],
		y = point[1];

	var inside = false;
	for (ls in vs) {
		var outerRing = vs[ls]
		for (z in outerRing) {
			var ring = outerRing[z]
			for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
				var xi = ring[i][0],
					yi = ring[i][1];
				var xj = ring[j][0],
					yj = ring[j][1];

				var intersect = ((yi > y) != (yj > y)) &&
					(x < (xj - xi) * (y - yi) / (yj - yi) + xi);
				if (intersect) inside = !inside;
			}
		}
	}

	return inside;
};

function clearData(){
	var myItem = localStorage.getItem('school-geocode');
	localStorage.clear();
	localStorage.setItem('school-geocode',myItem);
	location.reload();
}

function checkType(event){
	if (event.includes("Workshop")){
		return "Workshop"
	} else if (event.includes("Residency")){
		return "Workshop"
	} else if (event.includes("Talk")) {
		return "Talk"
	} else if (event.includes("Influencer")) {
		return "Influencer"
	} else {
		return "Performance"
	}
}
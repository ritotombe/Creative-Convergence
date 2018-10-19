/*
This file contains all the mapping logic. 
This includes the attachment of the Google Map.
Three layers on top of it consist of:
	- Population density layer
	- Arcs/lines between markers
	- The venue/company/event marker layer

Algorithm:
	1. Map is wrapped into a function with a single paramater (filteredData), which convey the data that has been filtered. 
	This to allow other functions to call it when there are changes in the map content.
		2. Initialise Google Map
		3. Initialise the three layers (Built with svg by D3) and tooltips (marker tooltip and population desity description)
		4. Initialise the content of each layer.
		5. Render map.
*/

var map

var layer
var layerArc
var layerPopulation

var populationTooltip
var populationTooltipText
var populationTooltipTextName
var populationTooltipTextDensity
var populationTooltipTextAncestry

var tooltip
var tooltipTitle
var tooltipContent

var tooltipCloseBtn = $('.close-btn')

var schoolTooltip
var schoolTooltipTitle
var schoolTooltipContent

var schoolTooltipCloseBtn = $('.close-btn')


// Initial map state, later changes programmatically
var mapState = {
	zoom: 7,
	center: [-36.8, 145.246528]
}

//Position of markers' tooltip
var activePosition = {
	value: {
		latitude: 0,
		longitude: 0
	}
}
var pos = {
	x: 0,
	y: 0
}

var schoolActivePosition = {
	value: {
		latitude: 0,
		longitude: 0
	}
}
var schoolPos = {
	x: 0,
	y: 0
}

padding = 10;
//--------------------------

// 1. Wrap the map in function
function renderMap(filteredData, schoolFilteredData) {

	// START - 2. Initialises the Google Maps and its components 

	map = new google.maps.Map(d3.select("#map").node(), {
		zoom: mapState.zoom,
		center: new google.maps.LatLng(mapState.center[0], mapState.center[1]),
		mapTypeId: google.maps.MapTypeId.TERRAIN,
		gestureHandling: 'cooperative',
		styles: mapConfig,
		scaleControl: true,
	});
	// Initialise the legend
	if (!document.getElementById('legend')) {
		$('<div id="legend"><div id="legend-content"></div></div>').insertAfter("#map");
	}

	var legend = document.getElementById('legend');
	var legendContent = document.getElementById('legend-content');

	if (!document.getElementById('legend-created')) {
		var typeHeader = document.createElement('h6');
		typeHeader.setAttribute("id", "legend-created");


		typeHeader.innerHTML = 'Companies'
		legendContent.appendChild(typeHeader);
		for (item in companyConfig) {
			var color = companyConfig[item].color;
			var label = companyConfig[item].label;
			var name = item;
			var icon = `
			<svg height="20px" width="20px">  
			<circle r="10" cx ="10" cy="10" fill="${color}"/>
			<text x="50%" y="50%" text-anchor="middle" dy=".4em" fill="white">${label}</text>
			</svg>`;
			var div = document.createElement('div');
			div.innerHTML = icon + name;
			legendContent.appendChild(div);
		}

		var typeHeader = document.createElement('h6');
		typeHeader.innerHTML = 'Types'
		legendContent.appendChild(typeHeader);

		for (item in typeConfig) {
			var icon = `<img height="20px" width="20px" src=${typeConfig[item].iconURL}>`;
			var name = item;
			var div = document.createElement('div');
			div.innerHTML = icon + name;
			legendContent.appendChild(div);
		}

		var icon = `<svg height="20" width="20">  
		<rect width="20" height="20" rx="3" ry="3" fill="#FFFE00"></rect>
		<text x="50%" y="50%" dy=".4em" fill="black" text-anchor="middle">S</text>
		</svg>`
		var name = 'School'
		var div = document.createElement('div');
		div.innerHTML = icon + name;
		legendContent.appendChild(div);
		legendContent.appendChild(document.createElement('hr'))
		legendContent.appendChild(div)
	}


	if (document.getElementById('legend')) {
		map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
	}


	//  determine which data that will be used in the map

	// whole data
	var data = JSON.parse(localStorage.getItem(SOURCE))
	var schoolData = JSON.parse(localStorage.getItem('school-data'))
	// filtered data
	if (filteredData) {
		data = filteredData
	}

	if (schoolFilteredData) {
		schoolData = schoolFilteredData
	}

	var overlay = new google.maps.OverlayView();
	// END - Initialise the Google Maps

	// START - 3. Initialise the Three Layers
	overlay.onAdd = function () {
		// Population layer
		layerPopulation = d3.select(this.getPanes().overlayMouseTarget).append("div")
			.attr("class", "population").append("svg");

		// Arcs layer
		layerArc = d3.select(this.getPanes().overlayMouseTarget).append("div")
			.attr("class", "arcs").append("svg");

		// Marker layer - Please notice that the other two layers are wrapped into one big svg tag.
		// However, the marker layer did not do the same way because each marker has to be its own svg.
		// In this way, I can put multiple svg compenent in a single marker (in this case the circle and label) 


		schoolLayer = d3.select(this.getPanes().overlayMouseTarget).append("div")
			.attr("class", "school-nodes")

		layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
			.attr("class", "nodes")


		//START - Intitialise the tooltips

		// Population tooltip
		populationTooltip = d3.select('body').append('svg')
			.attr("class", "population-tooltip")


		populationTooltip.append('rect')
			.attr('x', "-10")
			.attr('y', "-5")
			.attr('rx', "6")
			.attr('ry', "6")
			.attr('height', "176")
			.attr('width', "161")
			.style('fill', 'rgba(0,0,0,0.2)')

		populationTooltip.append('rect')
			.attr('x', "-10")
			.attr('y', "-5")
			.attr('rx', "6")
			.attr('ry', "6")
			.attr('height', "175")
			.attr('width', "160")
			.style('fill', 'white')



		populationTooltipText = populationTooltip.append('text')
			.attr('x', "50%")
			.attr('y', "50%")
			.attr('dy', ".4em")
			.style('fill', '#000')
			.style('font-size', '10pt')
			.style('font-weight', 'bold')

		populationTooltipTextName = populationTooltipText.append('tspan')
			.attr('x', 0)
			.attr('dy', "1.2em")
		populationTooltipTextDensity = populationTooltipText.append('tspan')
			.attr('x', 0)
			.attr('dy', "1.2em")

		populationTooltipTextAncestry = populationTooltip.append('text')
			.attr('x', "50%")
			.attr('y', "50%")
			.attr('dy', "4em")
			.style('fill', '#000')
			.style('font-size', '10pt')


		// Marker tooltip 
		tooltip = layer.select(".tooltip")
		tooltipTitle = tooltip.select(".tooltip-title")
		tooltipContent = tooltip.select(".tooltip-content")

		if (!tooltip._groups[0][0]) {
			tooltip = layer
				.append("div")
				.attr("class", "tooltip")
				.style("display", "none")

			tooltip.append('div')
				.attr('class', 'close-btn')
				.append('div')
				.attr('class', 'fui-cross')

			tooltipTitle = tooltip.append('small')
				.attr('class', 'tooltip-title')
				.append('b')

			tooltipContent = tooltip.append('div')
				.attr('class', 'tooltip-content')
		}

		//Handle close button tooltip
		tooltipCloseBtn = $('.close-btn')
		tooltipCloseBtn.on('click', function () {
			layer.selectAll("circle")
				.style("stroke", '#555')
				.style("stroke-width", 1)

			tooltip.transition()
				.duration(200)
				// .style("opacity", .0)
				.style("display", "none")
		})

		// School Marker tooltip 
		schoolTooltip = schoolLayer.select(".tooltip")
		schoolTooltipTitle = schoolTooltip.select(".tooltip-title")
		schoolTooltipContent = schoolTooltip.select(".tooltip-content")

		if (!schoolTooltip._groups[0][0]) {
			schoolTooltip = schoolLayer
				.append("div")
				.attr("class", "tooltip")
				.style("display", "none")

			schoolTooltip.append('div')
				.attr('class', 'school-close-btn')
				.append('div')
				.attr('class', 'fui-cross')

			schoolTooltipTitle = schoolTooltip.append('small')
				.attr('class', 'tooltip-title')
				.append('b')

			schoolTooltipContent = schoolTooltip.append('div')
				.attr('class', 'tooltip-content')
		}

		//Handle close button tooltip
		schoolTooltipCloseBtn = $('.school-close-btn')
		schoolTooltipCloseBtn.on('click', function () {
			schoolLayer.selectAll("rect")
				.style("stroke", '#555')
				.style("stroke-width", 1)

			schoolTooltip.transition()
				.duration(200)
				// .style("opacity", .0)
				.style("display", "none")
		})

		// END - Initialise the tooltips
		// END - 3. Initialise the Three Layers

		// This function will be called everytime the map is scrolled and zoomed
		overlay.draw = function () {

			var projection = this.getProjection(),

				adjacency = {}  // arcs' point to point coordinates
			var entries = d3.entries(data)

			// START - 4. Initialise the Content of Each Layer.
			//-- Population Layer --
			var populations = layerPopulation.selectAll("path")
				.data(LGAGeoPathProjection(projection))
				.each(createLGAPath)
				.enter().append("path")
				.each(createLGAPath)

			if ($('.bootstrap-switch-id-label-switch').hasClass('bootstrap-switch-on')) {
				$('.population').show()
			} else {
				$('.population').hide()
			}

			//-- Arcs Layer --
			// Add the coordinates of each companies  
			for (item in entries) {
				if (!adjacency[entries[item].value.company]) {
					adjacency[entries[item].value.company] = []
				}
				adjacency[entries[item].value.company].push(getIProjection(entries[item], projection))
			}
			// Draw it here
			var paths = layerArc.selectAll("path")
				.data(d3.entries(adjacency))
				.each(createPath)
				.enter().append("path")
				.each(createPath)

			if ($('.bootstrap-switch-id-arc-label-switch').hasClass('bootstrap-switch-on')) {
				$('.arcs').show()
			} else {
				$('.arcs').hide()
			}

			//-- Marker Layer --
			var marker = layer.selectAll("svg")
				.data(d3.entries(data))
				.each(function (d) {
					transform(d, projection, this)
				}) // update existing markers
				.enter().append("svg")
				.each(function (d) {
					transform(d, projection, this)
				})
				.attr('class', 'marker')

			// Add nodes (circles)
			marker.append("circle")
				.attr("r", 10)
				.attr("cx", padding)
				.attr("cy", padding)
				.style("fill", colorCoding)
				.style("stroke", '#555')
				.style("stroke-width", 1)
			// .style("opacity", 0.7)

			// Add labels on each nodes
			marker.append('text')
				.attr('class', 'node-label')
				.attr('x', "50%")
				.attr('y', "50%")
				.attr('dy', ".4em")
				.style('fill', 'white')
				.text(labelCoding)
			// .style("opacity", 0.7)

			//-- School Marker Layer --

			var schoolMarker = schoolLayer.selectAll("svg")
				.data(d3.entries(schoolData))
				.each(function (d) {
					transform(d, projection, this)
				}) // update existing markers
				.enter().append("svg")
				.each(function (d) {
					transform(d, projection, this)
				})
				.attr('class', 'school-marker')

			// Add nodes (circles)
			schoolMarker.append("rect")
				.attr("width", 20)
				.attr("height", 20)
				.attr("x", padding)
				.attr("y", padding)
				.attr("rx", 3)
				.attr("ry", 3)
				.style("fill", "#FFFE00")
				.style("stroke", '#555')
				.style("stroke-width", 1)
			// .style("opacity", 0.7)

			// Add labels on each nodes
			schoolMarker.append('text')
				.attr('class', 'node-label')
				.attr('x', "100%")
				.attr('y', "100%")
				.attr('dy', ".4em")
				.style('fill', 'black')
				.text("S")
			// .style("opacity", 0.7)


			// END - 4. Initialise the Content of Each Layer.

			// Save map state after scroll and zoom 
			mapState.center[0] = map.getCenter().lat()
			mapState.center[1] = map.getCenter().lng()
			mapState.zoom = map.getZoom()

			map.addListener('center_changed', function (e) {
				tooltip
					.style("left", (pos.x) + "px")
					.style("top", (pos.y) + "px")

				schoolTooltip
					.style("left", (schoolPos.x) + "px")
					.style("top", (schoolPos.y) + "px")
			})

			// Tooltip position after make a zoom action, we need new projections
			pos = getIProjection(activePosition, projection)
			schoolPos = getIProjection(schoolActivePosition, projection)
			tooltip
				.style("left", (pos.x) + "px")
				.style("top", (pos.y) + "px")

			schoolTooltip
				.style("left", (schoolPos.x) + "px")
				.style("top", (schoolPos.y) + "px")

			// Click listener of the Markers (show tooltip)
			marker.on('click', function (d, i) {
				markerClickHandler(d, i, projection, this)
			})

			schoolMarker.on('click', function (d, i) {
				schoolMarkerClickHandler(d, i, projection, this)
			})

			// START - HELPER FUNCTIONS

			// This function is to Project all the LGA boundaries coordinate in to pixel 


			// END - HELPER FUNCTIONS
		};
	};

	function LGAGeoPathProjection(projection) {
		var projectedFeatures = []
		var polygon = {}
		polygon = $.extend(true, {}, lgaPolygon2016)
		for (i in polygon.features) {
			var feature = {}
			var coords = []
			feature = $.extend(true, {}, polygon.features[i])
			coords = feature.geometry.coordinates
			for (j in coords) {
				for (k in coords[j]) {
					for (l in coords[j][k]) {
						var proj = getIProjection({
							value: {
								latitude: coords[j][k][l][1],
								longitude: coords[j][k][l][0]
							}
						}, projection)
						coords[j][k][l][0] = proj.x
						coords[j][k][l][1] = proj.y
					}
				}
			}
			projectedFeatures.push({
				"type": feature.type,
				"properties": feature.properties,
				"geometry": {
					"type": feature.geometry.type,
					"coordinates": coords,
				}
			})
		}

		return projectedFeatures
	}

	//  This function is to create Path (polygons) of each LGA and  creates its tooltip
	function createLGAPath(d) {
		let thisPath = d3.select(this)

		var aurinData = {}
		var populationData = {}
		var ancestryData = {}
		var areaData = {}
		if (localStorage.getItem('aurin-data')) {
			aurinData = localStorage.getItem('aurin-data')
			populationData = JSON.parse(aurinData).population
			areaData = JSON.parse(aurinData).area
			ancestryData = JSON.parse(aurinData).ancestry
		}


		thisPath.attr("d", d3.geoPath())
			.attr("fill", '#4ae') //#4ae
			.attr("stroke-width", '1px')
			.attr("stroke", '#555')
			// .style("stroke-opacity", "0.6")
			.style("fill-opacity", function (d) {
				var max = 0
				var min = 1

				// .range([0, 1])
				// const colorScaleLog = d3.scaleSequential(
				// 	(d) => d3.interpolateReds(logScale(d))
				// )   
				for (let i in populationData) {
					if ((populationData[i] / areaData[i]) > max) {
						max = populationData[i] / areaData[i]
					}
					if ((populationData[i] / areaData[i]) < min) {
						min = populationData[i] / areaData[i]
					}
				}

				logScale = d3.scaleLog()
					.domain([min, max])
					.range([0, 1]);

				color = (populationData[d.properties.feature_code] / (areaData[d.properties.feature_code]))

				return logScale(color)

			})
			.attr("class", function (d) {
				return d.properties.feature_name
			})
			.on("mouseover mousemove", function (d) {
				if (populationTooltip.style("display") != 'block') {
					layerPopulation.selectAll("path")
						.attr("stroke-width", '1px')
					// .style("stroke-opacity", "0.6")
					d3.select(this)
						.attr("stroke-width", '3px')
					// .style("stroke-opacity", "1")

					populationTooltip
						.style("left", d3.event.pageX)
						.style("top", d3.event.pageY)
						.style("position", "absolute")
						.style("display", "block")

					populationTooltipTextName
						.text(function () {
							return d.properties.feature_name
						})

					populationTooltipTextDensity
						.text(function () {
							return `Density: ${(populationData[d.properties.feature_code] / areaData[d.properties.feature_code]).toFixed(2)}/km2`
						})

					populationTooltipTextAncestry
						.html(function () {

							var ethnics = {
								"Croatian": ancestryData[d.properties.feature_code].croatian_tot_responses,
								"Russian": ancestryData[d.properties.feature_code].russian_tot_responses,
								"Dutch": ancestryData[d.properties.feature_code].dutch_tot_responses,
								"Korean": ancestryData[d.properties.feature_code].korean_tot_responses,
								"Chinese": ancestryData[d.properties.feature_code].chinese_tot_responses,
								"Indian": ancestryData[d.properties.feature_code].indian_tot_responses,
								"Serbian": ancestryData[d.properties.feature_code].serbian_tot_responses,
								"French": ancestryData[d.properties.feature_code].french_tot_responses,
								"Greek": ancestryData[d.properties.feature_code].greek_tot_responses,
								"Maltese": ancestryData[d.properties.feature_code].maltese_tot_responses,
								"Scottish": ancestryData[d.properties.feature_code].scottish_tot_responses,
								"English": ancestryData[d.properties.feature_code].english_tot_responses,
								"Aborigin": ancestryData[d.properties.feature_code].aust_abor_tot_responses,
								"New Zealand": ancestryData[d.properties.feature_code].nz_tot_responses,
								"Not Stated": ancestryData[d.properties.feature_code].ancestry_notstated_tot_responses,
								"Macedonian": ancestryData[d.properties.feature_code].macedonian_tot_responses,
								"Hungarian": ancestryData[d.properties.feature_code].hungarian_tot_responses,
								"Filipino": ancestryData[d.properties.feature_code].filipino_tot_responses,
								"Total": ancestryData[d.properties.feature_code].tot_p_tot_responses,
								"Polish": ancestryData[d.properties.feature_code].polish_tot_responses,
								"Welsh": ancestryData[d.properties.feature_code].welsh_tot_responses,
								"Sri Lankan": ancestryData[d.properties.feature_code].sri_lankan_tot_responses,
								"German": ancestryData[d.properties.feature_code].german_tot_responses,
								"Italian": ancestryData[d.properties.feature_code].italian_tot_responses,
								"Australia": ancestryData[d.properties.feature_code].aust_tot_responses,
								"Spanish": ancestryData[d.properties.feature_code].spanish_tot_responses,
								"Irish": ancestryData[d.properties.feature_code].irish_tot_responses,
								"Maori": ancestryData[d.properties.feature_code].maori_tot_responses,
								"Other": ancestryData[d.properties.feature_code].other_tot_responses,
								"Turkish": ancestryData[d.properties.feature_code].turkish_tot_responses,
								"South African": ancestryData[d.properties.feature_code].sth_african_tot_responses,
								"Lebanese": ancestryData[d.properties.feature_code].lebanese_tot_responses,
								"Vietnamese": ancestryData[d.properties.feature_code].vietnamese_tot_responses
							}


							var sortable = [];
							for (var ethnic in ethnics) {
								sortable.push([ethnic, ethnics[ethnic]]);
							}

							sortable.sort(function (a, b) {
								return b[1] - a[1];
							});


							return `Ethnicity: 
						<tspan x="0" dy="1.2em"> ${sortable[1][0]} : ${(sortable[1][1] / sortable[0][1] * 100).toFixed(2)} % </tspan> 
						<tspan x="0" dy="1.2em"> ${sortable[2][0]} : ${(sortable[2][1] / sortable[0][1] * 100).toFixed(2)} % </tspan>
						<tspan x="0" dy="1.2em"> ${sortable[3][0]} : ${(sortable[3][1] / sortable[0][1] * 100).toFixed(2)} % </tspan>
						<tspan x="0" dy="1.2em"> ${sortable[4][0]} : ${(sortable[4][1] / sortable[0][1] * 100).toFixed(2)} % </tspan>
						<tspan x="0" dy="1.2em"> ${sortable[5][0]} : ${(sortable[5][1] / sortable[0][1] * 100).toFixed(2)} % </tspan>
						<tspan x="0" dy="1.2em"> Indigenous : ${(ethnics.Aborigin / sortable[0][1] * 100).toFixed(2)} % </tspan>
						`
						})
				}
			})
			.on("mouseout", function (d) {
				if (populationTooltip.style("display") != 'none'){
					populationTooltip
					.style("display", "none")
				}
				
			})
	}

	// This function is to create the arcs' lines
	function createPath(d) {
		let thisPath = d3.select(this)

		//Create Paths Line
		var linePathGenerator = d3.line()
			.x(function (d) {
				return d.x;
			})
			.y(function (d) {
				return d.y;
			})
			.curve(d3.curveMonotoneX);

		// Add Path to the Line Layer
		if (!thisPath.classed('active')) {
			thisPath
				.attr("stroke", companyConfig[d.key].color)
				.attr("stroke-width", "1.5px")
				.attr("fill", "none")
				.attr("pointer-events", "visibleStroke")
			// .style("opacity", 0.6);
		}

		var lineData = linePathGenerator(d.value)
		var line = thisPath.attr("d", lineData)

		var company = d.key

		// Click Listener 
		line
			.on('click', function () {
				if (!d3.select(this).classed("active")) {
					layerArc.selectAll('path')
						.attr("stroke-width", "1.5px")
						// .style("opacity", 0.6)
						.classed("active", false)
					d3.select(this)
						// .attr("stroke-width", 3)
						// .style("opacity", 1)
						.attr("class", "active")
					d3.selectAll(".nodes svg circle")
						.style("stroke", '#555')
						.style("stroke-width", 1)
					var circles = d3.selectAll(".nodes svg")
					circles = circles.filter(function (d) {
						return d.value.company == company
					})
					circles.select('circle').style("stroke", '#000')
						.style("stroke-width", 2)
				} else {
					layerArc.selectAll('path')
						.attr("stroke-width", "1.5px")
						// .style("opacity", 0.6)
						.classed("active", false)
					d3.selectAll(".nodes svg circle")
						.style("stroke", '#555')
						.style("stroke-width", 1)
				}
			})
			.on('mouseover', function () {
				layerArc.selectAll('path')
					.attr("stroke-width", function () {
						return d3.select(this).classed("active") ? 3 : 1.5
					})
				// .style("opacity", function() {
				// 	return d3.select(this).classed("active") ? 1 : 0.6
				// });
				d3.select(this)
				// .style("opacity", 1)
			})

		var totalLength = thisPath.node().getTotalLength();

		thisPath
			.attr("stroke-dasharray", totalLength + " " + totalLength)
			.attr("stroke-dashoffset", totalLength)
			.transition()
			.duration(4000)
			.ease(d3.easeLinear)
			.attr("stroke-dashoffset", 0)
	}

	function getIProjection(d, projection) {
		var latLon = new google.maps.LatLng(d.value.latitude, d.value.longitude);
		var pixelated = projection.fromLatLngToDivPixel(latLon);

		return pixelated
	}

	function getOverlaps(longitude, latitude, data) {

		var dataPoints = []

		for (i in data) {
			if (data[i].longitude == longitude && data[i].latitude == latitude) {
				dataPoints.push(data[i])
			}
		}
		return dataPoints
	}

	function labelCoding(d) {
		var company = d.value.company;
		return companyConfig[company].label;
	}

	function colorCoding(d) {
		var company = d.value.company;
		return companyConfig[company].color;
	}

	function typeCoding(d) {
		var type = d.value.type
		return typeConfig[type].iconURL;
	}

	function transform(d, projection, context) {
		d = new google.maps.LatLng(d.value.latitude, d.value.longitude);
		d = projection.fromLatLngToDivPixel(d);

		return d3.select(context)
			.attr("transform", "translate(" + (d.x - padding) + "," + (d.y - padding) + ")")
	}

	function markerClickHandler(d, i, projection, context) {
		// Set the position of the tooltip based on the clicked marker's position

		activePosition.value = {
			latitude: d.value.latitude,
			longitude: d.value.longitude
		}

		// Get the coordinate projection in pixel
		pos = getIProjection(d, projection)
		d = d.value

		// Get all Markers that overlapped in a same point, later agregate them in the same tooltip
		var overlappedPoints = getOverlaps(d.longitude, d.latitude, data)
		var tooltipContentVal = []
		for (i in overlappedPoints) {
			var bgColour = colorCoding({
				value: {
					company: overlappedPoints[i].company
				}
			})

			var typeIcon = typeCoding({
				value: {
					type: overlappedPoints[i].type
				}
			})
			tooltipContentVal.push(
				`
				<div class='tooltip-content-item' style='background: ${bgColour}'>
					<div class='tooltip-info'>
						<div>${overlappedPoints[i].creative_work}</div>
						<div>${overlappedPoints[i].date}</div>
					</div>
					<div class='tooltip-additional-info'>
						<img src=${typeIcon} alt=${overlappedPoints[i].type}>
					</div>
				</div>
				`
			)
		}

		tooltip.transition()
			.duration(10)
			// .style("opacity", .9)
			.style("display", "block")
		tooltipTitle.html(d.venue)
		tooltipContent.html(tooltipContentVal.join(`\n`))
		tooltip
			.style("left", (pos.x) + "px")
			.style("top", (pos.y) + "px")
		layer.selectAll("circle")
			.style("stroke", '#555')
			.style("stroke-width", 1)
		d3.select(context).select("circle")
			.style("stroke", '#000')
			.style("stroke-width", 2)
	}

	function schoolMarkerClickHandler(d, i, projection, context) {
		// Set the position of the tooltip based on the clicked marker's position

		schoolActivePosition.value = {
			latitude: d.value.latitude,
			longitude: d.value.longitude
		}

		// Get the coordinate projection in pixel
		schoolPos = getIProjection(d, projection)
		d = d.value

		// Get all Markers that overlapped in a same point, later agregate them in the same tooltip
		var overlappedPoints = getOverlaps(d.longitude, d.latitude, schoolData)
		var schoolTooltipContentVal = []
		for (i in overlappedPoints) {
			var bgColour = colorCoding({
				value: {
					company: overlappedPoints[i].company
				}
			})

			var typeIcon = typeCoding({
				value: {
					type: overlappedPoints[i].type
				}
			})
			schoolTooltipContentVal.push(
				`
				<div class='tooltip-content-item' style='background: ${bgColour}'>
					<div class='tooltip-info'>
						<div>${overlappedPoints[i].creative_work}</div>
						<div>${overlappedPoints[i].venue}</div>
						<div>${overlappedPoints[i].date}</div>
					</div>
					<div class='tooltip-additional-info'>
						<img src=${typeIcon} alt=${overlappedPoints[i].type}>
					</div>
				</div>
				`
			)
		}

		schoolTooltip.transition()
			.duration(10)
			// .style("opacity", .9)
			.style("display", "block")
		schoolTooltipTitle.html(d.school)
		schoolTooltipContent.html(schoolTooltipContentVal.join(`\n`))
		schoolTooltip
			.style("left", (schoolPos.x) + "px")
			.style("top", (schoolPos.y) + "px")
		schoolLayer.selectAll("rect")
			.style("stroke", '#555')
			.style("stroke-width", 1)
		d3.select(context).select("rect")
			.style("stroke", '#000')
			.style("stroke-width", 2)
	}

	//5. Render Map
	overlay.setMap(map);
}
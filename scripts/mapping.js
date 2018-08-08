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
//--------------------------

// 1. Wrap the map in function
function renderMap(filteredData) {

	// START - 2. Initialises the Google Maps and its components 
	$('<div id="legend"><h4>Companies</h4></div>').insertAfter("#map");
	map = new google.maps.Map(d3.select("#map").node(), {
		zoom: mapState.zoom,
		center: new google.maps.LatLng(mapState.center[0], mapState.center[1]),
		mapTypeId: google.maps.MapTypeId.TERRAIN,
		gestureHandling: 'cooperative',
		styles: mapConfig
	});
	// Initialise the legend
	var legend = document.getElementById('legend');
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
		legend.appendChild(div);
	}
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

	//  determine which data that will be used in the map

	// whole data
	var data = JSON.parse(localStorage.getItem(SOURCE))
	// filtered data
	if (filteredData) {
		data = filteredData
	}
	var overlay = new google.maps.OverlayView();
	// END - Initialise the Google Maps

	// START - 3. Initialise the Three Layers
	overlay.onAdd = function() {
		// Population layer
		var layerPopulation = d3.select(this.getPanes().overlayMouseTarget).append("div")
			.attr("class", "population").append("svg");

		// Arcs layer
		var layerArc = d3.select(this.getPanes().overlayMouseTarget).append("div")
			.attr("class", "arcs").append("svg");

		// Marker layer - Please notice that the other two layers are wrapped into one big svg tag.
		// However, the marker layer did not do the same way because each marker has to be its own svg.
		// In this way, I can put multiple svg compenent in a single marker (in this case the circle and label) 
		var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
			.attr("class", "nodes")

		//START - Intitialise the tooltips
		
		// Population tooltip
		var populationTooltip = d3.select('body').append('svg')
									.attr("class", "population-tooltip")
		var populationTooltipText = populationTooltip.append('text')
										.attr('x', "50%")
										.attr('y', "50%")
										.attr('dy', ".4em")
										.style('fill', '#000')
										.style('font-size', '10pt')
					
		var populationTooltipTextName = populationTooltipText.append('tspan')
											.attr('x', 0)
											.attr('dy', "1.2em")
		var populationTooltipTextDensity= populationTooltipText.append('tspan')
											.attr('x', 0)
											.attr('dy', "1.2em")

		// Marker tooltip 
		var tooltip = layer.select(".tooltip")
		var tooltipTitle = tooltip.select(".tooltip-title")
		var tooltipContent = tooltip.select(".tooltip-content")

		if (!tooltip._groups[0][0]) {
			tooltip = layer
				.append("div")
				.attr("class", "tooltip")
				.style("opacity", 0)

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
		// END - Initialise the tooltips
		// END - 3. Initialise the Three Layers

		// This function will be called everytime the map is scrolled and zoomed
		overlay.draw = function() {

			var projection = this.getProjection(),
			padding = 10;

			adjacency = {}  // arcs' point to point coordinates
			var entries = d3.entries(data)

			// START - 4. Initialise the Content of Each Layer.
			//-- Population Layer --
			var populations = layerPopulation.selectAll("path")
				.data(LGAGeoPathProjection)
				.each(createLGAPath)
				.enter().append("path")
				.each(createLGAPath)

				if($('.bootstrap-switch-id-label-switch').hasClass('bootstrap-switch-on')){
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
				adjacency[entries[item].value.company].push(getIProjection(entries[item]))
			}
			// Draw it here
			var paths = layerArc.selectAll("path")
				.data(d3.entries(adjacency))
				.each(createPath)
				.enter().append("path")
				.each(createPath)
			
			if($('.bootstrap-switch-id-arc-label-switch').hasClass('bootstrap-switch-on')){
				$('.arcs').show()
			} else {
				$('.arcs').hide()
			}

			//-- Marker Layer --
			var marker = layer.selectAll("svg")
				.data(d3.entries(data))
				.each(transform) // update existing markers
				.enter().append("svg")
				.each(transform)
				.attr('class', 'marker')

			// Add nodes (circles)
			marker.append("circle")
				.attr("r", 10)
				.attr("cx", padding)
				.attr("cy", padding)
				.style("fill", colorCoding)
				.style("opacity", 0.7)

			// Add labels on each nodes
			marker.append('text')
				.attr('class', 'node-label')
				.attr('x', "50%")
				.attr('y', "50%")
				.attr('dy', ".4em")
				.style('fill', 'white')
				.text(labelCoding)
				.style("opacity", 0.7)
			
			// END - 4. Initialise the Content of Each Layer.

			// Save map state after scroll and zoom 
			mapState.center[0] =  map.getCenter().lat()
			mapState.center[1] = map.getCenter().lng()
			mapState.zoom = map.getZoom()
					
			map.addListener('center_changed', function(e) {
				tooltip
					.style("left", (pos.x) + "px")
					.style("top", (pos.y) + "px")
			})
			
			// Tooltip position after make a zoom action, we need new projections
			pos = getIProjection(activePosition)
			tooltip
				.style("left", (pos.x) + "px")
				.style("top", (pos.y) + "px")

			// Click listener of the Markers (show tooltip)
			marker.on('click', markerClickHandler)

			// START - HELPER FUNCTIONS

			// This function is to Project all the LGA boundaries coordinate in to pixel 
			function LGAGeoPathProjection() {
				var projectedFeatures = []
				var polygon = {}

				polygon = $.extend( true, {}, lgaPolygon2016 )
				for ( i in polygon.features) {
					var feature = {}
					var coords = []
					feature = $.extend( true, {}, polygon.features[i] )
					coords = feature.geometry.coordinates
					for (j in coords) {
						for ( k in coords[j]) {
							for (l in coords[j][k]) {
								var proj = getIProjection({
									value: {
										latitude: coords[j][k][l][1],
										longitude: coords[j][k][l][0]
									}
								})
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
				var areaData = {}
				if(localStorage.getItem('aurin-data')){
					aurinData = localStorage.getItem('aurin-data')
					populationData = JSON.parse(aurinData).population
					areaData = JSON.parse(aurinData).area
				}
				

				thisPath.attr("d", d3.geoPath())
					.attr("fill", '#4ae') //#4ae
					.attr("stroke-width", '1px')
					.attr("stroke", '#555')
					.style("stroke-opacity", "0.6")
					.style("fill-opacity", function(d) {
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
					.attr("class", function(d) {
						return d.properties.feature_name
					})
					.on("mouseover mousemove", function(d) {
						layerPopulation.selectAll("path")
							.attr("stroke-width", '1px')
							.style("stroke-opacity", "0.6")
						d3.select(this)
							.attr("stroke-width", '3px')
							.style("stroke-opacity", "1")

						populationTooltip
							.style("left", d3.event.pageX)
							.style("top", d3.event.pageY)
							.style("position", "absolute")
							.style("display", "block")
							
						populationTooltipTextName
							.text(function(){
								return d.properties.feature_name
							})

						populationTooltipTextDensity
							.text(function(){
								return `Density: ${(populationData[d.properties.feature_code] / areaData[d.properties.feature_code]).toFixed(2)}/km2`
							})
					})
					.on("mouseout", function(d) {
						populationTooltip
							.style("display", "none")
					})
			}

			// This function is to create the arcs' lines
			function createPath(d) {
				let thisPath = d3.select(this)

				//Create Paths Line
				var linePathGenerator = d3.line()
					.x(function(d) {
						return d.x;
					})
					.y(function(d) {
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
						.style("opacity", 0.6);
				}

				var lineData = linePathGenerator(d.value)
				var line = thisPath.attr("d", lineData)

				var company = d.key

				// Click Listener 
				line
					.on('click', function() {
						if (!d3.select(this).classed("active")) {
							layerArc.selectAll('path')
								.attr("stroke-width", "1.5px")
								.style("opacity", 0.6)
								.classed("active", false)
							d3.select(this)
								.attr("stroke-width", 3)
								.style("opacity", 1)
								.attr("class", "active")
							d3.selectAll(".nodes svg circle")
								.style("stroke", 'none')
							var circles = d3.selectAll(".nodes svg")
							circles = circles.filter(function(d) {
								return d.value.company == company
							})
							circles.select('circle').style("stroke", '#000')
								.style("stroke-width", 2)
						} else {
							layerArc.selectAll('path')
								.attr("stroke-width", "1.5px")
								.style("opacity", 0.6)
								.classed("active", false)
							d3.selectAll(".nodes svg circle")
								.style("stroke", 'none')
						}
					})
					.on('mouseover', function() {
						layerArc.selectAll('path')
							.attr("stroke-width", function() {
								return d3.select(this).classed("active") ? 3 : 1.5
							})
							.style("opacity", function() {
								return d3.select(this).classed("active") ? 1 : 0.6
							});
						d3.select(this)
							.style("opacity", 1)
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

			function getIProjection(d) {
				var latLon = new google.maps.LatLng(d.value.latitude, d.value.longitude);
				var pixelated = projection.fromLatLngToDivPixel(latLon);

				return pixelated
			}

			function getOverlaps(longitude, latitude) {

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

			function transform(d) {
				d = new google.maps.LatLng(d.value.latitude, d.value.longitude);
				d = projection.fromLatLngToDivPixel(d);

				return d3.select(this)
					.attr("transform", "translate(" + (d.x - padding) + "," + (d.y - padding) + ")")
			}

			function markerClickHandler(d, i) {
				// Set the position of the tooltip based on the clicked marker's position
				activePosition.value = {
					latitude: d.value.latitude,
					longitude: d.value.longitude
				}

				// Get the coordinate projection in pixel
				pos = getIProjection(d)
				d = d.value

				// Get all Markers that overlapped in a same point, later agregate them in the same tooltip
				var overlappedPoints = getOverlaps(d.longitude, d.latitude)
				var tooltipContentVal = []
				for (i in overlappedPoints) {
					var bgColour = colorCoding({
						value: {
							company: overlappedPoints[i].company
						}
					})
					tooltipContentVal.push(
						`
						<div class='tooltip-content-item' style='background: ${bgColour}'>
							<div>${overlappedPoints[i].creative_work}</div>
							<div>${overlappedPoints[i].date}</div>
						</div>
						`
					)
				}

				tooltip.transition()
					.duration(10)
					.style("opacity", .9)
					.style("display", "block")
				tooltipTitle.html(d.venue)
				tooltipContent.html(tooltipContentVal.join(`\n`))
				tooltip
					.style("left", (pos.x) + "px")
					.style("top", (pos.y) + "px")
				layer.selectAll("circle")
					.style("stroke", 'none')
				d3.select(this).select("circle")
					.style("stroke", '#000')
					.style("stroke-width", 2)
			}

			//Handle close button tooltip
			var tooltipCloseBtn = $('.close-btn')
			tooltipCloseBtn.on('click', function() {
				layer.selectAll("circle")
					.style("stroke", 'none')
				tooltip.transition()
					.duration(200)
					.style("opacity", .0)
					.style("display", "none")
			})

		// END - HELPER FUNCTIONS
		};
	};

	//5. Render Map
	overlay.setMap(map);
}
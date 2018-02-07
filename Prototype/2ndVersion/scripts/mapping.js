var map
var center = {
  x: 0,
  y: 0
}

var newPos = {
  x: 0,
  y: 0
}

var activePosition = {
  value : 
  {
    latitude: 0,
    longitude: 0
  }
}

var pos = {
  x: 0,
  y: 0
}




// Create the Google Map…

function renderMap(filteredData) {

  $( '<div id="legend"><h4>Companies</h4></div>' ).insertAfter( "#map" );

    map = new google.maps.Map(d3.select("#map").node(), {
    zoom: 7,
    center: new google.maps.LatLng(-36.8, 145.246528),
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    styles:[
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#d59563"
        },
        {
          "weight": 1.5
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#263c3f"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6b9a76"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9ca5b3"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#1f2835"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#f3d19c"
        }
      ]
    },
    {
      "featureType": "road.local",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2f3948"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#515c6d"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
  ]
  });


  // [
  //         {
  //           featureType: 'poi.business',
  //           stylers: [{visibility: 'off'}]
  //         },
  //         {
  //           featureType: 'road',
  //           elementType: 'labels',
  //           stylers: [{visibility: 'off'}]
  //         }
  //       ]


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

  var data = JSON.parse(localStorage.getItem(SOURCE))
  if (filteredData){
    data = filteredData
  }
  
  var overlay = new google.maps.OverlayView();

  overlay.onAdd = function() {

    

    var layerArc = d3.select(this.getPanes().overlayMouseTarget).append("div")
        .attr("class", "arcs").append("svg");

        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
        .attr("class", "nodes")

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    tooltip.append('div')
      .attr('class', 'close-btn')
      .append('div')
        .attr('class','fui-cross')

    var tooltipTitle = tooltip.append('small')
      .attr('class', 'tooltip-title')
      .append('b')

    var tooltipContent = tooltip.append('div')
      .attr('class', 'tooltip-content')

    

    overlay.draw = function() {

      var projection = this.getProjection(),
          padding = 10;

      adjency = {}
      var entries = d3.entries(data)
      layerArc.selectAll("path").remove()

      // layerArc.append("rect")
      // .attr("width", "100%")
      // .attr("height", "100%")
      // .on("mousemove", mousemoved);

      /////LINE
      for (item in entries){
        if (!adjency[entries[item].value.company]){
          adjency[entries[item].value.company] = []
        }
        adjency[entries[item].value.company].push(getIProjection(entries[item]))
      }
   
      // Add Line
      for (company in adjency) { 
        createPath(company)
      }

      /////MARKER
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

      // Add Labels on each nodes
      marker.append('text')
        .attr('class', 'node-label')
        .attr('x', "50%")
        .attr('y', "50%")
        .attr('dy', ".4em")
        .style('fill', 'white')
        .text(labelCoding)
        .style("opacity", 0.7)
      
      pos = getIProjection(activePosition)
      
      tooltip
         .style("left", (pos.x + newPos.x) + "px")
         .style("top", (pos.y + newPos.y) + "px")

      // console.log(1, newPos, pos, activePosition);

      marker.on('click', function(d, i){
        activePosition.value = {
          latitude: d.value.latitude,
          longitude: d.value.longitude
        }
        pos = getIProjection(d)
        // console.log(124, newPos);
        d = d.value
        var overlappedPoints = getOverlaps(d.longitude, d.latitude)
        var tooltipContentVal = []
        for (i in overlappedPoints) {
          var bgColour = colorCoding({
            value: {
              company : overlappedPoints[i].company
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
         .style("left", (pos.x + newPos.x) + "px")
         .style("top", (pos.y + newPos.y) + "px")
        layer.selectAll("circle")
          .style("stroke", 'none')
        d3.select(this).select("circle")
          .style("stroke", 'white')
          .style("stroke-width", 2)
          // .moveToFront()
      })
      //Handle close button tooltip
      var tooltipCloseBtn = $('.close-btn')
      tooltipCloseBtn.on('click', function (){
        layer.selectAll("circle")
          .style("stroke", 'none')
      tooltip.transition()
        .duration(200)
        .style("opacity", .0)
        .style("display", "none")
      })
      //handle change of center point for tooltip
      center = getIProjection({
        value: {
          latitude: map.getCenter().lat(),
          longitude: map.getCenter().lng()
        }
      })   
      map.addListener('center_changed', function(e){
        var newCenter = getIProjection({
          value: {
            latitude: map.getCenter().lat(),
            longitude: map.getCenter().lng()
          }
        })

        newPos = {
          x: center.x - newCenter.x,
          y: center.y - newCenter.y,
          latitude: map.getCenter().lat(),
          longitude: map.getCenter().lng()
        }

        // console.log(2, pos, newPos)

        tooltip
          .style("left", (pos.x + newPos.x) + "px")
          .style("top", (pos.y + newPos.y) + "px")
      })

      function getIProjection(d) {
        d = new google.maps.LatLng(d.value.latitude, d.value.longitude);
        d = projection.fromLatLngToDivPixel(d);

        return d
      }

      function getOverlaps(longitude, latitude){

        var dataPoints = []

        for (i in data){
          if (data[i].longitude == longitude && data[i].latitude == latitude){
            dataPoints.push(data[i])
          }
        }
        return dataPoints
      }

      function labelCoding(d){
        var company = d.value.company;
        return companyConfig[company].label;
      }

      function colorCoding(d){
        var company = d.value.company;
        return companyConfig[company].color;
      }

      function createPath(company){
        // console.log(company);
        var linePathGenerator = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .curve(d3.curveMonotoneX);

        var svgPath = layerArc.append("path")
          .attr("stroke", companyConfig[company].color)
          .attr("stroke-width", "1.5px")
          .attr("fill", "none")
          .style("opacity", 0.6);

        var line =  svgPath.attr("d", linePathGenerator(adjency[company]))


        line
          .on('click', function(){
            if (!d3.select(this).classed("active")){
              layerArc.selectAll('path')
                .attr("stroke-width", "1.5px")
                .style("opacity", 0.6);
              d3.select(this)
                .attr("stroke-width", 3)
                .style("opacity", 1)
                .attr("class", "active")
              d3.selectAll(".nodes svg circle")
                .style("stroke", 'none')
              var circles = d3.selectAll(".nodes svg")
              circles = circles.filter(function(d){
                return d.value.company == company
              })
              circles.select('circle').style("stroke", 'white')
              .style("stroke-width", 2)
            } else {
              layerArc.selectAll('path')
                .attr("stroke-width", "1.5px")
                .style("opacity", 0.6)
                .attr("class", "deactive")
              d3.selectAll(".nodes svg circle")
                .style("stroke", 'none')
            }
          })
      
        var totalLength = svgPath.node().getTotalLength();

        svgPath
          .attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
            .duration(4000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)

       
      }

      function transform(d) {
        d = new google.maps.LatLng(d.value.latitude, d.value.longitude);
        d = projection.fromLatLngToDivPixel(d);

        return d3.select(this)
            .attr("transform", "translate(" + (d.x - padding) + "," + (d.y - padding) + ")")
      }
    };
  };

  overlay.setMap(map);

  
  
}




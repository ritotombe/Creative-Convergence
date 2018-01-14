// Create the Google Map…
var map = new google.maps.Map(d3.select("#map").node(), {
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
for (item in styleColor) {
  var color = styleColor[item].color;
  var name = item;
  var icon = `<svg height="20px" width="20px"><circle r="10" cx ="10" cy="10" fill="${color}"/></svg>`;
  var div = document.createElement('div');
  div.innerHTML = icon + name;
  legend.appendChild(div);
}
map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

var data = JSON.parse(localStorage.getItem("data"))

var overlay = new google.maps.OverlayView();

overlay.onAdd = function() {

  var layer = d3.select(this.getPanes().overlayLayer).append("div")
      .attr("class", "stations");

  var layerArc = d3.select(this.getPanes().overlayLayer).append("div")
      .attr("class", "arcs").append("svg");

  // var mainLayer = d3.select(this.getPanes().overlayLayer)
  // .append("svg")
  // .append("g")
  // .attr("class","legend")
  // .attr("transform","translate(50,30)")
  // .style("font-size","12px")
  // .call(d3.legend)

  // Draw each marker as a separate SVG element.
  // We could use a single SVG, but what size would it have?
  overlay.draw = function() {
    var projection = this.getProjection(),
        padding = 10;

    var adjency = {}
    var entries = d3.entries(data)

    layerArc.selectAll("path").remove()

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
        .attr("class", "marker");

    // Add Marker
    marker.append("circle")
        .attr("r", 10)
        .attr("cx", padding)
        .attr("cy", padding)
        .style("fill", colorCoding)
        .style("opacity", 0.85);

    function getIProjection(d) {
      d = new google.maps.LatLng(d.value.latitude, d.value.longitude);
      d = projection.fromLatLngToDivPixel(d);

      return d
    }

    function colorCoding(d){
      var company = d.value.company;

      return styleColor[company].color;
    }

    function createPath(company){
      var linePathGenerator = d3.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })
      .curve(d3.curveMonotoneX);

      var svgPath = layerArc.append("path")
        .attr("stroke", styleColor[company].color)
        .attr("stroke-width", "1.5px")
        .attr("fill", "none")
        .style("opacity", 0.6);

      svgPath
        .attr("d", linePathGenerator(adjency[company]));

      var totalLength = svgPath.node().getTotalLength();

      svgPath
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
          .duration(4000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
    }

    function transform(d) {
      d = new google.maps.LatLng(d.value.latitude, d.value.longitude);
      d = projection.fromLatLngToDivPixel(d);

      return d3.select(this)
          .style("left", (d.x - padding) + "px")
          .style("top", (d.y - padding) + "px");
    }
  };
};

overlay.setMap(map);

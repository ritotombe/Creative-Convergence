// List of the companies and with the color coding and labels
var companyConfig = {
  "Bell Shakespeare Company": {
    "color": "#fa5959",
    "label": "B"
  }, //Bell Shakespeare
  "Arena Theatre Company": {
    "color": "#015ac7",
    "label": "A"
  }, //Arena Theatre Company
  "Arthur": {
    "color": "#c5df61",
    "label": "Ar"
  }, //Arthur
  "Creative Victoria": {
    "color": "#96148a",
    "label": "C"
  }, //Creative Victoria
  "Geelong Performing Arts Centre": {
    "color": "#9f9300",
    "label": "G"
  }, //Geelong Performing Arts Centre
  "HotHouse Theatre": {
    "color": "#e495ff",
    "label": "H"
  }, //HotHouse Theatre
  "Melbourne Theatre Company": {
    "color": "#ffac4b",
    "label": "M"
  }, //Melbourne Theatre Company
};

// Map Styling
var mapConfig = [{
  "elementType": "geometry",
  "stylers": [{
    "color": "#242f3e"
  }]
},
{
  "elementType": "labels.text.fill",
  "stylers": [{
    "color": "#746855"
  }]
},
{
  "elementType": "labels.text.stroke",
  "stylers": [{
    "color": "#242f3e"
  }]
},
{
  "featureType": "administrative",
  "elementType": "geometry.stroke",
  "stylers": [{
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
  "stylers": [{
    "visibility": "off"
  }]
},
{
  "featureType": "administrative.locality",
  "elementType": "labels.text.fill",
  "stylers": [{
    "color": "#d59563"
  }]
},
{
  "featureType": "poi",
  "elementType": "labels.text",
  "stylers": [{
    "visibility": "off"
  }]
},
{
  "featureType": "poi",
  "elementType": "labels.text.fill",
  "stylers": [{
    "color": "#d59563"
  }]
},
{
  "featureType": "poi.business",
  "stylers": [{
    "visibility": "off"
  }]
},
{
  "featureType": "poi.park",
  "elementType": "geometry",
  "stylers": [{
    "color": "#263c3f"
  }]
},
{
  "featureType": "poi.park",
  "elementType": "labels.text.fill",
  "stylers": [{
    "color": "#6b9a76"
  }]
},
{
  "featureType": "road",
  "elementType": "geometry",
  "stylers": [{
    "color": "#38414e"
  }]
},
{
  "featureType": "road",
  "elementType": "geometry.stroke",
  "stylers": [{
    "color": "#212a37"
  }]
},
{
  "featureType": "road",
  "elementType": "labels.icon",
  "stylers": [{
    "visibility": "off"
  }]
},
{
  "featureType": "road",
  "elementType": "labels.text.fill",
  "stylers": [{
    "color": "#9ca5b3"
  }]
},
{
  "featureType": "road.arterial",
  "elementType": "labels",
  "stylers": [{
    "visibility": "off"
  }]
},
{
  "featureType": "road.highway",
  "elementType": "geometry",
  "stylers": [{
    "color": "#746855"
  }]
},
{
  "featureType": "road.highway",
  "elementType": "geometry.stroke",
  "stylers": [{
    "color": "#1f2835"
  }]
},
{
  "featureType": "road.highway",
  "elementType": "labels",
  "stylers": [{
    "visibility": "off"
  }]
},
{
  "featureType": "road.highway",
  "elementType": "labels.text.fill",
  "stylers": [{
    "color": "#f3d19c"
  }]
},
{
  "featureType": "road.local",
  "stylers": [{
    "visibility": "off"
  }]
},
{
  "featureType": "road.local",
  "elementType": "labels",
  "stylers": [{
    "visibility": "off"
  }]
},
{
  "featureType": "transit",
  "stylers": [{
    "visibility": "off"
  }]
},
{
  "featureType": "transit",
  "elementType": "geometry",
  "stylers": [{
    "color": "#2f3948"
  }]
},
{
  "featureType": "transit.station",
  "elementType": "labels.text.fill",
  "stylers": [{
    "color": "#d59563"
  }]
},
{
  "featureType": "water",
  "elementType": "geometry",
  "stylers": [{
    "color": "#17263c"
  }]
},
{
  "featureType": "water",
  "elementType": "labels.text.fill",
  "stylers": [{
    "color": "#515c6d"
  }]
},
{
  "featureType": "water",
  "elementType": "labels.text.stroke",
  "stylers": [{
    "color": "#17263c"
  }]
}
]



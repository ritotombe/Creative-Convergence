

//List of performance type
var typeConfig = {
  "Performance": {
    "iconURL": "img/icons/performance.png"
  },
  "In Theatre": {
    "iconURL": "img/icons/performance.png"
  },
  "Workshop": {
    "iconURL": "img/icons/workshop.png"
  },
  "Talk": {
    "iconURL": "img/icons/talk.png"
  },
  "Influencer": {
    "iconURL": "img/icons/influencer.png"
  }
}

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
  // "Creative Victoria": {
  //   "color": "#96148a",
  //   "label": "C"
  // }, //Creative Victoria
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
var mapConfig = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#2b5c8a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "poi.school",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#00578f"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ffc510"
      },
      {
        "saturation": 100
      },
      {
        "lightness": 75
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]






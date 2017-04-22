angular.module('app').factory('AppService', function () {
      var mapIcons = {
       defaultIcon: {
        iconUrl: "assets/leaflet/images/marker-icon.png",
        shadowUrl: "assets/leaflet/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
    },
     myIcon: {
        iconUrl: "assets/leaflet/images/marker-icon.png",//"assets/leaflet/images/myIcon.png", // The only one that's required
        iconSize: [38, 95], // [X, Y], in pixels
        iconAnchor: [22, 95], // The point that will match the coordinates
        shadowUrl: "assets/leaflet/images/marker-shadow.png",//"assets/leaflet/images/myIconShadow.png", // if your icon has a shadow
        shadowSize: [50, 64], // see iconSize
        shadowAnchor: [5, 64] // see iconAnchor
    },
    greenIcon: {
        iconUrl: 'assets/leaflet/images/leaf-green.png',
        shadowUrl: 'assets/leaflet/images/leaf-shadow.png',

        iconSize:     [38, 95], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    },
    redIcon: {
        iconUrl: 'assets/leaflet/images/leaf-red.png',
        shadowUrl: 'assets/leaflet/images/leaf-shadow.png',

        iconSize:     [38, 95], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    },
    orangeIcon: {
        iconUrl: 'assets/leaflet/images/leaf-orange.png',
        shadowUrl: 'assets/leaflet/images/leaf-shadow.png',

        iconSize:     [38, 95], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    }
};
    
    var markers = [
    {
      lat: 46.781547,
      lng: 6.640351,
      icon: mapIcons.defaultIcon
    }, {
      lat: 46.781058,
      lng: 6.647179,
      icon: mapIcons.myIcon,
      draggable: true
    }, {
      lat: 46.778246,
      lng: 6.641490,
      icon: mapIcons.defaultIcon
    }
  ]

    return {
        getMarkers: function () {
            return markers;
        },
        addMaker: function(value) {
            markers.push = value;
        },
        getIcons: function () {
            console.log('getIcons : ' + mapIcons);
            return mapIcons;
        },
    };
});
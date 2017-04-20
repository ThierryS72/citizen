angular.module('app').controller('MapCtrl', function($scope,$geolocation) {
  var map = this;
  map.defaults = {
    //doubleClickZoom: false, // disable the double-click zoom
    //scrollWheelZoom: false, // disable zooming with the scroll
    //dragging: false, // disable moving the map with dragging it with the mouse
    minZoom: 10, // Limit the minimal zoom
    maxZoom: 16 // Limit the maximal zoom
  }

  map.center = {
    // These are the coordinates for the center of Yverdon-les-Bains
    lat: 46.778474,
    lng: 6.641183,
    zoom: 15 // This one is actually optional
  }

  var defaultIcon = {
    iconUrl: "assets/leaflet/images/marker-icon.png",
    shadowUrl: "assets/leaflet/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  }

  var myIcon = {
    iconUrl: "assets/leaflet/images/marker-icon.png",//"assets/leaflet/images/myIcon.png", // The only one that's required
    iconSize: [38, 95], // [X, Y], in pixels
    iconAnchor: [22, 95], // The point that will match the coordinates
    shadowUrl: "assets/leaflet/images/marker-shadow.png",//"assets/leaflet/images/myIconShadow.png", // if your icon has a shadow
    shadowSize: [50, 64], // see iconSize
    shadowAnchor: [5, 64] // see iconAnchor
  };

  map.markers = [
    {
      lat: 46.781547,
      lng: 6.640351,
      icon: defaultIcon
    }, {
      lat: 46.781058,
      lng: 6.647179,
      icon: myIcon,
      draggable: true
    }, {
      lat: 46.778246,
      lng: 6.641490,
      icon: defaultIcon
    }
  ]

  $scope.$on('leafletDirectiveMarker.dragend', function(event, args) {
    console.log(args.model); // Will give you the updated marker object
  });

  $geolocation.getCurrentPosition()
    .then(function (position) {
      // This will be executed when the location is accessed
      console.log(position)
    }, function (error) {
      // This will be executed if the user denies access
      // or the browser doesn't support the Geolocation API
      console.log(error);
    });
});
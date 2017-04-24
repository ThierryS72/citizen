angular.module('app').controller('MapCtrl', function($scope,$geolocation, AppService) {
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

  map.markers = AppService.getMarkers();

  $scope.$on('leafletDirectiveMarker.dragend', function(event, args) {
    console.log(args.model); // Will give you the updated marker object
  });

  // Try to get coordinates of visitor and center map on it
  $geolocation.getCurrentPosition()
    .then(function (position) {
      // This will be executed when the location is accessed
      console.log(position);
      console.log("Lat : "+ position.coords.latitude);
      console.log("Long : "+ position.coords.longitude);
      map.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        zoom: 15
      }
    }, function (error) {
      // This will be executed if the user denies access
      // or the browser doesn't support the Geolocation API
      map.center = {
        // These are the coordinates for the center of Yverdon-les-Bains
        lat: 46.778474,
        lng: 6.641183,
        zoom: 15 // This one is actually optional
      }
      console.log(error);
    });

  // get geoJson coordinates when click on map
  $scope.$on('leafletDirectiveMap.click', function (e, wrap) {
    console.log("Lat, Lon : " + wrap.leafletEvent.latlng.lat + ", " + wrap.leafletEvent.latlng.lng)
    map.markers.push({
      lat: wrap.leafletEvent.latlng.lat,
      lng: wrap.leafletEvent.latlng.lng,
      icon: AppService.getIcons['greenIcon'],
      message: "Ton problème"
    });
  });
});
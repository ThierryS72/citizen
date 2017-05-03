angular.module('app').controller('MapCtrl', function($scope, $geolocation, AppService) {
  var map = this;
  var newMarker = false;
  map.issueId = 0;
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
  
  mapIcons = AppService.getIcons();

  map.markers = AppService.getMarkers();
  console.log('mapCtrl markers : ');
  console.dir(map.markers);

  $scope.$on('leafletDirectiveMarker.dragend', function(event, args) {
    console.log(args.model); // Will give you the updated marker object
  });

  // event when click on a marker on map (doesn't work)
  map.clickMarker = function clickMarker(id){
    console.log('clickMarker : '+id);
  }

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

  // get geoJson coordinates when click on map and add/adjust a new marker
  $scope.$on('leafletDirectiveMap.click', function (e, wrap) {
    console.log("Lat, Lon : " + wrap.leafletEvent.latlng.lat + ", " + wrap.leafletEvent.latlng.lng);
    // if a new marker is already set update the coordinates
    // Todo : reset newMarker after finishing issue report
    if(newMarker){
      console.log('maker already exist. Adjust coords ' +map.issueId);
      AppService.ajustMarkerCoords(map.issueId, wrap.leafletEvent.latlng.lat, wrap.leafletEvent.latlng.lng);
    } else {
      map.issueId = AppService.addMarker({
        lat: wrap.leafletEvent.latlng.lat,
        lng: wrap.leafletEvent.latlng.lng,
        icon: mapIcons['defaultIcon'],
        message: "<span><a href=\"report\">Déclarer mon problème</a></span>",
        draggable: true
      });
      console.log(map.issueId);
      newMarker = true;
    }
    //Add coordinates to AppService
    AppService.newIssueCoordinates = {
      lat:wrap.leafletEvent.latlng.lat,
      lng:wrap.leafletEvent.latlng.lng
    };
  });
});
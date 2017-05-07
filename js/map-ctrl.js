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
  //console.log('mapCtrl markers : ');
  //console.dir(map.markers);

  $scope.$on('leafletDirectiveMarker.dragend', function(event, args) {
    //console.log(args.model); // Will give you the updated marker object
  });

  // event when click on a marker on map (doesn't work)
  map.clickMarker = function clickMarker(id){
    //console.log('clickMarker : '+id);
  }

  // Compare coordinates with last issue search coordinates and ask a new query if needed
  map.checkCoordsNewSearch = function checkCoordsNewSearch(coords){
    var lastCoords = AppService.getMapSearchCoordinates();
    // Check move diff
    if((Math.abs(coords.lat-lastCoords.lat) > 0.002) || (Math.abs(coords.lng-lastCoords.lng) > 0.01)){
      //console.log('checkCoordsNewSearch : should reload !');
      AppService.setMapSearchCoordinates(coords);
      AppService.setReloadIssueList(true);
    }
  }

  // Try to get coordinates of visitor and center map on it
  $geolocation.getCurrentPosition()
    .then(function (position) {
      // This will be executed when the location is accessed
      map.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        zoom: 15
      }
    }, function (error) {
      // This will be executed if the user denies access
      // or the browser doesn't support the Geolocation API
      map.center = AppService.getMapCenter();
      //console.log(error);
    });

  // get geoJson coordinates when click on map and add/adjust a new marker
  $scope.$on('leafletDirectiveMap.click', function (e, wrap) {
    //console.log("Lat, Lon : " + wrap.leafletEvent.latlng.lat + ", " + wrap.leafletEvent.latlng.lng);
    // if a new marker is already set update the coordinates
    // Todo : reset newMarker after finishing issue report
    if(AppService.newMarker){
      //console.log('marker already exist. Adjust coords ' +map.issueId);
      AppService.ajustMarkerCoords(map.issueId, wrap.leafletEvent.latlng.lat, wrap.leafletEvent.latlng.lng);
    } else {
      map.issueId = AppService.addMarker({
        lat: wrap.leafletEvent.latlng.lat,
        lng: wrap.leafletEvent.latlng.lng,
        icon: mapIcons['defaultIcon'],
        message: "<span><a href=\"report\">Déclarer mon problème</a></span>",
        draggable: true
      });
      //console.log(map.issueId);
      AppService.newMarker = true;
    }
    //Add coordinates to AppService
    AppService.newIssueCoordinates = {
      lat:wrap.leafletEvent.latlng.lat,
      lng:wrap.leafletEvent.latlng.lng
    };
    // recenter map
    map.center = AppService.setMapCenter(wrap.leafletEvent.latlng.lat,wrap.leafletEvent.latlng.lng);
  });

  // On drag get coordinates and compare to last search coordinates
   $scope.$on('leafletDirectiveMap.moveend', function(event, args){
     var coords = args.leafletEvent.target.getCenter();
     coords.zoom = args.leafletEvent.target.getZoom();
     map.checkCoordsNewSearch(coords);
      //console.log('Drag lat : ' + coords.lat + ' lng : '+ coords.lng);// + wrap.leafletEvent.latlng.lat + ", " + wrap.leafletEvent.latlng.lng);
    });

  // Watch any event
  $scope.$watch(function() {
    //console.log('watch refresh markers');
    map.center = AppService.getMapCenter();
    // reload markers
    map.markers = AppService.getMarkers();
  });
});
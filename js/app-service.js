angular.module('app').factory('AppService', function (AuthService, $http, $log, $state) {
  // icons for map's marker
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
    
  // markers is an array of markers for leaflet map
  var markers = [];

  var issue = this;

  // array for issues
  var listIssues = {};

  // for new issue form
  issue.newIssue =  {};

  var userInfo = {};
  var login = this;

  var newAccount = false;
  var logged = false;

    return {
        getMarkers: function () {
            return markers;
        },
        addMarker: function(value) {
            markers.push(value);
        },
        getIcons: function () {
            return mapIcons;
        },
        setIssues: function(issues) {
            markers = [];
            listIssues = issues;
            listIssues.forEach(function(element) {
                // mapIcon color belong to issue status
                switch(element.state) {
                    case 'new':
                        mapIcon = mapIcons['greenIcon'];
                        break;
                    case 'inProgress':
                        mapIcon = mapIcons['orangeIcon'];
                        break;
                    case 'rejected':
                        mapIcon = mapIcons['redIcon'];
                        break;
                    case 'resolved':
                        mapIcon = mapIcons['greenIcon'];
                        break;
                    default:
                      mapIcon = mapIcons['defaultIcon'];
                }
                markers.push({
                    lat: element.location.coordinates[1],
                    lng: element.location.coordinates[0],
                    icon: mapIcon,
                    message: element.description
                });
            });
        },
        getUserInfo: function(info) {
          console.log('getUserInfo service :');
          console.dir(userInfo);
          return userInfo;
        },
        setUserInfo: function(info) {
          userInfo = info;
        },
        setNewAccount: function(status) {
          newAccount = status;
        },
        isNewAccount: function() {
          return newAccount;
        },
        setIsConnected: function(status) {
          console.log('AppService setIsConnected : ' + status);
          logged = status;
        },
        isConnected: function() {
          return logged;
        }
    };
});
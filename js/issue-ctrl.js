// Controller for actions around issues (list/search/add/modify)
angular.module('app').controller('IssueCtrl', function IssueCtrl(AuthService, $http, $log, $state, AppService) {
  var issue = this;

  issue.listIssues = {};
  issue.newIssue =  {};

  // Get issues (default paging is 20) - result in issue.listIssues
  issue.list = function connect() {
    delete issue.error;
    $http({
      method: 'GET',
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/issues'
    }).then(function(res) {
      issue.listIssues = res.data;
      // add markers on map
      issue.listIssues.forEach(function(element) {
        console.log('Add marker on map');
        AppService.addMaker({
          lat: element.location.coordinates[0],
          lng: element.location.coordinates[1],
          icon: AppService.getIcons['orangeIcon'],
          message: element.description
        });
      });
    }).catch(function(error) {
      issue.error = "Error while trying to get issues";
      $log.error(error);
    })
  }

  /* Get all issues Types - result in issue.type
  {
    "href": "/api/issueTypes/54d8ae183fd30364605c81b1",
    "id": "54d8ae183fd30364605c81b1",
    "name": "broken-streetlight",
    "description": "Area is poorly lit",
  }
  */
  issue.type = function type() {
    delete issue.error;
    $http({
      method: 'GET',
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/issueTypes'
    }).then(function(res) {
      issue.types = res.data;
    }).catch(function(error) {
      issue.error = "Error while trying to get issues";
      $log.error(error);
    })
  }

  issue.type();

  // add an issue - todo : get coordinates
  issue.addIssue = function addIssue() {
    delete issue.error;
    issue.newIssue.location = {
      "coordinates": [
        6.6398,
        46.7678
      ],
      "type": "Point"
    };
    console.log('Add an issue');
    $http({
      method: 'POST',
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/issues',
      data: issue.newIssue
    }).then(function(res) {
    }).catch(function(error) {
      issue.error = "Impossible d'ajouter une issue";
      $log.error(error);
    })
  }
});

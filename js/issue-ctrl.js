// Controller for actions around issues (list/search/add/modify)
angular.module('app').controller('IssueCtrl', function IssueCtrl(AuthService, $http, $log, $state, AppService, $stateParams) {
  var issue = this;

  issue.listIssues = {};
  issue.newIssue =  {};

  // Get issues (default paging is 20) - result in issue.listIssues
  issue.getListIssues = function list() {
    console.log('issueCtrl get list issue');
    delete issue.error;
    $http({
      method: 'GET',
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/issues'
    }).then(function(res) {
      issue.listIssues = res.data;
      console.dir(res.data);
      // add markers on map
     issue. listIssues.forEach(function(element) {
        AppService.addMarker({
          lat: element.location.coordinates[0],
          lng: element.location.coordinates[1],
          icon: AppService.getIcons('orangeIcon'),
          message: element.description,
          draggable: true
        });
        // Push issues in AppService
        AppService.setIssues(issue.listIssues);
      });
    }).catch(function(error) {
      issue.error = "Error while trying to get issues";
      $log.error(error);
    })
  }

  // get info about me
  var login = {};
  login.infoMe = AppService.getUserInfo();
  console.dir(login.infoMe);
  
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

  // Id for issue detail view
  var id = $stateParams.id;

  issue.details = function details(id) {
    console.log('issue detail '+id);
    delete issue.error;
    $http({
      method: 'GET',
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/issues/58fdc70c25c1380011b04885'
    }).then(function(res) {
      issue.detail = res.data;
    }).catch(function(error) {
      issue.error = "Error while trying to get issue detail";
      $log.error(error);
    })
  }

  issue.details(id);

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

  issue.getListIssues();
});

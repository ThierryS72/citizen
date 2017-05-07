angular.module('app').controller('AdminCtrl', function LoginCtrl(AppService, AuthService, $http, $log, $state) {
    admin = this;
    var apiUrl = AppService.getCitizenApiUrl();
    admin.limit = 10;
    admin.users = {};

  admin.displayMore = function displayMore() {
    admin.limit += 10;
  }

  // Get users list
  admin.listUsers = function listUsers(id) {
    delete admin.error;
    $http({
      method: 'GET',
      url: apiUrl+'/api/users'
    }).then(function(res) {
      admin.users = res.data;
    }).catch(function(error) {
      admin.error = "Error while trying to get users";
      $log.error(error);
    })
  }

  admin.putInStaff = function(user) {
    $http({
      method: 'PATCH',
      url: apiUrl+user,
      data: {
          roles: ["citizen","staff"]
        }
    }).then(function(res) {
      console.log('User is staff : '+user);
    }).catch(function(error) {
      login.error = "Impossible d'ajouter le role staff pour "+user;
      $log.error(error);
    })
  }

  // Get all actions on all issues
  admin.listAllActions = function listAllActions() {
    delete admin.error;
    var qParams = {};
    // include all issue and user details
    qParams.include = ['issue', 'user'];
    $http({
      method: 'GET',
      url: apiUrl+'/api/actions',
      params: qParams
    }).then(function(res) {
      admin.listActions = res.data;
    }).catch(function(error) {
      admin.error = "Error while trying to get actions staff";
      $log.error(error);
    })
  }
  admin.listAllActions();

  // Get IssueTypes
  admin.getIssuesTypes = function issuesTypes() {
    delete admin.error;
    $http({
      method: 'GET',
      url: apiUrl+'/api/issueTypes'
    }).then(function(res) {
      admin.issuesTypes = res.data;
    }).catch(function(error) {
      admin.error = "Error while trying to get issues types";
      $log.error(error);
    })
  }
  admin.getIssuesTypes();
  admin.addIssueForm = false;

  admin.displayIssueTypeForm = function displayIssueTypeForm(id) {
    delete admin.error;
    // Display form
    admin.addIssueForm = true;
    // If it's an update, load data for this issueType
    if(id != undefined){
      $http({
        method: 'GET',
        url: apiUrl+'/api/issueTypes/'+id
      }).then(function(res) {
        admin.newIssueType = res.data;
      }).catch(function(error) {
        admin.error = "Error while trying to get issues types";
        $log.error(error);
      })
    }
  }

  // Update for Issue Types
  admin.updateNewIssueType = function updateNewIssueType() {
    delete admin.error;
    admin.newIssueTypeParams = {};
    admin.newIssueTypeParams.name = admin.newIssueType.name;
    admin.newIssueTypeParams.description = admin.newIssueType.description;
    $http({
      method: 'PATCH',
      url: apiUrl+'/api/issueTypes/'+admin.newIssueType.id,
      data: admin.newIssueTypeParams
    }).then(function(res) {
      admin.addIssueForm = false;
      admin.getIssuesTypes();
    }).catch(function(error) {
      admin.error = "Error while trying to update issues types";
      $log.error(error);
    })
  }

  // add new IssueTypes
  admin.addNewIssueType = function addNewIssueType() {
    delete admin.error;
    $http({
      method: 'POST',
      url: apiUrl+'/api/issueTypes',
      data: admin.newIssueType
    }).then(function(res) {
      admin.addIssueForm = false;
      admin.getIssuesTypes();
    }).catch(function(error) {
      admin.error = "Error while trying to add issues types";
      $log.error(error);
    })
  }

  admin.listUsers();
});
angular.module('app').controller('AdminCtrl', function LoginCtrl(AppService, AuthService, $http, $log, $state) {
    admin = this;
    var apiUrl = 'https://masrad-dfa-2017-a.herokuapp.com';
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
      console.dir(admin.users);
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
      console.dir(admin.users);
    }).catch(function(error) {
      admin.error = "Error while trying to get actions staff";
      $log.error(error);
    })
  }
  admin.listAllActions();

  admin.listUsers();
});
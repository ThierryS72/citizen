angular.module('app').controller('AdminCtrl', function LoginCtrl(AppService, AuthService, $http, $log, $state) {
    admin = this;
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
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/users'
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
      url: 'https://masrad-dfa-2017-a.herokuapp.com'+user,
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

  admin.listUsers();
});
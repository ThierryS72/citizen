angular.module('app').controller('RegisterCtrl', function RegisterCtrl(AuthService, AppService, $http, $log, $state, $scope) {
  var register = this;
  var apiUrl = AppService.getCitizenApiUrl();

  register.user = {};
  register.user.roles = ["citizen"];

  register.newAccount = AppService.isNewAccount();
  console.log('register.newAccount : '+register.newAccount);

  register.rec = function connect() {
    delete register.error;

    $http({
      method: 'POST',
      url: apiUrl+'/api/users',
      data: register.user
    }).then(function(res) {
      AuthService.setToken(res.data.token);
      AppService.setNewAccount(true);
      $state.go('home');
    }).catch(function(error) {
      register.error = "Une erreur s'est passée. Essayez avec un autre nom d'utilisateur";
      $log.error(error);
    })
  }

  // Watch any event
  $scope.$watch(function() {
    register.newAccount = AppService.isNewAccount();
  });
});

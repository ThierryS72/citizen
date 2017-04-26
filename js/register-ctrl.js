angular.module('app').controller('RegisterCtrl', function RegisterCtrl(AuthService, $http, $log, $state) {
  var register = this;

  register.user = {};
  register.user.roles = ["citizen"];

  register.rec = function connect() {
    delete register.error;

    $http({
      method: 'POST',
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/users',
      data: register.user
    }).then(function(res) {
      AuthService.setToken(res.data.token);
      register.newAccount = true;
      $state.go('home');
    }).catch(function(error) {
      register.error = "Une erreur s'est passée. Essayez avec un autre nom d'utilisateur";
      $log.error(error);
    })
  }
});

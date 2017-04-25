angular.module('app').controller('LoginCtrl', function LoginCtrl(AppService, AuthService, $http, $log, $state) {
  var login = this;

  login.user = {};

  login.connect = function connect() {
    delete login.error;

    $http({
      method: 'POST',
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/auth',
      data: login.user
    }).then(function(res) {
      AuthService.setToken(res.data.token);
      login.info = AppService.getUserInfo();
      console.dir(login.infoMe)
      $state.go('home');
    }).catch(function(error) {
      login.error = "Error while trying to log you in";
      $log.error(error);
    })
  }  
});

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
      login.setInfoMe();
      $state.go('home');
    }).catch(function(error) {
      login.error = "Error while trying to log you in";
      $log.error(error);
    })
  } 

  login.setInfoMe = function info() {
    delete login.error;
    console.log('login info');
    $http({
      method: 'GET',
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/me'
    }).then(function(res) {
      login.infoMe = res.data;
      console.dir(login.infoMe);
      AppService.setUserInfo(login.infoMe);
    }).catch(function(error) {
      login.error = "Error";
      $log.error(error);
    })
  } 
});

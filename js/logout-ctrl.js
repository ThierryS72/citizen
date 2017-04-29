angular.module('app').controller('LogoutCtrl', function LogoutCtrl(AuthService, $state) {
  var logout = this;

  logout.disconnect = function() {
    AuthService.unsetToken();
    AuthService.setLogged(false);
    $state.go('login');
  }
});

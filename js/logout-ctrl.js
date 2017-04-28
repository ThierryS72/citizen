angular.module('app').controller('LogoutCtrl', function LogoutCtrl(AuthService, $state) {
  var logout = this;

  logout.disconnect = function() {
    AuthService.unsetToken();
    AppService.setIsConnected(false);
    $state.go('login');
  }
});

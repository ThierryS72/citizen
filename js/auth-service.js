// inject token auth (Bearer) on all http request
angular.module('app').factory('AuthService', function AuthService(store) {
  var service = {
    token: store.get('auth-token'),
    unsetToken: function() {
      service.token = null;
      store.remove('auth-token');
    },
    setToken: function(token) {
      service.token = token;
      store.set('auth-token', token);
    },
    logged: store.get('auth-logged'),
    setLogged: function(status) {
      service.logged = status,
      store.set('auth-logged', status)
    },
    getLogged: function() {
      return service.logged;
    }
  };

  return service;
});

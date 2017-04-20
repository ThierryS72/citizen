// App modules
angular.module('app', [
  'ui.router',
  'angular-storage',
  'leaflet-directive',
  'ngGeolocation'
]);

angular.module('app').config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: './templates/login.html',
    controller: 'LoginCtrl as login'
  });

  $stateProvider.state('home', {
    url: '',
    templateUrl: './templates/main.html'
  });

  $stateProvider.state('register', {
    url: '/register',
    templateUrl: './templates/register.html',
    controller: 'RegisterCtrl as register'
  });

  $stateProvider.state('admin', {
    url: '/admin',
    templateUrl: './templates/admin.html'
  });

  $stateProvider.state('map', {
    url: '/map',
    templateUrl: './templates/map.html',
    controller: 'MapCtrl as map'
  });
  $urlRouterProvider.otherwise(function ($injector) {
    $injector.get('$state').go('home');
  });

  $httpProvider.interceptors.push('AuthInterceptor');
})

angular.module('app').run(function (AuthService, $rootScope, $state) {
  $rootScope.$on('$stateChangeStart', function (event, toState) {
    if (!AuthService.token && toState.name !== 'login') {
      event.preventDefault();
      $state.go('login');
    }
  });
});
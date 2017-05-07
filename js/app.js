// App modules
angular.module('app', [
  'ui.router',
  'angular-storage',
  'leaflet-directive',
  'ngGeolocation',
  'angularjs-dropdown-multiselect',
  'ngTagsInput'
]);

angular.module('app').config(function ($stateProvider, $urlRouterProvider, $httpProvider, $logProvider, $locationProvider) {
  
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: './templates/login.html',
    controller: 'LoginCtrl as login'
  });
  
  $stateProvider.state('home', {
    url: '/',
    templateUrl: './templates/main.html',
   controller: 'IssueCtrl as issue'
  });
  /*
  $stateProvider.state('home.map', {
    views: {
      map: {
       templateUrl: 'main.map.html',
       controller: 'MapCtrl as map'
      }
    }
  });
  */
  $stateProvider.state('register', {
    url: '/register',
    templateUrl: './templates/register.html',
    controller: 'RegisterCtrl as register'
  });

  $stateProvider.state('admin', {
    url: '/admin',
    templateUrl: './templates/admin.html',
    controller: 'AdminCtrl as admin'
  });

  $stateProvider.state('citizen', {
    url: '/citizen',
    templateUrl: './templates/citizen.html',
    controller: 'LoginCtrl as login'
  });

  $stateProvider.state('how-to-use', {
    url: '/how-to-use',
    templateUrl: './templates/how-to-use.html',
    controller: 'HowToUsePageController',
    controllerAs: 'howToUsePageCtrl'
  });

  $stateProvider.state('about', {
    url: '/about',
    templateUrl: './templates/about.html',
    controller: 'AboutPageController',
    controllerAs: 'aboutPageCtrl'
  });

  $stateProvider.state('privacy', {
    url: '/privacy',
    templateUrl: './templates/privacy.html',
    controller: 'PrivacyPageController',
    controllerAs: 'privacyPageCtrl'
  });

  $stateProvider.state('details', {
    url: '/details/:id',
    templateUrl: './templates/issue-details.html',
    controller: 'IssueCtrl',
    controllerAs: 'issue'
  });
  /*
  $stateProvider.state('map', {
    url: '/map',
    templateUrl: './templates/map.html',
    controller: 'MapCtrl as map'
  });
  */ 
  $stateProvider.state('report-issue', {
    url: '/report',
    templateUrl: './templates/report-issue.html',
    controller: 'IssueCtrl as issue'
  });
  
  
  $urlRouterProvider.otherwise(function ($injector) {
    $injector.get('$state').go('home');
  });

  $httpProvider.interceptors.push('AuthInterceptor');

  // Disable logging (noise from leaflet)
  $logProvider.debugEnabled(false);

  $locationProvider.html5Mode(true);
});

angular.module('app').run(function (AuthService, $rootScope, $state) {
  $rootScope.$on('$stateChangeStart', function (event, toState) {
    if (!AuthService.token && toState.name !== 'login') {
      event.preventDefault();
      $state.go('login');
    }
  });
});
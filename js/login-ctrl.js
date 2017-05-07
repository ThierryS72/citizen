angular.module('app').controller('LoginCtrl', function LoginCtrl(AppService, AuthService, $http, $log, $state, $scope) {
  var login = this;
  var apiUrl = AppService.getCitizenApiUrl();
  var oldConnected = false;

  login.user = {};

  // AppService for sharing data between controllers
  login.AppService = AppService;

  login.connect = function connect() {
    delete login.error;

    $http({
      method: 'POST',
      url: apiUrl+'/api/auth',
      data: login.user
    }).then(function(res) {
      AuthService.setToken(res.data.token);
      AuthService.setLogged(true);
      login.setInfoMe();
      $state.go('home');
    }).catch(function(error) {
      login.error = "Error while trying to log you in";
      AuthService.setLogged(false);
      $log.error(error);
    })
  } 

  // logout = disconnect and reset all users var through service
  login.disconnect = function() {
    AuthService.unsetToken();
    AuthService.setLogged(false);
    AuthService.setStaff(false);
    AppService.setNewAccount(false);
    login.infoMe = {};
    $state.go('login');
  }

  login.setInfoMe = function info() {
    delete login.error;
    //console.log('login info');
    $http({
      method: 'GET',
      url: apiUrl+'/api/me'
    }).then(function(res) {
      login.infoMe = res.data;      
      login.isStaffCheck();
      AppService.setUserInfo(login.infoMe);
    }).catch(function(error) {
      login.error = "Erreur lors du chargement du profil";
      //$log.error(error);
    })
  } 

  // Check if it's a staff member
  login.isStaffCheck = function isStaffCheck() {
    AuthService.setStaff(false);
    login.infoMe.roles.forEach(function(role)
    {
      if(role == "staff")
        AuthService.setStaff(true);
    });
  }

  // Update profile
  login.update = function() {
    //console.log('update profile');
    login.updateData = {
      firstname: login.infoMe.firstname,
      lastname: login.infoMe.lastname,
      phone: login.infoMe.phone
    }
    $http({
      method: 'PATCH',
      url: apiUrl+login.infoMe.href,
      data: login.updateData
    }).then(function(res) {
      AppService.setUserInfo(login.infoMe);
    }).catch(function(error) {
      login.error = "Erreur durant la mise à jour du profil";
      $log.error(error);
    })
  }

  // Get my issues
  login.myIssues = function info() {
    delete login.error;
    //console.log('login info');
    $http({
      method: 'GET',
      url: apiUrl+'/api/me/issues'
    }).then(function(res) {
      login.myIssuesList = res.data;
    }).catch(function(error) {
      login.error = "Error";
      $log.error(error);
    })
  }

   // Watch any event (there is two controllers involved in navbar : LoginCtrl and RegisterCtrl so exchange data with services)
    $scope.$watch(function() {
      oldConnected = login.isConnected;
      login.isConnected = AuthService.getLogged();
      login.newAccount = AppService.isNewAccount();
      login.isStaff = AuthService.getStaff();
      if((oldConnected != login.isConnected) && login.isConnected){
        login.setInfoMe();
        login.myIssues();
      }
    });
});

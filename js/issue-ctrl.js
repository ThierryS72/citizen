// Controller for actions around issues (list/search/add/modify)
angular.module('app').controller('IssueCtrl', function IssueCtrl(AuthService, $http, $log, $state) {
  var issue = this;

  issue.listIssues = {};

  issue.list = function connect() {
    delete issue.error;
    console.log(AuthService.token);
    $http({
      method: 'GET',
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/issues'
    }).then(function(res) {
      issue.listIssues = res.data;
      $state.go('home');
    }).catch(function(error) {
      issue.error = "Error while trying to get issues";
      $log.error(error);
    })
  }
});

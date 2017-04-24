angular.module('Details').controller('IssueDetailsController', function(IssueService, $stateParams )
{
  var issueDetailsCtrl = this;
  var id = $stateParams.id ;
  IssueService.getIssue(id).then(function(issue)
  {
    issueDetailsCtrl.issue = issue;
  });
});
// Controller for actions around issues (list/search/add/modify)
angular.module('app').controller('IssueCtrl', function IssueCtrl(AuthService, $http, $log, $state, AppService, $stateParams) {
  var issue = this;

  issue.listIssues = {};
  issue.newIssue =  {};
  issue.newComment = {};
  issue.limit = 5; // Nb of issues displayed

  mapIcons = AppService.getIcons();

  // Get issues (default paging is 20) - result in issue.listIssues
  issue.getListIssues = function list() {
    console.log('issueCtrl get list issue');
    delete issue.error;
    $http({
      method: 'GET',
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/issues'
    }).then(function(res) {
      issue.listIssues = res.data;
      console.dir(res.data);
      // add markers on map
     issue.listIssues.forEach(function(element) {
        // Push issues in AppService
        AppService.setIssues(issue.listIssues);
      });
    }).catch(function(error) {
      issue.error = "Error while trying to get issues";
      $log.error(error);
    })
  }

  // get info about me
  var login = {};
  login.infoMe = AppService.getUserInfo();
  console.log('infoMe : ');
  console.dir(login.infoMe);
  
  issue.type = function type() {
    delete issue.error;
    $http({
      method: 'GET',
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/issueTypes'
    }).then(function(res) {
      issue.types = res.data;
    }).catch(function(error) {
      issue.error = "Error while trying to get issues";
      $log.error(error);
    })
  }

  issue.type();

  // Id for issue detail view
  var id = $stateParams.id;

  issue.details = function details(id) {
    delete issue.error;
    $http({
      method: 'GET',
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/issues/'+id
    }).then(function(res) {
      issue.detail = res.data;
      // center map todo
      /*
      map.center = {
        // These are the coordinates for the center of Yverdon-les-Bains
        lat: issue.detail.location.coordinates[1],
        lng: issue.detail.location.coordinates[0],
        zoom: 20 // This one is actually optional
      }
      */
    }).catch(function(error) {
      issue.error = "Error while trying to get issue detail";
      $log.error(error);
    })
  }

  // Get issue comments
  issue.listComments = {};
  issue.comments = function comments(id) {
    delete issue.error;
    $http({
      method: 'GET',
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/issues/'+id+'/comments'
    }).then(function(res) {
      issue.listComments = res.data;
      console.log('issue comments '+id+' nb : '+issue.listComments.length);
    }).catch(function(error) {
      issue.error = "Error while trying to get issue comments";
      $log.error(error);
    })
  }

  // Get Issue actions
  issue.listActions = function listActions(id) {
    delete issue.error;
    $http({
      method: 'GET',
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/issues/'+id+'/actions'
    }).then(function(res) {
      issue.Actions = res.data;
      console.log('issue actions '+id+' nb : '+issue.Actions.length);
    }).catch(function(error) {
      issue.error = "Error while trying to get issue actions";
      $log.error(error);
    })
  }

  // Post issue comments
  issue.addComment = function addComment(id) {
    if(issue.newComment.text != '')
    {
      delete issue.error;
      issue.newComment.id = id;
      console.log('add comment');
      $http({
        method: 'POST',
        url: 'https://masrad-dfa-2017-a.herokuapp.com/api/issues/'+id+'/comments',
        data: issue.newComment
      }).then(function(res) {
        issue.comments(id);
        issue.newComment.text = '';
      }).catch(function(error) {
        issue.error = "Error while trying to add issue comment";
        $log.error(error);
      })
    }
  }

  // add an issue - todo : get coordinates
  issue.addIssue = function addIssue() {
    delete issue.error;
    issue.newIssue.location = {
      "coordinates": [
        6.6398,
        46.7678
      ],
      "type": "Point"
    };
    console.log('Add an issue');
    $http({
      method: 'POST',
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/issues',
      data: issue.newIssue
    }).then(function(res) {
    }).catch(function(error) {
      issue.error = "Impossible d'ajouter une issue";
      $log.error(error);
    })
  }

  // Admin functionnalities ! (role staff) **********************
  issue.setStatus = function setStatus(IssueId,status,comment) {
    delete issue.error;
    issue.setAction = {
      "reason": comment,
      "type": status
    };
    $http({
      method: 'POST',
      url: 'https://masrad-dfa-2017-a.herokuapp.com/api/issues/'+IssueId+'/actions',
      data: issue.setAction
    }).then(function(res) {
      console.log('Statut de la tâche '+id+' : '+status+' raison : '+reason);
    }).catch(function(error) {
      issue.error = "Impossible de modifier le status d'une issue";
      $log.error(error);
    })
  }

  // END Admin functionnalities ! (role staff) **********************

  // for issue details
  if(id != undefined)
  {
    issue.comments(id);
    issue.details(id);
    issue.listActions(id);
  } else {
    issue.getListIssues();
  }

  issue.displayMore = function displayMore() {
    issue.limit += 5;
    console.log('display more : ' + issue.limit);
  }
});

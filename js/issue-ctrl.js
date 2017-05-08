// Controller for actions around issues (list/search/add/modify)
angular.module('app').controller('IssueCtrl', function IssueCtrl(AuthService, $http, $log, $state, AppService, $stateParams, $scope) {
  var issue = this;
  var apiUrl = AppService.getCitizenApiUrl();
  issue.listIssues = {};
  issue.newIssue =  {};
  issue.newComment = {};
  issue.limit = 5; // Nb of issues displayed

  mapIcons = AppService.getIcons();

  // AppService for sharing data between controllers
  var service = AppService;

  issue.filtersType = AppService.getFiltersType();

  // Get issues (default paging is 20) - result in issue.listIssues
  issue.getListIssues = function list() {
    issue.filtersType = AppService.getFiltersType();
    var qBody = {};
    issue.filterStatus = [];
    issue.filterTag = [];
    if(issue.filtersType.length>0){
      issue.filtersType.forEach(function(e)
      {
        switch(e.option)
        {
          case 'S':
            issue.filterStatus.push(e.value);
            break;
          case 'T':
            issue.filterTag.push(e.value);
            break;
          default:
        }
      });
      if(issue.filterStatus.length > 0){
        qBody.state =  {
          "$in": issue.filterStatus
        }
      }
      if(issue.filterTag.length > 0){
        qBody.tags =  {
          "$in": issue.filterTag
      }
    }
  }
  // Search around our location - TODO : should we disable geo when filters set ?
  var searchCoords = AppService.getMapSearchCoordinates();
  // take zoom in consideration
  var area = 0.002 / (searchCoords.zoom/150);
  //console.log('area : '+area);
  qBody.location =  {
    "$geoWithin": {
      "$centerSphere" : [
        [ searchCoords.lng , searchCoords.lat ],
        area
      ]
    }
  }

    var qData = {};
    qData.pageSize = 25;
    qData.include = ['creator','assignee','actions','assignee'];
    delete issue.error;
    $http({
      method: 'POST',
      url: apiUrl+'/api/issues/searches',
      params: qData,
      data: qBody
    }).then(function(res) {
      issue.listIssues = res.data;
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

  // Get IssueTypes
  issue.type = function type() {
    delete issue.error;
    $http({
      method: 'GET',
      url: apiUrl+'/api/issueTypes'
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
    var qData = {};
    qData.include = ['creator','assignee','actions','issueType'];
    $http({
      method: 'GET',
      url: apiUrl+'/api/issues/'+id,
      params: qData
    }).then(function(res) {
      issue.detail = res.data;
      // recenter map on issue
      AppService.setMapCenter(issue.detail.location.coordinates[1],issue.detail.location.coordinates[0]);
    }).catch(function(error) {
      issue.error = "Error while trying to get issue detail";
      $log.error(error);
    })
  }

  // Get issue comments
  issue.listComments = {};
  issue.comments = function comments(id) {
    delete issue.error;
    var qData = {};
    qData.include = ['author'];
    $http({
      method: 'GET',
      url: apiUrl+'/api/issues/'+id+'/comments',
      params: qData
    }).then(function(res) {
      issue.listComments = res.data;
      //console.log('issue comments '+id+' nb : '+issue.listComments.length);
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
      url: apiUrl+'/api/issues/'+id+'/actions'
    }).then(function(res) {
      issue.Actions = res.data;
      //console.log('issue actions '+id+' nb : '+issue.Actions.length);
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
      $http({
        method: 'POST',
        url: apiUrl+'/api/issues/'+id+'/comments',
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

  // Add an issue with data from form and coordinates from service (through service)
  issue.addIssue = function addIssue() {
    delete issue.error;
    // get coordinates from service
    issue.coordinates = AppService.newIssueCoordinates;
    //console.dir(issue.coordinates);
    issue.newIssue.location = {
      "coordinates": [
        issue.coordinates.lng,
        issue.coordinates.lat
      ],
      "type": "Point"
    };
    // Reformat tags [ { text: 'glace' }, { text: 'lac' }, { text: 'joux' } ] to [ 'glace','lac' ,'joux']
    var tmpTags = issue.newIssue.tags;
    issue.newIssue.tags = [];
    tmpTags.forEach(function(t){
      issue.newIssue.tags.push(t.text);
    });

    $http({
      method: 'POST',
      url: apiUrl+'/api/issues',
      data: issue.newIssue
    }).then(function(res) {
      AppService.newMarker = false;
      $state.go('home');
    }).catch(function(error) {
      issue.error = "Impossible d'ajouter un problème ! Avez-vous sélectionné un emplacement sur la carte ?";
      $log.error(error);
    })
  }
  issue.setActionComment = "";
  // Admin functionnalities ! (role staff) **********************
  // Delete an issue
  issue.deleteIssue = function deleteIssue(id) {
    delete issue.error;
    //console.log('Delete an issue '+id);
    $http({
      method: 'DELETE',
      url: apiUrl+'/api/issues/'+id
    }).then(function(res) {
      // refresh list
      issue.getListIssues();
    }).catch(function(error) {
      issue.error = "Impossible de supprimer une issue";
      $log.error(error);
    })
  }

  // Change issue status
  issue.setStatus = function setStatus(IssueId,status) {
    //console.log('Issue setStatus '+IssueId+' status : '+status+' comment : '+issue.setActionComment);
    delete issue.error;
    issue.setAction = {
      "reason": issue.setActionComment,
      "type": status
    };
    $http({
      method: 'POST',
      url: apiUrl+'/api/issues/'+IssueId+'/actions',
      data: issue.setAction
    }).then(function(res) {
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
    //console.log('display more : ' + issue.limit);
  }

  var oldFilter = 0;

  // watch any event in the scope
  $scope.$watch(function() {
    //console.log('watch refresh issue');
    issue.filtersType = AppService.getFiltersType();
    if(oldFilter != issue.filtersType.length){
      oldFilter = issue.filtersType.length;
      issue.getListIssues();
    }
    // If a new issue list is asked (when map move)
    if(AppService.getReloadIssueList()){
      // Reload issue list 
      issue.getListIssues();
      // Reset the flag
      AppService.setReloadIssueList(false);
      //console.log('reload Issue list');
    }
  });

  issue.isStaff = AuthService.getStaff();
});

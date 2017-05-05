angular.module('app').controller('ListCtrl', 
function(AuthService, $http, $scope, $log, $state, AppService, $stateParams) {

    var item = this;

    item.issuesFiltered = [];
    $scope.issuesFiltered = item.issuesFiltered; // point to issuesFiltered, required for $watch
    
    /*$scope.$watch('issuesFiltered',
    function() {
        // callback function
        //console.log( item.issuesFiltered );
    }, 
    true);*/
    
    item.issuesFilterTexts = {
        buttonDefaultText: 'Filtre', 
        checkAll: 'Tout sélectionner', 
        uncheckAll: 'Ne rien sélectionner', 
        dynamicButtonTextSuffix: 'sélectionné(s)',
        searchPlaceholder: 'Rechercher...'};

    item.issuesFilter = [ 
        {id: 1, label: "Nouveau", value: "new", option: ""}, 
        {id: 2, label: "En cours", value: "inProgress", option: "S"}, 
        {id: 3, label: "Résolu", value: "resolved", option: "S"}, 
        {id: 4, label: "Rejeté", value: "rejected", option: "S"} ];

    item.issuesFilterSelectAllSettings = {
        enableSearch: true, 
        showSelectAll: 
        true, 
        keyboardControls: 
        true,
        groupByTextProvider: 
        function(groupValue) { 
            if (groupValue === 'S') { 
                return 'Etat'; } 
            else { 
                return 'Type'; } 
            }, groupBy: 'option' 
    };

    // Result of filter
    $scope.$watch('issuesFiltered',
    function() {
        // callback function
        var filtersType = [];
        item.issuesFiltered.forEach(function (element){
            console.log(element.value);
            filtersType.push(element.value);
            AppService.setFiltersType(filtersType);
        });
    }, 
    true);
});
angular.module('app').controller('ListCtrl', 
function(AuthService, $http, $scope, $log, $state, AppService, $stateParams) {

    var item = this;

    item.issuesFiltered = [];
    $scope.issuesFiltered = item.issuesFiltered; // point to issuesFiltered, required for $watch

    item.issuesFilterTexts = {
        buttonDefaultText: 'Filtre', 
        checkAll: 'Tout sélectionner', 
        uncheckAll: 'Ne rien sélectionner', 
        dynamicButtonTextSuffix: 'sélectionné(s)',
        searchPlaceholder: 'Rechercher...'};
   
    item.issuesFilter = [
        {id: 1, label: "Nouveau", value: "new", option: "T"}, 
        {id: 2, label: "En cours", value: "inProgress", option: "S"}, 
        {id: 3, label: "Résolu", value: "resolved", option: "S"}, 
        {id: 4, label: "Rejeté", value: "rejected", option: "S"} ];

    /*listTags = AppService.getListTags(); 
    id = 5; //Due to the fixed id in filter (new, inProgress, resolved and rejected)
    listTags.forEach(function(element) {
        if (element) //if tag has a value 
        {
            console.log('Filtres tag en place: '+ element);
            item.issuesFilter.push('id:' id', label:' element', option: "Tag"');
            id +=1;
        }
    };*/

    
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
                if (groupValue === 'T') {   
                return 'Type'; }
                else {
                return 'Tag';  }
                }
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
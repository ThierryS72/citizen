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
        searchPlaceholder: 'Rechercher...'
    };
   
    item.issuesFilter = [
        {id: 1, label: "Nouveau", value: "new", option: "S"}, 
        {id: 2, label: "En cours", value: "inProgress", option: "S"}, 
        {id: 3, label: "Résolu", value: "resolved", option: "S"}, 
        {id: 4, label: "Rejeté", value: "rejected", option: "S"} 
    ];

    listTags = AppService.getListTags(); 
    id = 5; //Due to the fixed id in filter (new, inProgress, resolved and rejected)
    listTags.forEach(function(element) {
        if (element) //if tag has a value 
        {
            item.issuesFilter.push({'id': id++, label: element, value:element, option: "T"});
            id +=1;
        }
    });

    
    item.issuesFilterSelectAllSettings = {
        enableSearch: true,
        showSelectAll: true, 
        keyboardControls: true,
        scrollableHeight: '500px',
        scrollable: true,
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
            filtersType.push({option: element.option, value:element.value});
            AppService.setFiltersType(filtersType);
        });
        if(item.issuesFiltered.length == 0){
          //console.log('Filtres reset');
          AppService.setFiltersType({});
        }
    }, 
    true);
});
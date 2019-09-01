function frameFilter(mapping, frameName) {
    return frameName ; 
}

angular.module('d2RollsApp')
    .filter('weaponListSection', function ($stateParams, entityMapping) {
        var sortBy = $stateParams.sortBy;
        var filters = $stateParams.filters;
        console.log(filters);
        switch (sortBy) {
            case 'frame': 
                console.log('object');
                return frameFilter.bind(this, entityMapping.frameStringCorrection());
        }       
    });
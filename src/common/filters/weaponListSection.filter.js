function frameFilter(mapping, frameName) {
    return frameName; 
}

angular.module('d2RollsApp')
    .filter('weaponListSection', function ($stateParams, entityMapping) {
        var sortBy = $stateParams.sortBy;
        switch (sortBy) {
            case 'frame': return frameFilter.bind(this, entityMapping.frameStringCorrection());
        }       
    });
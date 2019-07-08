angular.module('d2RollsApp').factory('styleHandler', [function() {
    var contentHeight;
    function setContentHeight(stateName) {
        var statesHeights = {
            category: 74,
            home: 74
        }
        if (contentHeight) {
            return contentHeight;
        }
      
        var footer = document.getElementsByClassName('footer-button-container')[0];
        var bodyHeight = footer.getBoundingClientRect().bottom;
        var differentHeight = statesHeights[stateName] || 0;
        var menuHeight = bodyHeight - differentHeight;
        var view = document.getElementsByClassName('view')[0];
        view.style.height = menuHeight + 'px';
    };
    
    return {
        setContentHeight: setContentHeight
    }
}]);
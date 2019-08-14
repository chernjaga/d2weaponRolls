angular.module('d2RollsApp').factory('styleHandler', [function() {
    var contentHeight;
    function setContentHeight(stateName) {
        var statesHeights = {
            category: 74,
            home: 74,
            filter: 100
        }
        if (contentHeight) {
            return contentHeight;
        }
        var footer = document.getElementsByClassName('footer-panel')[0];
        var bodyHeight = footer.getBoundingClientRect().top;
        var differentHeight = statesHeights[stateName] || 0;
        var menuHeight = bodyHeight - differentHeight;
        var view = document.getElementsByClassName('view')[0];
        view.style.height = menuHeight + 'px';
    };
    
    return {
        setContentHeight: setContentHeight
    }
}]);
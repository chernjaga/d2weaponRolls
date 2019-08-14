angular.module('d2RollsApp').factory('styleHandler', [function() {
    var contentHeight;
    function setContentHeight(stateName) {
        var view = document.getElementsByClassName('view')[0];
        var statesHeights = {
            category: 62,
            home: 62,
            filter: 100
        }
        if (contentHeight) {
            view.style.height = contentHeight;
            return;
        }
        var footer = document.getElementsByClassName('footer-panel')[0];
        var bodyHeight = footer.getBoundingClientRect().top;
        var differentHeight = statesHeights[stateName] || 0;
        var menuHeight = bodyHeight - differentHeight;
        view.style.height = menuHeight + 'px';
        contentHeight = menuHeight + 'px';
    };
    
    return {
        setContentHeight: setContentHeight
    }
}]);
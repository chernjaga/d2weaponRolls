angular.module('d2RollsApp').factory('styleHandler', [function() {
    var contentHeight;
    function setContentHeight() {
        if (contentHeight) {
            return contentHeight;
        }
      
        var footer = document.getElementsByClassName('footer-button-container')[0];
        var bodyHeight = footer.getBoundingClientRect().bottom;
        var footerHeight = getComputedStyle(footer).height.replace('px', '');
        var menuHeight = bodyHeight - 104;
        var view = document.getElementsByClassName('view')[0];
        view.style.height = menuHeight + 'px';
    };
    
    return {
        setContentHeight: setContentHeight
    }
}]);
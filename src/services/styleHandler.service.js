angular.module('d2RollsApp').factory('styleHandler', [function() {
    var contentHeight;
    function setContentHeight() {
        if (contentHeight) {
            return contentHeight;
        }
      
        var footer = document.getElementsByClassName('footer-menu')[0];
        var bodyHeight = footer.getBoundingClientRect().bottom;
        var footerHeight = getComputedStyle(footer).height.replace('px', '');
        var menuHeight = bodyHeight - footerHeight
        var view = document.getElementsByClassName('view')[0];
        view.style.height = menuHeight - 32 + 'px';
    };
    
    return {
        setContentHeight: setContentHeight
    }
}]);
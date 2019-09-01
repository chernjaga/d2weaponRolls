angular.module('d2RollsApp').factory('styleHandler', [function() {
    var contentHeight;
    function setContentHeight(stateCorrectionValue) {
        var view = document.getElementsByClassName('view')[0];

        stateCorrectionValue = stateCorrectionValue || 0
        if (contentHeight) {
            view.style.height = contentHeight;
            return;
        }
        var footer = document.getElementsByClassName('footer-panel')[0];
        var bodyHeight = footer.getBoundingClientRect().top;

        view.style.height = bodyHeight - 16 - stateCorrectionValue + 'px';
        contentHeight = view.clientHeight + 'px';
        console.log(contentHeight);
    };
    
    return {
        setContentHeight: setContentHeight
    }
}]);
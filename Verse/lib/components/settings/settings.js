define(['knockout'], function (ko) {
    return function quizViewModel(params) {
        var self = this;

        self.init = function () {
            self.fullscreenIcon(self.isInFullscreen() ? 'fullscreen_exit' : 'fullscreen');
        }

        self.operators = params.settings.operators;

        self.quizMode = params.settings.quizMode;

        self.fullscreenIcon = ko.observable('fullscreen');

        self.toggleActive = function (item) {
            item.active(!item.active());
        }


        self.toggleQuizModeActive = function () {
            self.quizMode.active(!self.quizMode.active());
        }

        self.toggleTimeLimitActive = function () {
            //console.log('hello');
            self.quizMode.timerActive(!self.quizMode.timerActive());
        }

        self.onBackClicked = function () {
            if (params.onBackClick)
                params.onBackClick();
        }

        self.isInFullscreen = function () {
            return (document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard method  
                (document.mozFullScreen || document.webkitIsFullScreen);
        }

        self.onFullscreenClicked = function () {
            var docElm = document.documentElement;



            if (!self.isInFullscreen()) {
                self.enterFullscreen();

                self.fullscreenIcon('fullscreen_exit');
            } else {
                self.exitFullscreen();


                self.fullscreenIcon('fullscreen');
            }

        }


        self.exitFullscreen = function () {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }

        self.enterFullscreen = function () {
            var element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }

        self.init();
    }

});
define(['knockout'], function (ko) {
    return function quizViewModel(params) {
        var self = this;

        self.init = function () {
            self.fullscreenIcon(self.isInFullscreen() ? 'fullscreen_exit' : 'fullscreen');
        }

        self.operators = params.settings.operators;

        self.quizMode = params.settings.quizMode;


        self.questionCountText = ko.computed(function () {
            var count = self.quizMode.questionCount();
            if (count === 0)
                return 'Infinite questions'
            else
                return count + ' questions';
        })

        self.timeLimitText = ko.computed(function () {
            var timeLimit = self.quizMode.timeLimit();
            if (timeLimit === 0)
                return 'No time limit'
            else if (timeLimit === 1)
                return '1 minute'
            else
                return timeLimit + ' minutes';
        })

        self.fullscreenIcon = ko.observable('fullscreen');
        self.fullscreenText = ko.observable('Fullscreen')

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
                self.fullscreenText('Exit Fullscreen');
            } else {
                self.exitFullscreen();


                self.fullscreenIcon('fullscreen');
                self.fullscreenText('Fullscreen');
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
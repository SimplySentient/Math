define(['knockout'], function (ko) {
    return function quizViewModel(params) {
        var self = this;

        self.operators = params.settings.operators;

        self.quizMode = params.settings.quizMode;


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




    }

});
﻿define(['knockout', 'questionManager'], function(ko, questionManager) {
    return function quizViewModel(params) {
		var self = this;
		
		self.questionText = ko.observable('');
		self.questionTextColor = ko.observable('black');
		self.showingAnswer = false;
		self.config = params.settings.quizMode;

		self.showQuizStartScreen = ko.observable(self.config.questionCount() > 0 || self.config.timeLimit() > 0);
		self.showQuiz = ko.observable(!self.showQuizStartScreen());

        // quiz variables
		//self.showQuizFooter = ko.observable(false); 
		//self.quizQuestionNumber = ko.observable(0);
		
		self.showQuizResults = ko.observable(false);
		self.quizQuestions = ko.observableArray([]); // only used to keep track to show in results at end
		self.quizResultsDescription = ko.observable('');
		self.timeRanOut = false;
		self.timeRemaining = ko.observable(0);

		self.showConfirmExit = ko.observable(false);

		self.showRepeatIncorrect = ko.observable(false);

        // timer
		self.timer = null; 
		self.elapsedTime = 0;

		self.answerOptionRows = ko.observableArray([]);

		self.init = function () {
		    questionManager.operators = self.getActiveOperators();
		    questionManager.quizQuestionCount = self.config.questionCount();

		    if (self.config.questionCount() === 0) { // start quiz immediately
		        questionManager.init();
		        self.newQuestion();
		    }
		    //console.log('here!');
		}

		self.answerClick = function (val, event) {
		    //console.log(val);
		    if (self.showingAnswer) return;

		    var correctAnswer = questionManager.checkAnswer(val);

		    self.questionTextColor(correctAnswer ? '#32d25b' : 'red');

		    var str = self.questionText();
		    self.questionText(str.substr(0, str.length - 1) + val);



		    self.showingAnswer = true;
		    setTimeout(function () {
		        self.questionTextColor('black');
		        self.newQuestion();
		        self.showingAnswer = false;
		    }, 1000);
		   
		}

		self.mouseDown = function (val, event) {
		    event.target.className += ' clickAnimation';

		    setTimeout(function () {
		        event.target.className = event.target.className.replace(/(?:^|\s)clickAnimation(?!\S)/g, '')
		    }, 500)
		}

		self.newQuestion = function () {
		    if (questionManager.questionNumber() === questionManager.questionCount && questionManager.questionCount > 0) {
		        self.quizEnd();
		        return;
		    }

		    questionManager.nextQuestion();

		    self.questionText(questionManager.questionText);

		    var temp = [];
		    temp.push(new ko.observableArray(questionManager.answerOptions.slice(0, 4)));
		    temp.push(new   ko.observableArray(questionManager.answerOptions.slice(4, 8)));
		    self.answerOptionRows(temp);

		    //if (self.quizQuestionNumber() === self.config.questionCount()) {
		    //    self.quizEnd();
		    //} else
		    //    self.quizQuestionNumber(self.quizQuestionNumber() + 1);

		}



		self.getTimeLongDisplay = function (totalSeconds) { // e.g. 2 minutes and 4 seconds (if m or s is 0 term is not included)
		    var seconds = totalSeconds % 60;
		    
		    var secondsStr = ''; //seconds + ' second';
		    if (seconds > 0) {
		        if (seconds === 1)
		            secondsStr = seconds + ' second'
		        else
		            secondsStr = seconds + ' seconds';
		    }

		    var minutes = Math.floor(totalSeconds / 60);
		    var minutesStr = '';
		    if (minutes > 0) {
		        if (minutes === 1)
		            minutesStr = minutes + ' minute'
		        else
		            minutesStr = minutes + ' minutes'

		    }
		    var timeStr = minutesStr;
		    if (secondsStr.length > 0) {
                if (minutesStr.length > 0)
                    timeStr = timeStr + ' and '
                timeStr = timeStr + secondsStr;
		    }
		    return timeStr;
		}

		self.quizEnd = function () {
		    self.showQuizResults(true);
		    self.showQuiz(false);
		    //self.showQuizFooter(false);
		    clearTimeout(self.timer);
		    self.timeRemaining(0);
        
		    questionManager.repeatIncorrect = false;

		    var timeStr = 'Completed in ' + self.getTimeLongDisplay(self.elapsedTime);

		    var answeredCount = questionManager.pastQuestions.length;

		    var questionCount = questionManager.questionCount;
		    if (questionCount === 0)
		        questionCount = answeredCount;
		    var correctCount = 0;


		    //var tempQuestions = questionManager.pastQuestions; //.slice(0); // create copy
		    for (var i = 0; i < answeredCount; i++) {
		        var question = questionManager.pastQuestions[i];
		        var str = question.text;
		        question.completeText = str.substr(0, str.length - 1) + question.submittedAnswer;
		        question.color = question.correct ? 'black' : 'red';
		        if (question.correct)
		            correctCount++;
		    }

		    self.quizQuestions.removeAll();
		    self.quizQuestions(questionManager.pastQuestions);

		    var percentStr = Math.round(correctCount / questionCount * 100) + '%';

		    var displayStr = correctCount + ' out of ' + questionCount + '</br>' + percentStr;
		    if (self.timeRanOut)
		        displayStr = 'Time Up!</br>' + displayStr
		    else
		        displayStr = displayStr + '</br>' + timeStr;

		    self.quizResultsDescription(displayStr);
		    self.showRepeatIncorrect(correctCount < questionCount);
		}

		self.getActiveOperators = function () {
		    var ops = params.settings.operators();
		    var activeOps = [];
		    for (var i = 0; i < ops.length; i++) {
		        if (ops[i].active())
		            activeOps.push(ops[i]);
		    }
		    return activeOps;
		}


		self.repeatIncorrect = function () {
		    questionManager.repeatIncorrect = true;
		    self.startQuiz();
		}

		self.startQuiz = function () {
		    self.showQuizStartScreen(false);
		    self.showQuiz(true);

		    questionManager.init();

		    self.showQuizResults(false);
		    self.elapsedTime = 0;
		    self.timeRanOut = false;

		    self.newQuestion();

		    if (self.config.timeLimit() > 0) 
		        self.timeRemaining(self.config.timeLimit() * 60);

		    self.timer = setInterval(function () {
		        self.elapsedTime += 1;

		        

		        if (self.config.timeLimit() > 0) {
		            var limit = self.config.timeLimit() * 60;

		            self.timeRemaining(limit - self.elapsedTime)

		            if (self.elapsedTime >= limit) {
		                self.timeRanOut = true;
		                self.quizEnd();
		            }
		        }
		    }, 1000);
		    
		}

		self.timeRemainingDescrip = ko.computed(function () {
		    var time = self.timeRemaining();
		    if (time === 0) return '';

		    var min = Math.floor(time / 60);
		    var sec = time % 60;
		    var ret = '';

		    if (min > 0) {
		        ret = min + ':';

		        if (sec < 10)
		            sec = '0' + sec;
		    }

		    return ret + sec;

		});

		self.quizDescription = ko.computed(function () {
		    var str = '';
		    var operators = self.getActiveOperators();
		    var opsStr = '';
		    for (var i = 0; i < operators.length; i++) {
		        opsStr = opsStr + operators[i].name.toLowerCase();
		        if (i < operators.length - 2 && operators.length - 2 > 0) {
		            opsStr = opsStr + ', ';
		        } else if (i < operators.length - 1) {
		            opsStr = opsStr + ' and ';
		        }
		    }

		    // if there is no time limit or question count the description isn't shown
		    var mins = self.config.timeLimit();
		    if (mins > 0 && self.config.questionCount() === 0) {
		        if (mins === 1)
		            str = mins + ' minute of '
		        else
		            str = str = mins + ' minutes of ';
		    } else
		        str = self.config.questionCount() + ' ';

		    return str + opsStr + ' questions';
		});


		self.quizProgressDescrip = ko.computed(function () {
		    //return self.quizQuestionNumber() + ' of ' + self.config.questionCount();
		    //console.log(questionManager.questionNumber());
		    var num = questionManager.questionNumber();

		    if (questionManager.questionCount === 0)
		        return '';

		    return num + ' of ' + questionManager.questionCount;
		});

		self.confirmExitYes = function () {
		    self.showConfirmExit(false);
		    self.exit();
		}

		self.confirmExitNo = function () {
		    self.showConfirmExit(false);
		}

		self.onSettingsClicked = function () {
		    if (self.showQuiz() && self.config.questionCount() > 0)
		        self.showConfirmExit(true);
		    else
		        self.exit();
		}

		self.exit = function () {
		    if (params.onSettingsClick)
		        params.onSettingsClick();
		}
				
		self.init();
    }
	
});
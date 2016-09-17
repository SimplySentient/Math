define(['knockout', 'questionManager'], function(ko, questionManager) {
    return function quizViewModel(params) {
		var self = this;
		
		//console.log('item-view', params);
		
		//self.questionAnswer = 0;
		self.questionText = ko.observable();
		self.questionTextColor = ko.observable('black');
		self.showingAnswer = false;
		self.showQuiz = ko.observable(!params.settings.quizMode.active());

        // quiz variables
		self.showQuizFooter = ko.observable(false); 
		self.quizQuestionNumber = ko.observable(0);
		self.showQuizStartScreen = ko.observable(params.settings.quizMode.active());
		self.showQuizResults = ko.observable(false);
		self.quizQuestions = ko.observableArray([]); // only used to keep track to show in results at end
		self.quizResultsDescription = ko.observable('');
		self.timeRanOut = false;
		self.timeRemaining = ko.observable('');

        // timer
		self.timer = null; 
		self.elapsedTime = 0;

		self.firstRowOptions = ko.observableArray([{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }]);
		self.secondRowOptions = ko.observableArray([{ value: 5 }, { value: 6 }, { value: 7 }, { value: 8 }]);


		self.init = function () {
		    questionManager.operators = self.getActiveOperators();

		    self.newQuestion();

		}

		self.answerClick = function (val) {
		    if (self.showingAnswer) return;
		    //console.log("answer clicked", val);

		    var correctAnswer = val.value === questionManager.answer;

		    self.questionTextColor(correctAnswer ? '#32d25b' : 'red');

		    var str = self.questionText();
		    str = str.substr(0, str.length - 1) + val.value;
		    self.questionText(str);

		    self.quizQuestions.push({ text: str, correct: correctAnswer, color: correctAnswer ? 'black' : 'red' });

		    self.showingAnswer = true;
		    setTimeout(function () {
		        self.questionTextColor('black');
		        self.newQuestion();
		        self.showingAnswer = false;
		    }, 1000);
		   
		}


		self.newQuestion = function () {
		    //var operator = self.getRandomOperator();
		    //var term1, term2;
		    //var maxTerm = operator.maxTerm();
		    //term1 = Math.floor((Math.random() * maxTerm) + 1);
		    //term2 = Math.floor((Math.random() * maxTerm) + 1);

		    //if (operator.sign === '+') {
		    //    self.questionAnswer = term1 + term2;
		    //} else if (operator.sign === '-') {
		    //    self.questionAnswer = term1;
		    //    term1 = self.questionAnswer + term2;
		    //} if (operator.sign === 'x') {
		    //    self.questionAnswer = term1 * term2;
		    //} else if (operator.sign === '&divide;') {
		    //    self.questionAnswer = term1;
		    //    term1 = self.questionAnswer * term2;
		    //}

		    //self.questionText(term1 + " " + operator.sign + " " + term2 + " = ?");

		    //self.populateAnswerOptions();

		    questionManager.newQuestion();

		    self.questionText(questionManager.questionText);

		    self.firstRowOptions(questionManager.answerOptions.slice(0, 4));
		    self.secondRowOptions(questionManager.answerOptions.slice(4, 8));

		    if (self.quizQuestionNumber() === params.settings.quizMode.questionCount()) {
		        self.quizEnd();
		    } else
		        self.quizQuestionNumber(self.quizQuestionNumber() + 1);

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
		    self.showQuizFooter(false);
		    clearTimeout(self.timer);
		    self.timeRemaining('');
        
		    var timeStr = 'Completed in ' + self.getTimeLongDisplay(self.elapsedTime);

		    var questionCount = params.settings.quizMode.questionCount();
		    var correctCount = 0;
		    for (var i = 0; i < self.quizQuestions().length; i++) {
		        if (self.quizQuestions()[i].correct)
		            correctCount++;
		    }

		    var percentStr = Math.round(correctCount / questionCount * 100) + '%';

		    var displayStr = correctCount + ' out of ' + questionCount + '</br>' + percentStr;
		    if (self.ranOutOfTime)
		        displayStr = 'Time Up!</br>' + displayStr
		    else
		        displayStr = displayStr + '</br>' + timeStr;

		    self.quizResultsDescription(displayStr);
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

		//self.getRandomOperator = function () {
		//    var activeOps = self.getActiveOperators();
		//    return activeOps[Math.floor((Math.random() * activeOps.length))];
		//}

		//self.populateAnswerOptions = function () {
		//    var answer = self.questionAnswer;
		//    var answerIndex = Math.floor((Math.random() * 8)); // 0 to 7 - 8 options to select from  
		//    var diff = answer - answerIndex;

		//    if (diff < 0) {
		//        answerIndex = 0;
		//        diff = 0;
		//    }

		//    var opts1 = [];
		//    var opts2 = [];

		//    for (var i = 0; i < 4; i++) {
		//        opts1.push({ value: diff + i });
		//        opts2.push({ value: diff + i + 4}); // + 4 for second row
		//    }

		//    self.firstRowOptions(opts1);
		//    self.secondRowOptions(opts2);

		//}

		self.startQuiz = function () {
		    self.showQuizStartScreen(false);
		    self.quizQuestionNumber(1);
		    self.showQuizFooter(true);
		    self.showQuiz(true);
		    self.quizQuestions.removeAll();
		    self.showQuizResults(false);
		    self.elapsedTime = 0;
		    self.timeRanOut = false;
		    self.timeRemaining(params.settings.quizMode.timeLimit() * 60);

		    self.timer = setInterval(function () {
		        self.elapsedTime += 1;

		        var limit = params.settings.quizMode.timeLimit() * 60;

		        self.timeRemaining(limit - self.elapsedTime)

		        //console.log(self.elapsedTime + ' out of ' + );
		        if (self.elapsedTime >= limit) {
		            self.timeRanOut = true;
		            self.quizEnd();
		            //console.log('end');
		        }
		    }, 1000);
		}

		self.quizDescription = ko.computed(function () {
		    var str = '';
		    var quizMode = params.settings.quizMode;
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

		    str = quizMode.questionCount() + ' ' + opsStr + ' questions';

		    return str;
		});


		self.quizProgressDescrip = ko.computed(function () {
		    return self.quizQuestionNumber() + ' of ' + params.settings.quizMode.questionCount();
		});

		self.onSettingsClicked = function () {
		    if (params.onSettingsClick)
		        params.onSettingsClick();
		}
				

		//for (var i = 0; i < 250; i++) {
		//    console.log(self.getTimeLongDisplay(i));
		//}


		self.init();
    }
	
});
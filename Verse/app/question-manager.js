define(['knockout'], function (ko) {

    return new function questionManagerModel(params) {
        var self = this;

        // options
        self.operators = []; // needs to be observable? each operator has .sign, .maxTerm
        self.answerOptionCount = 8;
        self.quizQuestionCount = 0;

        // variables set when newQuestion() is called
        self.answer = 0;
        self.questionText = '';
        self.answerOptions = [];

        // variables for managing past questions
        self.pastQuestions = [];
        self.questionNumber = ko.observable(0);
        //self.questionsRemaining = 0;
        self.repeatIncorrect = false;
        self.questionCount = 0;

        self.nextQuestion = function () {
            if (!self.repeatIncorrect)
                self.newQuestion()
            else {
                var question = self.pastQuestions[self.questionNumber()]; // questionNumber starts at 1
                
                self.answer = question.answer;
                self.questionText = question.text;               
            }

            
            self.populateAnswerOptiosnRandom();
            //self.questionsRemaining -= 1;

            self.questionNumber(self.questionNumber() + 1);
        }

        self.newQuestion = function () {
            var operator = self.operators[Math.floor((Math.random() * self.operators.length))];
            var term1, term2;
            var maxTerm = operator.maxTerm();
            term1 = Math.floor((Math.random() * (maxTerm + 1)));
            term2 = Math.floor((Math.random() * (maxTerm + 1)));

            if (operator.sign === '+') {
                self.answer = term1 + term2;
            } else if (operator.sign === '-') {
                if (term1 < term2) {
                    var temp = term1;
                    term1 = term2;
                    term2 = temp;
                }
                self.answer = term1 - term2;
            } if (operator.sign === 'x') {
                self.answer = term1 * term2;
            } else if (operator.sign === '&divide;') {
                term2 = Math.floor((Math.random() * maxTerm) + 1); // can't divide by 0
                self.answer = term1;
                term1 = self.answer * term2;
            }

            self.questionText = term1 + " " + operator.sign + " " + term2 + " = ?";
        }

        self.init = function () {
            self.questionNumber(0);

            if (self.repeatIncorrect) {
                var temp = [];
                for (var i = 0; i < self.pastQuestions.length; i++) {
                    if (!self.pastQuestions[i].correct)
                        temp.push(self.pastQuestions[i]);
                }
                self.pastQuestions = temp;

                self.questionCount = self.pastQuestions.length;

            } else {
                self.pastQuestions = [];
                self.questionCount = self.quizQuestionCount;
            }
        }

        self.checkAnswer = function (ans) {
            var correct = ans === self.answer;

            if (self.repeatIncorrect) {
                var question = self.pastQuestions[self.questionNumber() - 1];
                question.answer = self.answer;
                question.correct = correct;
                question.submittedAnswer = ans;
            } else {
                self.pastQuestions.push({
                    text: self.questionText,
                    answer: self.answer,
                    submittedAnswer: ans,
                    correct: correct
                }); //, color: correctAnswer ? 'black' : 'red' });
            }


            return correct;
        }

        self.clearHistory = function () {
            self.pastQuestions = [];
        }

        self.populateAnswerOptions = function () {
            var answer = self.answer;
            var answerIndex = Math.floor((Math.random() * self.answerOptionCount)); // 0 to 7 - 8 options to select from  
            var diff = answer - answerIndex;

            if (diff < 0) {
                answerIndex = 0;
                diff = 0;
            }

            var opts = [];

            for (var i = 0; i < self.answerOptionCount; i++) {
                opts.push({ value: diff + i });
            }

            self.answerOptions = opts;

        }

        self.populateAnswerOptiosnRandom = function () {
            var answer = self.answer;
            var opts = [answer];

            var max = Math.max(Math.ceil(answer * 1.8), 10);
            var rand;

            for (var i = 0; i < self.answerOptionCount - 1; i++) { // -1 since answer is already in array
                rand = Math.floor((Math.random() * max));

                while (opts.indexOf(rand) > -1) 
                    rand = Math.floor((Math.random() * max));

                opts.push(rand);
            }
            opts.sort(function (a, b) { return a - b });

            //console.log(opts);

            self.answerOptions = opts;
        }

    }

});

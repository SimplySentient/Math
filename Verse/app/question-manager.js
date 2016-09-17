define(['knockout'], function (ko) {

    return new function questionManagerModel(params) {
        var self = this;

        // options
        self.operators = []; // needs to be observable? each operator has .sign, .maxTerm
        self.answerOptionCount = 8;


        // variables set when newQuestion() is called
        self.answer = 0;
        self.questionText = '';
        self.answerOptions = [];


        self.getRandomOperator 

        self.newQuestion = function () { // returns answer, answerOptions, questionText
            console.log("new question");


            var operator = self.operators[Math.floor((Math.random() * self.operators.length))]; // self.getRandomOperator();
            var term1, term2;
            var maxTerm = operator.maxTerm();
            term1 = Math.floor((Math.random() * maxTerm) + 1);
            term2 = Math.floor((Math.random() * maxTerm) + 1);

            if (operator.sign === '+') {
                self.answer = term1 + term2;
            } else if (operator.sign === '-') {
                self.answer = term1;
                term1 = self.answer + term2;
            } if (operator.sign === 'x') {
                self.answer = term1 * term2;
            } else if (operator.sign === '&divide;') {
                self.answer = term1;
                term1 = self.answer * term2;
            }

            self.questionText = term1 + " " + operator.sign + " " + term2 + " = ?";

            self.populateAnswerOptions();


            //if (self.quizQuestionNumber() === params.settings.quizMode.questionCount()) {
            //    self.quizEnd();
            //} else
            //    self.quizQuestionNumber(self.quizQuestionNumber() + 1);
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


        console.log('question manager');

    }

    

});

define(['knockout'], function(ko) {
    return function viewManagerModel() {
        var self = this;
			
        //self.maxAddText = ko.computed(function() {});

        self.init = function () {
            self.loadSettings();

            self.initOperators();   

            self.activeComponent = ko.observable(self.viewComponents()[0]);
            

            
        }

        self.settings = {

            operators: ko.observableArray([
                {
                    name: 'Addition',
                    sign: '+',
                    active: ko.observable(true),
                    maxTerm: ko.observable(10)
                },    
                { name: 'Subtraction', sign: '-', active: ko.observable(true), maxTerm: ko.observable(10), maxPhrase: 'Max subtrahend' },
                { name: 'Multiplication', sign: 'x', active: ko.observable(false), maxTerm: ko.observable(10), maxPhrase: 'Max multiplicand' },
                { name: 'Division', sign: '&divide;', active: ko.observable(false), maxTerm: ko.observable(10), maxPhrase: 'Max divisor' } // ÷ doesn't display in html
            ]),

            quizMode: {
                active: ko.observable(false),
                questionCount: ko.observable(10),
                timerActive: ko.observable(false),
                timeLimit: ko.observable(5) // minutes
            }
        }

        self.initOperators = function () {
            var ops = self.settings.operators();
            var op;
            for (var i = 0; i < ops.length; i++) {
                op = ops[i];

                if (op.name === 'Addition') {
                    op.maxPhrase = ko.computed(function () {
                        var max = self.settings.operators()[0].maxTerm(); // can't use op here because the computed keeps reference to the last op (division)
                        var text = self.boldHtmlText(max);
                        return text + ' + ' + text + ' = ' + (max + max)
                    })
                } else if (op.name === 'Subtraction') {
                    op.maxPhrase = ko.computed(function () {
                        var max = self.settings.operators()[1].maxTerm();
                        var text = self.boldHtmlText(max);
                        return text + ' - ' + text + ' = ' + (max - max)
                    })
                } else if (op.name === 'Multiplication') {
                    op.maxPhrase = ko.computed(function () {
                        var max = self.settings.operators()[2].maxTerm();
                        var text = self.boldHtmlText(max);
                        return text + ' x ' + text + ' = ' + (max * max)
                    })
                } else if (op.name === 'Division') {
                    op.maxPhrase = ko.computed(function () {
                        var max = self.settings.operators()[3].maxTerm();
                        return (max * max) + ' &divide; ' + self.boldHtmlText(max) + ' = ' + max;
                    })
                }
            }
        }

        self.boldHtmlText = function(text) {
            //return '<span style="color: #32d25b">' + text + '</span>';
            return '<span style="font-weight: 500">' + text + '</span>';
        }


        //self.maxAddText = ko.computed(function () {
        //    var max = self.settings.operators()[0].maxTerm();
        //    console.log("max");
        //    return max + ' + ' + max + ' = ' + (max + max)
        //});
    

		self.onBackClick = function() { // primary icon is always back
			self.activeComponent(self.viewComponents()[0]);
		}

		self.setActiveComponent = function (name) {
		    var comps = self.viewComponents();
		    for (var i = 0; i < comps.length; i++) {
		        if (comps[i].name === name)
		            self.activeComponent(comps[i]);
		    };

		}
				
		self.viewComponents = ko.observableArray([
			{
			    name: 'quiz-view',
			    params: {
                    settings: self.settings,
			        onSettingsClick: function () { self.setActiveComponent('settings'); }

			    }
			},
			{
			    name: 'settings',
			    params: {
                    settings: self.settings,
                    onBackClick: function () {
                        self.saveSettings();
                        self.setActiveComponent('quiz-view');
                    }

			    }
			}
		]);



		self.onBackKeyDown = function() {
		    self.activeComponent(self.viewComponents()[0]);
		    alert('go back!');
		}

		self.saveSettings = function () {
		    var opsStr = '';
		    var maxTermsStr = '';
		    var ops = self.settings.operators();
		    var opIsActive = false;
		    for (var i = 0; i < ops.length; i++) {
		        if (ops[i].active()) {
		            opsStr = opsStr + '1';
                    opIsActive = true;
		        }  else
		            opsStr = opsStr + '0';

		        maxTermsStr = maxTermsStr + ops[i].maxTerm()
                if (i < ops.length - 1)
		            maxTermsStr = maxTermsStr + '|';
		    }
		    if (!opIsActive)
		        ops[0].active(true);

		    //console.log(maxTermsStr);
		    Cookies.set('operators', opsStr, { expires: 365 });
		    Cookies.set('maxTerms', maxTermsStr, { expires: 365 });

		    Cookies.set('quizMode', self.settings.quizMode.active() ? '1' : '0', { expires: 365 });
		    Cookies.set('quizQuestionCount', self.settings.quizMode.questionCount(), { expires: 365 });
		    Cookies.set('timerActive', self.settings.quizMode.timerActive() ? '1' : '0', { expires: 365 });
		    Cookies.set('quizTimeLimit', self.settings.quizMode.timeLimit(), { expires: 365 });


		}

		self.loadSettings = function () {
		    var ops = Cookies.get('operators'); // array of 1 or 0 for active/inactive
		    var opIsActive = false;
		    if (ops) {
		        for (var i = 0; i < ops.length; i++) {
		            self.settings.operators()[i].active(ops[i] === '1');
		            if (ops[i] === '1') opIsActive = true;
		        }
		    }
		    if (!opIsActive)
		        self.settings.operators()[0].active(true);

		    var maxTerms = Cookies.get('maxTerms');
            if (maxTerms) {
		        var maxTermsArray = maxTerms.split('|');
		        //console.log(maxTermsArray);

		        for (var i = 0; i < maxTermsArray.length; i++) {
		            self.settings.operators()[i].maxTerm(Number(maxTermsArray[i]));
		        }
            }

            var quizMode = Cookies.get('quizMode');
            if (quizMode)
                self.settings.quizMode.active(quizMode === '1');

            var questionCount = Cookies.get('quizQuestionCount');
            if (questionCount)
                self.settings.quizMode.questionCount(Number(questionCount));

            var timerActive = Cookies.get('timerActive');
            if (timerActive)
                self.settings.quizMode.timerActive(timerActive);

            var quizTimeLimit = Cookies.get('quizTimeLimit');
            if (quizTimeLimit)
                self.settings.quizMode.timeLimit(Number(quizTimeLimit));
		}




		//document.addEventListener("onpageshow", function () { console.log("we have loaded") });

		//window.onload = function () {
		    document.addEventListener("backbutton", self.onBackKeyDown, true);

		   // console.log("window on load funciton");
		//}
		
		    self.init();
		
    }
	
});
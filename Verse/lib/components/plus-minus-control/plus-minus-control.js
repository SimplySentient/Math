define(['knockout'], function(ko) {
    return function plusMinusControl(params) {
		var self = this;
		
        // expected in params:
        // params.value = ko.observable
        // params.minValue = int (opt, default 0)

		self.value = params.value; // default?
		self.minValue = params.minValue || 0;
		self.unit = params.unit || '';
		//console.log(self.minValue);
		self.hideValue = ko.observable(params.hideValue || false);
		self.increment = params.increment || 1;

		self.clickMinus = function () {
            if (self.minusIsEnabled())
		        self.value(self.value() - self.increment);
		}

		self.minusIsEnabled = function () {
		    return (self.value() > self.minValue);
		}

		self.clickPlus = function () {
		    self.value(self.value() + self.increment);
		}

		self.displayValue = ko.computed(function () {
            if (params.text)
                return params.text();
            else 
		        return self.value() + self.unit;
		});

		//self.timerEnabled = false;

		//self.clickMinusStart = function () {
		//    self.timerEnabled = true;
		//    self.startTick(-1, 200);
		//}

		//self.clickPlusStart = function () {
		//    self.timerEnabled = true;
		//    self.startTick(1, 200);
		//}

		//self.clickEnd = function () {
		//    self.timerEnabled = false;
		//}

		//self.startTick = function (change, time) {
		//    if (!self.timerEnabled) return;
		//    self.value(self.value() + change);
		//    setTimeout(function () {
		//        self.startTick(change, time);
		//    }, time);
		//}


    }
	
});
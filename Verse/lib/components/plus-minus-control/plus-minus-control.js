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
        

		self.clickMinus = function () {
            if (self.value() > self.minValue)
		        self.value(self.value() - 1);
		}

		self.clickPlus = function () {
		    self.value(self.value() + 1);
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
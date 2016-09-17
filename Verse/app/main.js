define(function (require) {
	var ko = require('knockout');
	
	ko.components.register('view-manager', {
		viewModel: require('components/view-manager/view-manager'),
		template:  { require: 'text!components/view-manager/view-manager.html' }
	});

	ko.components.register('quiz-view', {
	    viewModel: require('components/quiz-view/quiz-view'),
	    template: { require: 'text!components/quiz-view/quiz-view.html' }
	});

	ko.components.register('settings', {
	    viewModel: require('components/settings/settings'),
	    template: { require: 'text!components/settings/settings.html' }
	});

	ko.components.register('plus-minus-control', {
	    viewModel: require('components/plus-minus-control/plus-minus-control'),
	    template: { require: 'text!components/plus-minus-control/plus-minus-control.html' }
	});

	function ThereHasToBeABetterWay() {}
 
	ko.applyBindings(new ThereHasToBeABetterWay());

});

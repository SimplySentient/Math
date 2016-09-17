requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../app',
		jquery: 'jquery/jquery-2.2.1.min',
		knockout: 'knockout/knockout.min',
		text: 'requirejs/text',
        questionManager: '../app/question-manager'
    }
});

//define(['jquery', 'knockout'], function($, ko){ // I think is supposed to make ko global.. but haven't got it working


	requirejs(['app/main']);
//});

	

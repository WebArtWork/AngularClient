var directives = {};
app.directive(directives);
directives.topbar=function(){
	"ngInject";
	return {
		restrict: 'E',
		templateUrl: '/html/structure/topbar.html'
	}
};
app.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/Route');
	var root = '/Route';
	$stateProvider.state({
		name: 'hello',
		url: root,
		template: '<h3>hello world!</h3>'
	}).state({
		name: 'about',
		url: root+'/about',
		template: '<h3>Its the UI-Router hello world app!</h3>'
	});
	$locationProvider.html5Mode(true);
});
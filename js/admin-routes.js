var directives = {};
app.directive(directives);
directives.topbar=function(){
	"ngInject";
	return {
		restrict: 'E',
		templateUrl: '/html/admin/_topbar.html'
	}
};
app.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
	var root = '/Admin';
	$urlRouterProvider.otherwise(root);
	$stateProvider.state({
		name: 'Users',
		url: root,
		templateUrl: '/html/admin/Users.html'
	}).state({
		name: 'Profile',
		url: root+'/Profile/:_id',
		templateUrl: '/html/admin/Profile.html'
	});
	$locationProvider.html5Mode(true);
});
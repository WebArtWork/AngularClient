var a_directives = {};
app.directive(a_directives);
a_directives.topbar=function(){
	"ngInject";
	return {
		restrict: 'E',
		templateUrl: '/html/admin/_topbar.html'
	}
};
var ctrl = function($scope, User, $http){
	var u = $scope.u = User;
	if(!u.allUsers){
		$http.get('/api/user/admin/users').then(function(resp){
			u.allUsers = resp.data;
		});
	}
	u.create = function(email, password) {
		$http.post('/api/user/admin/create', {
			password: user.password,
			email: user.email
		}).then(function(resp){
			if(resp.data) u.allUsers.push(resp.data);
		});
	}
	u.update = function(user) {
		$timeout.cancel(user.ut);
		$http.post('/api/user/admin/update', {
			avatarUrl: user.avatarUrl,
			skills: user.skills,
			followings: user.followings,
			followers: user.followers,
			gender: user.gender,
			name: user.name,
			birth: user.birth,
			data: user.data,
			_id: user._id
		});
	}
	u.updateAfterWhile = function(user){
		$timeout.cancel(user.ut);
		user.ut = $timeout(function(){
			u.update(user);
		}, 1000);
	}
	u.delete = function(user){
		$http.post('/api/user/admin/delete', {
			_id: user._id
		});
	}
	u.changePassword = function(newPass){
		$http.post('/api/user/admin/changePassword',{
			newPass: newPass
		});
	}
}
app.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
	var root = '/Admin';
	$urlRouterProvider.otherwise(root);
	$stateProvider.state({
		name: 'Users',
		url: root, controller: ctrl,
		templateUrl: '/html/admin/Users.html'
	}).state({
		name: 'Profile', controller: ctrl,
		url: root+'/Profile/:_id',
		templateUrl: '/html/admin/Profile.html'
	});
	$locationProvider.html5Mode(true);
});
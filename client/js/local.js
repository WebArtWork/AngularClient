controllers.Users = function($scope, User){
	"ngInject";
	$scope.u = User;
}
directives.lusers = function(){
	return {
		restrict: "A",
		transclude: true,
		templateUrl: '/html/public/_explore_local.html'
	}
}
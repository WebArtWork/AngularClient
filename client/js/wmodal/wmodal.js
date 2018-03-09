angular.module("wmodal", ["wmodal_spinner.html", "wmodal_service", "wmodal_modal.html", "wmodal_fmodal.html"]);
angular.module("wmodal_spinner.html", []).run(["$templateCache", function($templateCache) {
	$templateCache.put("wmodal_spinner.html", "<div></div>");
}]);
angular.module("wmodal_modal.html", []).run(["$templateCache", function($templateCache) {
	$templateCache.put("wmodal_modal.html", "<div class='modal'><div class='modal_fade' ng-click='close(); $root.bodyScrollHidden=false'></div><div class='modal_content viewer'><i class='icon icon-close close-m' ng-click='close(); $root.bodyScrollHidden=false'></i><ng-transclude>This is the default content of the modal</ng-transclude></div></div>");
}]);
angular.module("wmodal_fmodal.html", []).run(["$templateCache", function($templateCache) {
	$templateCache.put("wmodal_fmodal.html", "<div class='modal'><div class='modal_fade' ng-click='close(); $root.bodyScrollHidden=false'></div><div class='modal_content viewer'><i class='icon icon-close close-m' ng-click='close(); $root.bodyScrollHidden=false'></i><ng-transclude>This is the default content of the modal</ng-transclude></div></div>");
}]);
angular.module("wmodal_service", [])
.service('wmodal', function($compile, $rootScope){
	"ngInject";
	var self = this;
	/*
	*	Modals
	*/
		this.modals = [];
		this.modal_link = function(scope, el){
			scope.close = function(){
				for (var i = 0; i < self.modals.length; i++) {
					if(self.modals[i].id==scope.id){
						self.modals.splice(i, 1);
						break;
					}
				}
				if(self.modals.length == 0){
					angular.element(document).find('html').removeClass('bodynoscroll');
				}
				if(scope.cb) scope.cb();
				el.remove();
			}
			for (var i = 0; i < self.modals.length; i++) {
				if(self.modals[i].id==scope.id){
					self.modals[i].close = scope.close;
					scope._data = self.modals[i];
					for(var key in self.modals[i]){
						scope[key] = self.modals[i][key];
					}
					break;
				}
			}
		}
		var addModal = function(obj, dir){
			if(!obj.id) obj.id = Date.now();
			let modal = '<'+dir+' id="'+obj.id+'">';
			if(obj.template) modal += obj.template;
			else if(obj.templateUrl){
				modal += '<ng-include src="';
				modal += "'"+obj.templateUrl+"'";
				modal += '" ng-controller="wparent"></ng-include>';
			}
			modal += '</'+dir+'>';
			self.modals.push(obj);
			let body = angular.element(document).find('body').eq(0);
			body.append($compile(angular.element(modal))($rootScope));
			angular.element(document).find('html').addClass('bodynoscroll');
		}
		this.modal = function(obj){
			addModal(obj, 'wmodal');
		}
		this.fwmodal = function(obj){
			addModal(obj, 'fwmodal');
		}
	/*
	*	Morphs
	*/
	/*
	*	Popups
	*/
	/*
	*	Spinners
	*/
		this.spinners = [];
		this.spinner = function(obj){
			if(!obj.id) obj.id = Date.now();
			var spinner = '<wspinner id="'+obj.id+'">';
			spinner += '</wspinner>';
			this.spinners.push(obj);
			document.body.innerHTML += spinner;
		}
	/*
	*	End of wmodal
	*/
}).directive('fwmodal', function(wmodal) {
	"ngInject";
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			id: '@'
		}, link: wmodal.modal_link, templateUrl: 'wmodal_fmodal.html'
	};
}).directive('wmodal', function(wmodal) {
	"ngInject";
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			id: '@'
		}, link: wmodal.modal_link, templateUrl: 'wmodal_modal.html'
	};
}).controller('wparent', function($scope, $timeout) {
	"ngInject";
	$timeout(function(){
		if($scope.$parent.$parent._data){
			for (var key in $scope.$parent.$parent._data) {
				$scope[key] = $scope.$parent.$parent._data[key];
			}
		}
		if($scope.$parent._data){
			for (var key in $scope.$parent._data) {
				$scope[key] = $scope.$parent._data[key];
			}
		}
	});
}).directive('wspinner', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			id: '@'
		},
		templateUrl: 'wmodal_spinner.html'
	};
});
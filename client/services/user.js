app.service('user', ['$http', 'mongo', function($http, mongo){
	var self = this;
	$http.get('/api/user/me').then(function(resp){
		for (var key in resp.data) {
			self[key] = resp.data[key];
		}
		self.users = mongo.get('user');
	});
	this.update = function(){
		mongo.afterWhile(self, ()=>{
			mongo.updateAll('user', self, {
				fields: '_id name'
			});
		});
	}
	this.change_password = function(oldPass, newPass){
		$http.post('/api/user/changePassword', {
			newPass: newPass,
			oldPass: oldPass
		}, function(resp){
			if(resp) alert('successfully changed password');
			else alert('failed to change password');
		});	
	}
}]);
var services = {}, filters = {}, directives = {}, controllers = {};
app.service(services).filter(filters).directive(directives).controller(controllers);
/*
*	Crud file for client side user
*	We don't use waw crud on the user as it's basically personal update.
*	And if user use more then one device we can easly handle that with sockets.
*/
services.User = function($http, $timeout, mongo, fm){
	// waw crud
		let self = this;
		this.all_skills = ['cooking','fishing','painting'];
		let updateAll = function(){
			return {
				followings: self.followings,
				followers: self.followers,
				gender: self.gender,
				skills: self.skills,
				birth: self.birth,
				name: self.name,
				data: self.data,
				_id: self._id,
				is: self.is
			};
		}
		$http.get('/api/user/me').then(function(resp){
			for(let key in resp.data){
				self[key] = resp.data[key];
			}
			self.birth = new Date(self.birth);
			self.skills_checked = {};
			for (var i = 0; i < self.skills.length; i++) {
				self.skills_checked[self.skills[i]] = true;
			}
			let yearNow = new Date().getFullYear();
			self.users = mongo.get('user', {
				age: function(val, cb, doc){
					doc.birth = new Date(doc.birth);
					let ageDate = new Date(Date.now() - doc.birth.getTime());
					cb(Math.abs(ageDate.getUTCFullYear() - 1970));
				}
			});
		});
		this.updateSkill = function(skill){
			self.skills = [];
			for(let key in self.skills_checked){
				if(self.skills_checked[key]){
					self.skills.push(key);
				}
			}
			mongo.updateAll('user', updateAll());
		}
	// Search
		let keepByBiggerNumber = function(docs, field, number){
			for (var i = docs.length - 1; i >= 0; i--) {
				if(Array.isArray(docs[i][field])){
					let keep = false;
					for (var j = 0; j < docs[i][field].length; j++) {
						if (docs[i][field][j] >= number) {
							keep = true;
							break;
						}
					}
					if(keep) continue;
				}else{
					if(docs[i][field] >= number){
						continue;
					}
				}
				docs.splice(i, 1);
			}
		}
		let keepBySmallerNumber = function(docs, field, number){
			for (var i = docs.length - 1; i >= 0; i--) {
				if(Array.isArray(docs[i][field])){
					let keep = false;
					for (var j = 0; j < docs[i][field].length; j++) {
						if (docs[i][field][j] <= number) {
							keep = true;
							break;
						}
					}
					if(keep) continue;
				}else{
					if(docs[i][field] <= number){
						continue;
					}
				}
				docs.splice(i, 1);
			}
		}
		let cutByBiggerNumber = function(docs, field, number){}
		let cutBySmallerNumber = function(docs, field, number){}
		let keepByText = function(docs, field, string, equal){
			string = string.toLowerCase();
			for (var i = docs.length - 1; i >= 0; i--) {
				if(Array.isArray(docs[i][field])){
					let keep = false;
					for (var j = 0; j < docs[i][field].length; j++) {
						if (equal) {
							if (docs[i][field][j].toLowerCase() == string) {
								keep = true;
								break;
							}
						} else {
							if (docs[i][field][j].toLowerCase().indexOf(string)>-1) {
								keep = true;
								break;
							}
						}
					}
					if(keep) continue;
				}else{
					if(equal){
						if(docs[i][field].toLowerCase() == string){
							continue;
						}
					}else{
						if(docs[i][field].toLowerCase().indexOf(string)>-1){
							continue;
						}
					}
				}
				docs.splice(i, 1);
			}
		}
		let cutByText = function(docs, field, string, equal){
			string = string.toLowerCase();
			for (var i = docs.length - 1; i >= 0; i--) {
				if(Array.isArray(docs[i][field])){
					for (var j = 0; j < docs[i][field].length; j++) {
						if (equal) {
							if (docs[i][field][j].toLowerCase() == string) {
								docs.splice(i, 1);
								break;
							}
						} else {
							if (docs[i][field][j].toLowerCase().indexOf(string)>-1) {
								docs.splice(i, 1);
								break;
							}
						}
					}
				}else{
					if(equal){
						if(docs[i][field].toLowerCase() == string){
							docs.splice(i, 1);
						}
					}else{
						if(docs[i][field].toLowerCase().indexOf(string)>-1){
							docs.splice(i, 1);
						}
					}
				}
			}
		}
		this.sMale = this.sFemale = true;
		this.search = function(){
			if(self.sMinAge<1) self.sMinAge = 1;
			if(self.sMaxAge>100) self.sMaxAge = 100;
			// Queried Users
			mongo.afterWhile(self, function(){
				if(self.sMaxAge<self.sMinAge) self.sMaxAge=self.sMinAge;
				self.qu = self.users.slice();
				self.sName&&keepByText(self.qu, 'name', self.sName);
				if(!self.sMale||!self.sFemale){
					if(self.sMale) keepByText(self.qu, 'gender', 'male', true);
					else keepByText(self.qu, 'gender', 'female', true);
				}
				for (var i = 0; i < self.all_skills.length; i++) {
					if(self['ss_'+self.all_skills[i]]){
						keepByText(self.qu, 'skills', self.all_skills[i], true);
					}
				}
				self.sMinAge&&keepByBiggerNumber(self.qu, 'age', self.sMinAge);
				self.sMaxAge&&keepBySmallerNumber(self.qu, 'age', self.sMaxAge);
			}, 500);
		}
		this.if_false_make_true = function(prefix){
			if(!self[prefix]) self[prefix] = true;
		}


		this.follow = function(user){
			mongo.updateAll('user', updateAll());
		}
		this.unfollow = function(user){
			mongo.updateAll('user', updateAll());
		}
	// Custom Routes
		this.updateAfterWhile = function(){
			mongo.afterWhile(self, function(){
				mongo.updateAll('user', updateAll());
			});
		}
		fm.add({
			_id: 'ProfileID',
			width: 350,
			height: 350
		}, function(dataUrl) {
			self.avatarUrl = dataUrl;
			$http.post('/api/user/avatar',{
				dataUrl: dataUrl
			}).then(function(resp){
				if(resp) self.avatarUrl = resp.data;
			});
		});
		this.delete = function(){
			mongo.delete('user', {}, function(){
				window.location.href = "/";
			});
		}
		this.changePassword = function(oldPass, newPass, passRepeated){
			if(!oldPass||oldPass.length<8||!newPass) return;
			$http.post('/api/user/changePassword',{
				oldPass: oldPass,
				newPass: newPass
			});
		}
	// End of service
}
module.exports = function(app, sd) {
	/*
	*	Support
	*/
		var ro = function(req, res, obj){
			if(req.user&&req.user.lang) obj.lang = req.user.lang;
			else if(req.session.lang) obj.lang = req.session.lang;
			else obj.lang = 'en';
			if(req.originalUrl=='/'){
				obj.enUrl = '/en';
				obj.uaUrl = '/ua';
				obj.ruUrl = '/ru';
			}else{
				obj.enUrl = req.originalUrl.replace('/en','').replace('/ua','').replace('/ru','') + '/en';
				obj.uaUrl = req.originalUrl.replace('/en','').replace('/ua','').replace('/ru','') + '/ua';
				obj.ruUrl = req.originalUrl.replace('/en','').replace('/ua','').replace('/ru','') + '/ru';
			}
			obj.user = req.user;
			return obj;
		}
		var setEn = function(req, res, next){
			if(req.user){
				req.user.lang = 'en';
				req.user.save();
			}else req.session.lang = 'en'
			next();
		};
		var setUa = function(req, res, next){
			if(req.user){
				req.user.lang = 'ua';
				req.user.save();
			}else req.session.lang = 'ua'
			next();
		};
		var setRu = function(req, res, next){
			if(req.user){
				req.user.lang = 'ru';
				req.user.save();
			}else req.session.lang = 'ru'
			next();
		};
		var ensure = function(req, res, next){
			if(req.user) next();
			else res.json(false);
		};
		var ensureAdmin = function(req, res, next){
			if(req.user&&req.user.isAdmin) next();
			else res.json(false);
		};
	/*
	*	Simple
	*	[add simple below this line]
	*/
		var Login = function(req, res){
			res.render('simple/Login', ro(req, res, {}));
		}
		app.get('/Login', Login);
		app.get('/Login/en', setEn, Login);
		app.get('/Login/ua', setUa, Login);
		app.get('/Login/ru', setRu, Login);
	/*
	*	Local
	*	[add local below this line]
	*/
		var Landing = function(req, res){
			res.render('local/Landing', ro(req, res, {}));
		}
		app.get('/', Landing);
		app.get('/en', setEn, Landing);
		app.get('/ua', setUa, Landing);
		app.get('/ru', setRu, Landing);

		var Profile = function(req, res){
			res.render('local/Profile', ro(req, res, {}));
		}
		app.get('/Profile', Profile);
		app.get('/Profile/en', setEn, Profile);
		app.get('/Profile/ua', setUa, Profile);
		app.get('/Profile/ru', setRu, Profile);

		var Sign = function(req, res){
			res.render('local/Sign', ro(req, res, {}));
		}
		app.get('/Sign', Sign);
		app.get('/Sign/en', setEn, Sign);
		app.get('/Sign/ua', setUa, Sign);
		app.get('/Sign/ru', setRu, Sign);
		
		
	/*
	*	Local Routes
	*	[add local routes below this line]
	*/
		var admin = function(req, res){
			res.render('Admin', ro(req, res, {}));
		}
		app.get('/Admin', ensureAdmin, admin);
		app.get('/Admin/*', ensureAdmin, admin);
	/*
	*	Scripts
	*/
	/*
	*	End of
	*/
};
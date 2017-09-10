module.exports = function(app, sd) {
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

	/*
	*	Routes
	*/
		var route = function(req, res){
			res.render('Simple', ro(req, res, {}));
		}
		app.get('/', route);
		app.get('/en', setEn, route);
		app.get('/ua', setUa, route);
		app.get('/ru', setRu, route);
		
		var Local = function(req, res){
			res.render('Local', ro(req, res, {}));
		}
		app.get('/Local', Local);
		app.get('/Local/en', setEn, Local);
		app.get('/Local/ua', setUa, Local);
		app.get('/Local/ru', setRu, Local);
		
		var Route = function(req, res){
			res.render('Route', ro(req, res, {}));
		}
		app.get('/Route', Route);
		app.get('/Route/en', setEn, Route);
		app.get('/Route/ua', setUa, Route);
		app.get('/Route/ru', setRu, Route);
	/*
	*	Scripts
	*/
	/*
	*	End of
	*/
};
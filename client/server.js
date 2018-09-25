module.exports = function(app, sd) {
	/*
	*	Local
	*	[add local below this line]
	*/
		var Explore = function(req, res){
			res.render('public/Explore', sd._ro(req, res, {}));
		}
		app.get('/', Explore);
		app.get('/en', sd._set_en, Explore);
		app.get('/ua', sd._set_ua, Explore);
		app.get('/ru', sd._set_ru, Explore);

		var Profile = function(req, res){
			res.render('public/Profile', sd._ro(req, res, {}));
		}
		app.get('/Profile/:_id', Profile);
		app.get('/Profile/:_id/en', sd._set_en, Profile);
		app.get('/Profile/:_id/ua', sd._set_ua, Profile);
		app.get('/Profile/:_id/ru', sd._set_ru, Profile);
	/*
	*	Local Routes
	*	[add local routes below this line]
	*/
		var Admin = function(req, res){
			res.render('Admin', sd._ro(req, res, {}));
		}
		app.get('/Admin', sd.ensure_admin||sd._ensure_block, Admin);
		app.get('/Admin/*', sd.ensure_admin||sd._ensure_block, Admin);

		var User = function(req, res){
			res.render('User', sd._ro(req, res, {}));
		}
		app.get('/*', sd._ensure, User);
	/*
	*	Scripts
	*/
	/*
	*	End of
	*/
};
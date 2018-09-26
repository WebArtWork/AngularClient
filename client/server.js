module.exports = function(app, sd) {
	sd._page('/Post', 'Explore', {
		page: 'Explore'
	});
	var Admin = function(req, res){
		res.render('Admin', sd._ro(req, res, {}));
	}
	app.get('/Admin', sd.ensure_admin||sd._ensure_block, Admin);
	app.get('/Admin/*', sd.ensure_admin||sd._ensure_block, Admin);
	app.get('*', sd._ensure, function(req, res){
		res.render('User', sd._ro(req, res, {}));
	});
};
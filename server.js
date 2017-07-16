module.exports = function(app, sd) {
	/*
	*	Routes
	*/
		app.get('/', function(req, res){
			res.render('Simple', {
				user: req.user
			});
		});
		app.get('/Local', function(req, res){
			res.render('Local', {
				user: req.user
			});
		});
		app.get('/Route', function(req, res){
			res.render('Route', {
				user: req.user
			});
		});
	/*
	*	Scripts
	*/
	/*
	*	End of
	*/
};
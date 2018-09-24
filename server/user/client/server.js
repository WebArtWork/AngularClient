module.exports = function(app, sd) {
	app.get('/test', function(req, res){
		res.send('server page is working');
	});
};
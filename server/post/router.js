var Post = require(__dirname + '/schema.js');
module.exports = function(sd) {
	var router = sd._initRouter('/api/post');
	sd['query_update_all_post_author'] = function(req, res) {
		return {
			_id: req.body._id,
			author: req.user._id
		};
	};
	sd['query_unique_field_post'] = function(req, res) {
		return {
			_id: req.body._id,
			author: req.user._id
		};
	};
	sd['query_get_post'] = function(req, res) {
		return {};
	}
};
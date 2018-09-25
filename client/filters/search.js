/*
*	Describe what this filter will do and where it will be used: It will be used for any kind of mongo documents with option for field and multiple search values.
*/
app.filter('search', [function(){
	return function(in){
		return in;
	}
}]);
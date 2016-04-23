// localStorage to spare the rate limit, and avoid the loading screen
var local = (function(){

	var init = function() {
		if(this.retrieve("memory")) {
			data.memory = this.retrieve("memory")
		}
		else {
			data.loading()
		}
	};

	var insert = function(name, data) {
		localStorage.setItem(name, util.stringify(data));
	};

	var retrieve = function(name) {
		return util.parse(localStorage.getItem(name));
	};

	return {
		init: init,
		insert: insert,
		retrieve: retrieve
	};

}());

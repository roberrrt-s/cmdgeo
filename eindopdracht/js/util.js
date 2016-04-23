var util = (function(){

		var parse = function(data) {
			return JSON.parse(data);
		}
		var stringify = function(data) {
			return JSON.stringify(data);
		}
		var empty = function(elem) {
			while(elem.firstChild) {
				elem.removeChild(elem.firstChild);
			};
		}

		return {
			parse: parse,
			stringify: stringify,
			empty: empty
		}

}());

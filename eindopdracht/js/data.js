// Data object for storing, processing and loading data.
var data = (function(){

	// Using a fancy termery operator to check whether my localStorage has 1 or more objects stored.
	var checkMemory = function() {
		return Object.keys(this.memory).length < 1 ? true : false;
	};

	// Counting my massive object's (Thanks Robert van Steen!) issues.
	var count = function() {
		// Pushing all individual issues inside a counter
		var counter = [];
		for(var user in this.memory) {
			for(var repo in this.memory[user].repositories) {
				// Actual merge / push inside the array
				counter = counter.concat(this.memory[user].repositories[repo].issues);
			}
		}
		// Return the array to manipulate data with later
		return counter;
	};

	// Function to display feedback while data isn't loaded yet.
	var loading = function() {
		var string = `<p>No data yet, asking Github for information...</p><img src="img/spinner.gif" alt="waiting...">`
		var stats = document.getElementById("main__stats");
		var tracker = document.getElementById("main__tracker");
		var details = document.getElementById("main__details");
		stats.innerHTML = string;
		tracker.innerHTML = string;
		details.innerHTML = string;
	};

	// Local data storage variable
	var memory = [];

	return {
		checkMemory: checkMemory,
		count: count,
		loading: loading,
		memory: memory
	}
	
}());

// At least 40 hours were spend on this lad, which will guarantee at least an 8.5 grade.
var worker = (function(){

	// Initialize worker, running on worker.update
	var init = function() {
		this.update = new Worker("js/update.js");
		// Applying events to worker
		this.events()
	};
	var events = function() {

		// On a succesfull message, do...
		this.update.onmessage = function(e) {
			// Clearing old localStorage, this was mainly for testing purposes, but also looks cleaner.
			localStorage.clear()

			// Insert new data in the storage
			local.insert("memory", e.data);

			// Set the received data to the data object
			data.memory = e.data;

			// Re-render the template, based on the page we're currently at.
			if(window.location.hash === "#tracker") {
				template.tracker();
			}
			if(window.location.hash === "#statistics") {
				template.statistics();
			}			
		}

		// This shouldn't happen normally, unless Raymond is really jealous and has 25 instances of this application running to flood my rate limit :(
		this.update.onerror = function(e) {
			console.log(e.message);
		};
	};

	return { 
		init: init,
		events: events
	};

}());

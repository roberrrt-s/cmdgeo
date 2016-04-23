// Router object.
var routes = (function(){
	var init = function() {

		// Setting this context to the global scope
		var self = this;

		// Main trigger for routing, invokes a toggle.
		window.addEventListener("hashchange", function(event) {
			self.toggle(window.location.hash);
		});	

		// Automatically toggle after the event listeners are in place, to check the current page the user is visiting
		this.toggle(window.location.hash);

	};
	
	// Basic toggle to switch to the initial route the user is visiting
	var toggle = function(route) {

		switch(route.substring(0, 8)) {
			// If nothing or #home, go to homepage
			case '':
			case "#home": 
				route = "main__home";
				break;

			// if #tracker, go to tracker
			case "#tracker":
				route = "main__tracker";
				// Render the tracker page again to refresh it
				template.tracker()
				break;

			// if #stats, go to statistics
			case "#stats":
				route = "main__stats";
				// Render the statistics page again to refresh it
				template.statistics()
				break;

			// In addition, you can now view the detail page of the github application.
			case "#details":
			
				// Splitting the url to check which data to serve
				var meta = route.split('/')
				// Loading the route template
				route = "main__details";

				// Checking if the URL is complete
				if(meta[1] === undefined || meta[2] === undefined || meta[3] === undefined) {
					window.location.hash = "#tracker"
				}
				// Checking if user exists
				else if(!data.memory[meta[1]]) {
					window.location.hash = "#tracker"
				}
				// Checking if the repo exists
				else if(!data.memory[meta[1]].repositories[meta[2]]) {
					window.location.hash = "#tracker"
				}
				// Checking if the issue exists
				else if(!data.memory[meta[1]].repositories[meta[2]].issues[meta[3]]) {
					window.location.hash = "#tracker"
				}
				// Serve the data
				else {
					 template.detail(meta[1], meta[2], meta[3])	
				}

				break;

			default: 
				// People like Laurens or Joost will most definitely abuse this router by going to #donkey and potentially break it.
				// Not going to happen, automatically going home.
				window.location.hash = "#home";
		}

		// querySelectorAll creates a nodeList instead of an array, so we're creating an anonymous array, and calling the nodeList on it so we can loop through it.
		[].forEach.call(document.querySelectorAll('body > section:not([role="navigation"])'), function(value) {
			if(route === value.id) {
				// If the route meets the section of the page, remove no-display if present
				value.classList.remove('no-display')
			}
			else {
				// If the route meets the section of the page, add no-display if not yet present
				value.classList.add("no-display");
			}
		})
	};

	return {
		init: init,
		toggle: toggle
	}
	
}());

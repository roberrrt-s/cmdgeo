// IIFE to avoid global variables
(function() {
	// Strict mode at the top of this function to enable this for the entire document
	"use strict"

// Declaring the application object
var app = {
	init: function() {
		// Initializing application by calling the routes object.
		console.log("Initialize application")
		routes.init();
	}
}

// Declaring the routes object
var routes = {
	init: function() {
		console.log("Initialize routes")

		// Adding an event listener to the window, which triggers when the hash (#) changes.
		// it invokes an anonymous function that passes to the sections object to toggle between the elements, using the window's hash as a parameter
		window.addEventListener("hashchange", function(event) {

			sections.toggle(window.location.hash.replace(/^#!/, ''))		

			console.log(window.location.hash.replace(/^#!/, ''))

		})

		// We have to check if the user comes from a place that already included a hash!
		sections.toggle(window.location.hash.replace(/^#!/, ''))
	}
}

// Declaring the sections object
var sections = {
	toggle: function(route) {
		console.log("Toggle between the sections, displaying: " + route)

		// Grabbing all sections in a variable
		var a = document.querySelectorAll("body > section")

		// Looping through all routes, while skipping the first one, the navigation by starting i at 1
		for (var i = 1; i < a.length; i++) {

			// Checking if the id of the section corresponds with the route parameter (minus the #)
		    if(a[i].id === route) {
		    	a[i].style.display = "";
		    }
		    // Else, remove the visibility
		    else {
		    	a[i].style.display = "none";
		    }
		}

		// I really need to fix this stuff.
	}
}

app.init();

}());


// IIFE to avoid global variables
(function() {
	// Strict mode at the top of this function to enable this for the entire document
	"use strict";

// Declaring the application object
var global = {
	init: function() {
		// Initializing application by calling the routes object.
		console.log("Initialize application");
		routes.init();
	}
}

// Declaring the routes object
var routes = {
	init: function() {
		console.log("Initialize routes");

		// Adding an event listener to the window, which triggers when the hash (#) changes.
		// it invokes an anonymous function that passes to the sections object to toggle between the elements, using the window's hash as a parameter
		window.addEventListener("hashchange", function(event) {

			// The original URL's in the navigation contain an !, this to preventDefault() the scrolling, when not using jquery.
			sections.toggle(window.location.hash);	

		})

		// Experimental code to remove the jumping between anchor hooks all together.		
		/*
		var links = document.querySelectorAll("a[href*='#']")

		for (var i = 0; i < links.length; i++) {
			links[i].addEventListener("click", function(event) {
				event.preventDefault();
			})
		}
		*/

		// We have to check if the user comes from a place that already included a hash, removing the ! again
		sections.toggle(window.location.hash);
	}
}

// Declaring the sections object
var sections = {
	toggle: function(route) {
		console.log("Toggle between the sections, displaying: " + route)

		// If route is null, route is #main__start
	    if(route) {
	    	var route = route;
	    } else {
	    	var route = '#main__start';
	    }

		// Grabbing all sections in a variable
		var a = document.querySelectorAll("body > section")

		// Looping through all routes, while skipping the first one, the navigation by starting i at 1
		for (var i = 1; i < a.length; i++) {

			// Checking if the id of the section corresponds with the route parameter
		    if(a[i].id === route.substr(1)) {
		    	a[i].style.display = "";
		    }
		    // Else, remove the visibility

		    else {
		    	a[i].style.display = "none";
		    };
		}

		// I really need to fix this stuff.
	}
}

global.init();

}());

// Raymond's code review:
// Omdat je zoveel comments overal heb staan, doe ik het maar even onderaan.
// Ten eerste, op refresh zonder hashtag laadt de applicatie geen van beide schermen.
// Dat komt doordat je in je if else statement in je for loop in sections.toggle niet kijkt naar of er wel een route is.
// PS. let op je punt kommas
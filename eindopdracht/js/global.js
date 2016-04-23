// CMDA Github Dashboard
// Author: Robert Spier

var main = (function() {
	"use strict";

	// I'm not using the name controller for my global variable.
	var global = {
		// Initialize localStorage procedure, Web Worker for xhr to Github, and the routes
		init: function() {
			local.init();
			worker.init();
			routes.init();
		}
	};

	global.init();

}());

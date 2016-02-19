// CMDA Github Dashboard
// Author: Robert Spier

(function() {
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

	// Router object.
	var routes = {
		init: function() {

			// Setting this context to the global scope
			var self = this;

			// Main trigger for routing, invokes a toggle.
			window.addEventListener("hashchange", function(event) {
				self.toggle(window.location.hash);
			});	

			// Add a listener when the page is loaded, to ensure we have the HTML object we need
			// This should be useless, but it doesn't seem to work without.
			window.addEventListener('load', function() { 

				// Selecting the body
			    var element = document.querySelector('body');

			    // Applying two hammer listeners on the body, invoked by swipes
			    var hamleft = Hammer(element).on("swipeleft", function(event) {
			        self.swipeLeft()
			    })
			    var hamright = Hammer(element).on("swipeleft", function(event) {
			        self.swipeRight()
			    })

			// preventDefault()
			}, false);

			// Feature to allow scrolling by using the arrow keys
			document.onkeydown = function(evt) {
				evt = evt || window.event;
				switch (evt.keyCode) {
					case 37:
						// <- left arrow button
						self.swipeLeft()
						break;
					case 39:
						// -> right arrow button
						self.swipeRight()
						break;
				}
			};

			// Automatically toggle after the event listeners are in place, to check the current page the user is visiting
			this.toggle(window.location.hash);

		},
		
		// Function to fire when user swipes / presses left.
		swipeLeft: function() {
			if(window.location.hash == "#home") {
				return false;
			}
			else if(window.location.hash == "#tracker")
				window.location.hash = "#home";
			else {
				window.location.hash = "#tracker"
			}			
		},

		// Function to fire when user swipes / presses right.
		swipeRight: function() {
			if(window.location.hash == "#stats") {
				return false;
			}
			else if(window.location.hash == "#tracker")
				window.location.hash = "#stats";
			else {
				window.location.hash = "#tracker"
			}
		},
		// I'm aware this probably isn't favorable, but it works and it's clean.

		// Basic toggle to switch to the initial route the user is visiting
		toggle: function(route) {
			switch(route) {
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
		}
	};

	// At least 40 hours were spend on this lad, which will guarantee at least an 7.5 grade.
	var worker = {
		// Initialize worker, running on worker.update
		init: function() {
			this.update = new Worker("js/update.js");
			// Applying events to worker
			this.events()
		},
		events: function() {

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
			}
		},
	};

	// Data object for storing, processing and loading data.
	var data = {

		// Using a fancy termery operator to check whether my localStorage has 1 or more objects stored.
		checkMemory: function() {
			return Object.keys(this.memory).length < 1 ? true : false;
		},

		// Counting my massive object's (Thanks Robert van Steen!) issues.
		count: function() {
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
		},
		loading: function() {
			var string = `<p>No data yet, asking Github for information...</p><img src="img/spinner.gif" alt="waiting...">`
			var stats = document.getElementById("main__stats")
			var tracker = document.getElementById("main__tracker")
			stats.innerHTML = string;
			tracker.innerHTML = string;
		},
		memory: []
	};

	var template = {
		tracker: function() {
			if(data.checkMemory()) {
				data.loading()
			}
			else {
				var section = document.getElementById('main__tracker')
				util.empty(section)
				for(var user in data.memory) {
					var login = user;
					for(var repo in data.memory[user].repositories) {
						for(var i = 0; i < data.memory[user].repositories[repo].issues.length; i++) {
							var div = document.createElement('div')
							section.appendChild(div)
							div.classList.add("block-element")
							if(data.memory[user].repositories[repo].issues[i].pull_request) {
								div.classList.add('pull-request')
							}
							else {
								div.classList.add('issue')
							}
							var string = `<h2>${data.memory[user].repositories[repo].issues[i].title}</h2> <h4>Posted by: ${data.memory[user].repositories[repo].issues[i].user.login} on ${login}'s repository</h4> <hr> <p>${data.memory[user].repositories[repo].issues[i].body}<br></p><p><a href="${data.memory[user].repositories[repo].issues[i].html_url}">View details</a>`
							div.innerHTML = string;
						}
					}
				}
			}
		},
		statistics: function() {
			if(data.checkMemory()) {
				data.loading()
			}
			else {
				var stats = document.getElementById('main__stats')

				var allcontainer = document.getElementById("allcontainer")
				var pullcontainer = document.getElementById("pullcontainer")
				var issuecontainer = document.getElementById("issuecontainer")
				var i = 0, j = 0, k = 0;
				var all = data.count()
				var isPullRequest = function(element, index, array) {
					return (!element.pull_request);
				}
				var isIssue = function(element, index, array) {
					return (element.pull_request);
				}
				var pull = all.filter(isPullRequest);
				var issues = all.filter(isIssue);
				var intall = setInterval(function() {
					if(i === all.length) {
						clearInterval(intall)
					}
					var counter = `<div class="statistics">Total amount of problems: ${i} </div>`
					allcontainer.innerHTML = counter
					i++
				}, 15)
				var intpull = setInterval(function() {
					if(j === pull.length) {
						clearInterval(intpull)
					}
					var counter = `<div class="statistics">Total amount of pull requests: ${j} </div>`
					pullcontainer.innerHTML = counter
					j++

				}, 15)
				var intiss = setInterval(function() {
					if(k === issues.length) {
						clearInterval(intiss)
					}
					var counter = `<div class="statistics">Total amount of issues: ${k} </div>`
					issuecontainer.innerHTML = counter
					k++	
				}, 15)
			}
		}
	}
 
	var local = {
		init: function() {
			if(this.retrieve("memory")) {
				data.memory = this.retrieve("memory")
			}
			else {
				data.loading()
			}
		},
		insert: function(name, data) {
			localStorage.setItem(name, util.stringify(data));
		},
		retrieve: function(name) {
			return util.parse(localStorage.getItem(name));
		}
	};

	var util = {
		parse: function(data) {
			return JSON.parse(data);
		},
		stringify: function(data) {
			return JSON.stringify(data);
		},
		empty: function(elem) {
			while(elem.firstChild) {
				elem.removeChild(elem.firstChild);
			};
		}
	};

	global.init();

}());

// CMDA Github Dashboard
// Author: Robert Spier

(function() {
	"use strict";

	var global = {
		init: function() {
			local.init();
			worker.init();
			routes.init();
		}
	};

	var routes = {CMDA Github Dashboard
		init: function() {

			var self = this;

			window.addEventListener("hashchange", function(event) {
				self.toggle(window.location.hash);
			});	

			window.addEventListener('load', function() { 
			    var element = document.querySelector('body');
			    var hamleft = Hammer(element).on("swipeleft", function(event) {
			        self.swipeLeft()
			    })
			    var hamright = Hammer(element).on("swipeleft", function(event) {
			        self.swipeRight()
			    })
			}, false);

			document.onkeydown = function(evt) {
				evt = evt || window.event;
				switch (evt.keyCode) {
					case 37:
						self.swipeLeft()
						break;
					case 39:
						self.swipeRight()
						break;
				}
			};

			this.toggle(window.location.hash);

		},

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

		toggle: function(route) {

			switch(route) {
				case '':
				case "#home": 
					route = "main__home";
					break;
				case "#tracker":
					route = "main__tracker";
					template.tracker()
					break;
				case "#stats":
					route = "main__stats";
					template.statistics()
					break;
				default: 
					window.location.hash = "#home";
			}

			[].forEach.call(document.querySelectorAll('body > section:not([role="navigation"])'), function(value) {
				if(route === value.id) {
					value.classList.remove('no-display')
				}
				else {
					value.classList.add("no-display");
				}
			})
		}
	};

	var worker = {
		init: function() {

			this.update = new Worker("js/update.js");
			this.events()

		},
		events: function() {

			this.update.onmessage = function(e) {
				localStorage.clear()
				local.insert("memory", e.data);
				data.memory = e.data;

				if(window.location.hash === "#tracker") {
					template.tracker();
				}
				if(window.location.hash === "#statistics") {
					template.statistics();
				}			
			}

			this.update.onerror = function(e) {
				console.log(e.message);
			}
		},
	};

	var data = {

		memory: [],	

		checkMemory: function() {
			return Object.keys(this.memory).length < 1 ? true : false;
		},

		count: function() {

			var counter = [];

			for(var user in this.memory) {
				for(var repo in this.memory[user].repositories) {
					counter = counter.concat(this.memory[user].repositories[repo].issues);
				}
			}

			return counter;

		},

		loading: function() {
			var string = `<p>No data yet, asking Github for information...</p><img src="img/spinner.gif" alt="waiting...">`
			var stats = document.getElementById("main__stats")
			var tracker = document.getElementById("main__tracker")
			stats.innerHTML = string;
			tracker.innerHTML = string;
		}
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

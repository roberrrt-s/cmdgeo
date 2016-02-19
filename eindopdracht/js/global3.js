(function() {
	"use strict";

	var global = {
		init: function() {
			local.init();
			worker.init();
			routes.init();
		}
	};

	var routes = {
		init: function() {

			var self = this;

			window.addEventListener("hashchange", function(event) {
				self.toggle(window.location.hash);
			});

			this.toggle(window.location.hash);

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

			this.update = new Worker("js/update3.js");
			this.events()

		},
		events: function() {

			this.update.onmessage = function(e) {
				localStorage.clear()
				local.insert("memory", e.data);
				data.memory = e.data;

				console.log("new data!")
				console.log(data.memory)

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

			var counter = 0;

			for(var user in this.memory) {
				for(var repo in this.memory[user].repositories) {
					counter += this.memory[user].repositories[repo].issues.length;
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
							console.log(data.memory[user].repositories[repo].issues[i])

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

			var stats = document.getElementById("main__stats")

			util.empty(stats)

			var i = 0;
			var count = data.count()

			var interval = setInterval(function() {
				if(i === count) {
					clearInterval(interval)
				}
				i++
				var counter = `<div id="statistics">Total amount of issues: ${i} </div>`
				stats.innerHTML = counter
			}, 13)

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
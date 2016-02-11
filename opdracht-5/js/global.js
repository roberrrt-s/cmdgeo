(function() {
	"use strict";

	var global = {
		init: function() {
			console.log("Initialize application");
			routes.init();
			search.init();
		}
	};

	var routes = {
		init: function() {
			console.log("Initialize routes");
			var self = this;
			window.addEventListener("hashchange", function(event) {
				self.toggle(window.location.hash);
			});
			self.toggle(window.location.hash);
		},

		toggle: function(route) {
			console.log("Toggling between the sections")

			if(worker.update) {
				worker.update.terminate();
				console.log("Terminated worker")
			}

			switch(route.substring(0, 12)) {
				case '':
					console.log("I am empty. redirecting...")
					window.location.hash = "#home";
					break;
				case "#home": 
					console.log("Home sweet home");
					route = "main__home"
					break;
				case "#query":
					console.log("I am an empty query!");
					route = "main__query"
					break;
				case "#query&user=":
					console.log("I am a query with a user!");
					var username = route.substring(12)
					data.request(username, 'GET', 'https://api.github.com/users/' + username +'?access_token=75442d9eb43dff41810ce1bc7b470b34c3805d80').then(function(e) {
						data.searched.push(e.target.response);
						search.show(e.target.response)
					}, function(e) {
						console.log(e)
					});
					route = "main__query";
					break;
				case '#list':
				console.log("I am a list!")
					search.history();
					route = "main__list"
					break;
				case '#issues':
				console.log("I have issues!")
					for (var i = 0; i < data.repos.length; i++) {
						data.request(data.repos[i], 'GET', 'https://api.github.com/users/' + data.repos[i] + '/repos?access_token=75442d9eb43dff41810ce1bc7b470b34c3805d80').then(function(e) {
							var parsed = util.parse(e.target.response);
							for(var j = 0; j < parsed.length; j++) {
								data.issues.push(parsed[j]);
								issues.result();
							}

						}, function(e) {
							console.log(e)
						});
					}

					worker.init()

					route = "main__issues"
					break;
				default: 
					window.location.hash = "#home";
			}

			var a = document.querySelectorAll('body > section:not([role="nav"])');

			for(var i = 0; i < a.length; i++) {
				if(a[i].id === route) {
					a[i].classList.remove("do-not-display-this");

				} else {
					a[i].classList.add("do-not-display-this");
				}
			}
		},
	};

	var data = {
		request: function(username, method, url) {
			return new Promise(function (resolve, reject) {
				var xhr = new XMLHttpRequest();
				xhr.open(method, url, true);
				xhr.onload = resolve;
				xhr.onerror = reject;
				xhr.send();
			});
		},

		searched: [],
		issues: [],
		issueAmount: 0,
		stack: 0,
		repos: ["beemstb002", "kasszz", "dennis-van-bennekom", "dvens", "EmielZuurbier", "strexx", "heleensnoeck", "jaimiederijk", "jarnovnico", "JesperHonders", "onwezen", "LeanderVanBaekel", "linda2912", "sayLISA", "Wasknijper", "MartijnNieuwenhuizen", "matth96", "melvinr", "RaymondKorrel", "rianneschouwstra", "roberrrt-s", "reauv", "roosness", "rovervannispen", "sembakkum", "sennykalidien", "tijsluitse", "tomsnep", "Wesleyvd"]
	};

	var search = {
		init: function(username) {
			var submit = document.getElementById("post-submit");
			submit.addEventListener("click", function(event) {
				event.preventDefault()

				var username = document.getElementById("post-gitname").value

				if(username) {
					window.location.hash = "query&user=" + username;
					data.request(username, 'GET', 'https://api.github.com/users/' + username + '?access_token=75442d9eb43dff41810ce1bc7b470b34c3805d80')
				}

			});
		},

		show: function(data) {
			var info = util.parse(data)

			if(info.login) {
				var result = document.getElementById("result").innerHTML = '<img class="avatar-image" alt="avatar" src="' + info.avatar_url + '"<p> Naam: ' + info.name + '</p> '
			}
			else {
				this.searched.pop();
				var result = document.getElementById("result").innerHTML = 'User does not exist'
			}
		},

		history: function() {
			var listed = document.getElementById("search-container")
			util.empty(listed)
			for (var i = 0; i < data.searched.length; i++) {
				
				var parsed = util.parse(data.searched[i])

				var li = document.createElement("li");
				var content = document.createTextNode(parsed.login)

				li.appendChild(content)
				listed.appendChild(li)
			}
		}
	};

	var issues = {
		result: function() {
			var listed = document.getElementById("issue-container")

			data.issueAmount = 0;

			util.empty(listed)

			for (var i = 0; i < data.issues.length; i++) {
				
				var tr = document.createElement("tr");
				var name = document.createElement("th");
				var owner = document.createElement("th");
				var open = document.createElement("th");
				var nameContainer = document.createElement("td")
				var ownerContainer = document.createElement("td")
				var openContainer = document.createElement("td")
				var nameText = document.createTextNode('REPOSITORY:');
				var ownerText = document.createTextNode('EIGENAAR:');
				var openText = document.createTextNode('OPEN ISSUES:');
				var nameData = document.createTextNode(data.issues[i].name);
				var ownerData = document.createTextNode(data.issues[i].owner.login);
				var openData = document.createTextNode(data.issues[i].open_issues);

				if(data.issues[i].open_issues > 0) {
					openContainer.classList.add("has-issues")
					data.issueAmount += data.issues[i].open_issues;
				}

				listed.appendChild(tr)
				tr.appendChild(name)
				tr.appendChild(nameContainer)
				name.appendChild(nameText)
				nameContainer.appendChild(nameData)
				tr.appendChild(owner)
				tr.appendChild(ownerContainer)
				owner.appendChild(ownerText)
				ownerContainer.appendChild(ownerData)
				tr.appendChild(open)
				tr.appendChild(openContainer)
				open.appendChild(openText)
				openContainer.appendChild(openData)

			}

			var total = document.getElementById("total-issues").innerHTML = "The total amount of issue's in these repos is: " + data.issueAmount;

		}
	};

	var worker = {
		init: function() {
			this.update = new Worker("js/update.js");
			this.events()
		},

		detect: function(callback) {

			data.issues = [];

			for (var i = 0; i < callback.length; i++) {
				for(var j = 0; j < callback[i].length; j++) {
					data.issues.push(callback[i][j]);
					issues.result();
				}
			}
		},

		events: function() {

			var self = this;

			this.update.onmessage = function(e) {

				data.stack = 0;
				var response = e.data

				for(var i = 0; i < response.length; i++) {
					for(var j = 0; j < response[i].length; j++) {
						data.stack += response[i][j].open_issues
					}
				}

				if(data.issueAmount < data.stack) {
					self.detect(response)
					console.log("we have a new issue! :(")

				}
				else if(data.issueAmount > data.stack) {
					self.detect(response)
					console.log("someone closed an issue! :)")
				}
				else {
					console.log("nothing happened.")
				}

			}

			this.update.onerror = function(e) {
				console.log(e.message);
			}
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
			}
		}
	};

	global.init();

}());
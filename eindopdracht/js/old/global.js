(function() {
	"use strict";

	var global = {
		init: function() {
			routes.init();
			search.init();
		}
	};

	var routes = {
		init: function() {
			var self = this;
			window.addEventListener("hashchange", function(event) {
				self.toggle(window.location.hash);
			});
			self.toggle(window.location.hash);
		},

		toggle: function(route) {
			if(worker.update) {
				worker.update.terminate();
			}

			switch(route.substring(0, 12)) {
				case '':
					window.location.hash = "#home";
					break;
				case "#home": 
					route = "main__home"
					break;
				case "#query":
					route = "main__query"
					break;
				case "#query&user=":
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
					search.history();
					route = "main__list"
					break;
				case '#issues':
					if(localStorage.getItem("issuedata")) {
						data.issues = util.parse(localStorage.getItem('issuedata'));
						issues.result();
					}
					else {
						var total = [];

						for (var i = 0; i < data.repos.length; i++) {
							var promised = data.request(data.repos[i], 'GET', 'https://api.github.com/users/' + data.repos[i] + '/repos?access_token=75442d9eb43dff41810ce1bc7b470b34c3805d80').then(function(e) {
								var parsed = util.parse(e.target.response);
								for(var j = 0; j < parsed.length; j++) {
									data.issues.push(parsed[j]);
									
								}

							total.push(promised)

							Promise.all(total).then(function() {
								issues.result();
								localStorage.setItem('issuedata', util.stringify(data.issues));
							})


							}, function(e) {
								console.log(e)
							})
						}
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

			var result = document.getElementById("result")

			if(info.login) {
				result.innerHTML = '<img class="avatar-image" alt="avatar" src="' + info.avatar_url + '"<p> Naam: ' + info.name + '</p> '
			}
			else {
				this.searched.pop();
				result.innerHTML = 'User does not exist'
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
				
				var tr = document.createElement("tr");
				var name = document.createElement("th");
				var owner = document.createElement("th");
				var open = document.createElement("th");
				var nameText = document.createTextNode('REPOSITORY:');
				var ownerText = document.createTextNode('OWNER:');
				var openText = document.createTextNode('OPEN ISSUES:');

				listed.appendChild(tr)
				tr.appendChild(name)
				tr.appendChild(owner)
				tr.appendChild(open)
				name.appendChild(nameText)
				owner.appendChild(ownerText)
				open.appendChild(openText)

			for (var i = 0; i < data.issues.length; i++) {

				util.createRow(data.issues[i])

				var tr = document.createElement("tr");

				var nameContainer = document.createElement("td")
				var ownerContainer = document.createElement("td")
				var openContainer = document.createElement("td")

				var nameData = document.createTextNode(data.issues[i].name);
				var ownerData = document.createTextNode(data.issues[i].owner.login);
				var openData = document.createTextNode(data.issues[i].open_issues);

				if(data.issues[i].open_issues > 0) {
					openContainer.classList.add("has-issues")
					data.issueAmount += data.issues[i].open_issues;
				}

				listed.appendChild(tr)
				tr.appendChild(nameContainer)
				nameContainer.appendChild(nameData)
				tr.appendChild(ownerContainer)
				ownerContainer.appendChild(ownerData)
				tr.appendChild(openContainer)
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

			localStorage.setItem('issuedata', util.stringify(data.issues));

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
				if(data.issueAmount !== data.stack) {
					self.detect(response)

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
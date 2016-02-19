(function() {
	"use strict";

	var global = {
		init: function() {
			worker.init()
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
					route = "main_tracker";
					break;
				default: 
					window.location.hash = "#home";
			}

			[].forEach.call(document.querySelectorAll('body > section:not([role="nav"])'), function(value) {
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

			this.update = new Worker("js/update2.js");
			this.events()

		},

		events: function() {

			var self = this;

			this.update.onmessage = function(e) {

				e.data.forEach(function(newItem) {

					data.process(newItem)

					data.compare(newItem, e)

				})

//			data.display()

			}

			this.update.onerror = function(e) {
				console.log(e.message);
			}

		},

	};

	var data = {

		process: function(newItem) {

			if(!newItem.id) {
				return false;
			}

			var update = true;

//			console.log("Received a new item: " + newItem.id + " the owner of this issue is " + newItem.owner.login)
			data.issues.forEach(function(oldItem) {
//				console.log("Checking if this item matches any ID we previously recorded: " + oldItem.id)

				if(oldItem.id == newItem.id) {
//					console.log("MATCH FOUND! - Issue already exist in database")
					update = false;
				}
				else {
//					console.log("No match here, continuing...");
				}

			})

			if(update) {
//				console.log("It seems we found no matches, adding value to the database...")
				data.issues.push(newItem)
				data.sort(data.issues)
//				console.table(data.issues)
				data.update()
			}

			else {
//				console.log("Do nothing, we already have this value in the database")
			}
		},

		compare: function(newItem, e) {

			if(!("id" in newItem)) {
				console.log("doesnt exist (anymore)")
			}

			var update = true;

			data.memory.forEach(function(oldItem, index, object) {
//				console.log("Checking if this item has a match in the memory records")
				if(oldItem.repo === newItem.repository_url) {
//					console.log("MATCH FOUND - Repository already exist in database")
					update = false;
					if(oldItem.amount === e.data.length) {
//						console.log("Same amount, so no changes here")
					}
					else if(oldItem.amount < e.data.length) {
						console.log("Oh no, this repository has more issues now. Removing the old data..")
						data.remove(data.memory, index, 1)
						data.update()


						data.issues.forEach(function(newItem, index, object) {
							if(newItem.repository_url === oldItem.repo) {
								data.remove(data.issues, index, 1)
								data.update()
							}
						})
					}
					else if(oldItem.amount > e.data.length) {
						console.log("Yay, amount of issues has decreased, removing the old data")
						data.remove(data.memory, index, 1)
						data.update()

						data.issues.forEach(function(newItem, index, object) {
							if(newItem.repository_url === oldItem.repo) {
								data.remove(data.issues, index, 1)
								data.update()
							}
						})
					}
				}
				else {
//					console.log("No match here neither")
				}
			})

			if(update) {
//				console.log("It seems we found no matches, adding value to the database...")
				data.memory.push({repo: newItem.repository_url, amount: e.data.length})
//				console.log(data.memory)
			}
			else {
//				console.log("Do nothing, we already have this value in the database")
			}
//			console.log(data.memory)

		},

		remove: function(arr, index, amount) {
			arr.splice(index, amount)
		},

		update: function() {
			this.element.innerHTML = "total issues: " + this.issues.length
		},

		display: function() {
			for(var i = 0; i < this.issues.length; i++) {
//				console.log(this.issues[i].id)

				if(document.getElementById(this.issues[i].id)) {
//					console.log("already exists")
				}
				else {

					var div = document.createElement("div");
					var hr = document.createElement("hr");
					var br = document.createElement("br");
					div.id = this.issues[i].id
					div.classList.add("node")
					container.appendChild(div)
					var title = document.createTextNode("TITLE: " + this.issues[i].title)
					var owner = document.createTextNode("REPOSITORY OWNER: " + this.issues[i].owner.login)
					var body = document.createTextNode(this.issues[i].body)
					div.appendChild(title)
					div.appendChild(br)
					div.appendChild(owner)
					div.appendChild(hr)
					div.appendChild(body)

				}

			}
		},

		sort: function(arr) {
			arr.sort(function (a, b) {
				if (a.id > b.id) {
					return 1;
				}
				if (a.id < b.id) {
					return -1;
				}
				return 0;
			});		
		},

		element: document.getElementById("issue-amount"),
		container: document.getElementById("container"),
		issues: [],
		memory: []

	};

	var local = {
		insert: function(name, data) {
			localStorage.setItem(name, util.stringify(data));
		},
		retrieve: function(name) {
			return util.parse(localStorage.getItem(name));
		}
	}

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
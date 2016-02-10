// IIFE to avoid global variables
(function() {
<<<<<<< HEAD
	// Strict mode at the top of this function to enable this for the entire document
	"use strict";

	// Declaring the application object
	var global = {
		init: function() {
			// Initializing application by calling the routes object.
			console.log("Initialize application");
			data.init();
			worker.init()
			routes.init();
		}
	};

	var data = {
		init: function(username) {
			var submit = document.getElementById("post-submit");
			submit.addEventListener("click", function(event) {
				event.preventDefault()

				var username = document.getElementById("post-gitname").value
				if(username) {
					window.location.hash = "query&user=" + username;
					data.request(username, 'GET', 'https://api.github.com/users/' + username)
				}
			});
		},

		request: function(username, method, url) {
			return new Promise(function (resolve, reject) {
				var xhr = new XMLHttpRequest();
				xhr.open(method, url, true);
				xhr.onload = resolve;
				xhr.onerror = reject;
				xhr.send();
			});
		},

		parse: function(data) {
			return JSON.parse(data);
		},

		display: function(data) {
			var info = this.parse(data)
			var result = document.getElementById("result").innerHTML = '<img class="avatar-image" alt="avatar" src="' + info.avatar_url + '"<p> Naam: ' + info.name + '</p> '
		},

		store: []
	};

	var list = {
		generate: function() {

			var listed = document.getElementById("list-container")

			while(listed.firstChild) {
				listed.removeChild(listed.firstChild);
			}

			for (var i = 0; i < data.store.length; i++) {
				var parsed = data.parse(data.store[i])


				var li = document.createElement("li");
				var content = document.createTextNode(parsed.name)

				li.appendChild(content)
				listed.appendChild(li)
			}
		}
	};

	// Declaring the routes object
	var routes = {
		init: function() {
			console.log("Initialize routes");

			// Adding an event listener to the window, which triggers when the hash (#) changes.
			// it invokes an anonymous function that passes to the sections object to toggle between the elements, using the window's hash as a parameter
			window.addEventListener("hashchange", function(event) {
				// The original URL's in the navigation contain an !, this to preventDefault() the scrolling, when not using jquery.
				sections.toggle(window.location.hash);
			});

			// We have to check if the user comes from a place that already included a hash, removing the ! again
			sections.toggle(window.location.hash);
		},
	};

	var worker = {

		init: function() {
			this.update = new Worker("js/update.js");
			this.events()
		},

		events: function() {
			this.update.onmessage = function(e) {
				console.log('worker test', e.data);
			}
			this.update.onerror = function(e) {
				console.log(e);
			}
		},
	};

	// Declaring the sections object
	var sections = {
		toggle: function(route) {
			console.log("Toggling between the sections")

			var result = document.getElementById("result");

			while(result.firstChild) {
				result.removeChild(result.firstChild);
			}

			// If route is null, route is #main__home
			if(!route) {
				var route = '#home';
			}

			if(route.indexOf("#query&user=") === 0) {
				var username = route.substring(12)
				
				data.request(username, 'GET', 'https://api.github.com/users/' + username).then(function(e) {
					data.store.push(e.target.response);
					data.display(e.target.response)
				}, function(e) {
					console.log(e)
				});

			}

			if(route.indexOf("#query") === 0) {
				console.log(route)
				route = route.substring(0, 6);
				console.log(route)
			}

			if(route.indexOf("#list") === 0) {
				list.generate()
			}

			// adding the BEM structure
			route = "main__" + route.substr(1);

			// Grabbing all sections in a variable
			var a = document.querySelectorAll("body > section");

			for(var i = 0; i < a.length; i++) {
				// Removing the navigation from the toggle
				if(a[i].id !== "main__nav") {

					// Checking if the id of the section corresponds with the route parameter
					if(a[i].id === route) {
						a[i].classList.remove("do-not-display-this");

					} else {
						a[i].classList.add("do-not-display-this");
					}
				}
			}
		}
	}

	global.init();

}());
=======
    // Strict mode at the top of this function to enable this for the entire document
    "use strict";

    // Declaring the application object
    var global = {
        init: function() {
            // Initializing application by calling the routes object.
            console.log("Initialize application");
            routes.init();
        }
    };

    // Declaring the routes object
    var routes = {
        init: function() {
            console.log("Initialize routes");

            // Adding an event listener to the window, which triggers when the hash (#) changes.
            // it invokes an anonymous function that passes to the sections object to toggle between the elements, using the window's hash as a parameter
            window.addEventListener("hashchange", function(event) {
                // The original URL's in the navigation contain an !, this to preventDefault() the scrolling, when not using jquery.
                sections.toggle(window.location.hash);
            });

            // We have to check if the user comes from a place that already included a hash, removing the ! again
            sections.toggle(window.location.hash);
            this.createNav();
        },

        // Generating a navigation structure, based upon
        createNav: function() {
            console.log("Creating the navigation based on the sections");

            // Variable a is an array that contains all pages on the website (as defined as sections)
            // Variable b is the navigation container
            var a = document.querySelectorAll("body > section");
            var b = document.getElementById("nav__container");

            // Looping through all sections, and creating navigation elements based upon them
            for (var i = 0; i < a.length; i++) {
                if(a[i].id !== "main__nav") {
                    var c = document.createElement('li');
                    c.appendChild(document.createTextNode(a[i].id.substr(6)));
                    b.appendChild(c);

                    // Adding a click to each section.
                    c.addEventListener("click", function() {
                        window.location.hash = "#main__" + this.innerHTML
                    });
                }
            }
        }
    }

    // Declaring the sections object
    var sections = {
        toggle: function(route) {
            console.log("Toggling between the sections")

            // If route is null, route is #main__start
            if(!route) {
                var route = '#main__start';
            }

            // Grabbing all sections in a variable
            var a = document.querySelectorAll("body > section");

            // Looping through all routes, while skipping the first one, the navigation by starting i at 1
            for (var i = 0; i < a.length; i++) {

                // Removing the navigation from the toggle
                if(a[i].id !== "main__nav") {

                    // Checking if the id of the section corresponds with the route parameter
                    if(a[i].id === route.substr(1)) {
                        a[i].classList.remove("do-not-display-this");
                    } else {
                        a[i].classList.add("do-not-display-this");
                    }
                }
            }
        }
    }

    global.init();

}());
>>>>>>> gh-pages

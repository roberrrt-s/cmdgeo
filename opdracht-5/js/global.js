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
                        a[i].style.display = "";
                    } else {
                        a[i].style.display = "none";
                    }
                }
            }
        }
    }

    global.init();

}());

(function() {
    "use strict"

    // Variable declaration
    var sandbox = "sandbox";
    var linear = "linear";
    var gpsAvailable = 'gpsAvailable';
    var gpsUnavailable = 'gpsUnavailable';
    var positionUpdated = 'positionUpdated';
    var refreshRate = 1000;
    var currentPosition = false;
    var currentPositionMarker = false;
    var customDebugging = false;
    var debugId = false;
    var map = false;
    var interval = false;
    var intervalCounter = false;
    var updateMap = false;
    var locatieRij, markerRij = [];

    function EventTarget() {
        this.listeners = {}
    }

    EventTarget.prototype = {
        constructor: EventTarget,
        addListener: function(a, c) {
            "undefined" == typeof this.listeners[a] && (this.listeners[a] = []);
            this.listeners[a].push(c)
        },

        fire: function(a) {
            "string" == typeof a && (a = {
                type: a
            });
            a.target || (a.target = this);
            if (!a.type)
                throw Error("Event object missing 'type' property.");
            if (this.listeners[a.type] instanceof Array)
                for (var c = this.listeners[a.type], b = 0, d = c.length; b < d; b++)
                    c[b].call(this, a)
        },

        removeListener: function(a, c) {
            if (this.listeners[a] instanceof Array)
                for (var b = this.listeners[a],
                        d = 0, e = b.length; d < e; d++)
                    if (b[d] === c) {
                        b.splice(d, 1);
                        break
                    }
        }
    };

    var et = new EventTarget();

    var geo =  {

    // Test of GPS beschikbaar is (via geo.js) en vuur een event af
        init: function() {
            debug.message("Controleer of GPS beschikbaar is...");

            et.addListener(gpsAvailable, this.startInterval);
            et.addListener(gpsUnavailable, function() {
                debug.message('GPS is niet beschikbaar.')
            });

            (geoPositionJs.init()) ? et.fire(gpsAvailable): et.fire(gpsUnavailable);
        },

        // Start een interval welke op basis van refreshRate de positie updated
        startInterval: function(event) {
            debug.message("GPS is beschikbaar, vraag positie.");
            this.updatePosition();
            interval = self.setInterval(this.updatePosition, refreshRate);
            et.addListener(positionUpdated, this.checkLocations);
        },

        // Vraag de huidige positie aan this.js, stel een callback in voor het resultaat
        updateCurrentPosition: function() {
            intervalCounter++;
            geoPositionJs.getCurrentPosition(this.setPosition, debug.errorHandler, {
                enableHighAccuracy: true
            });
        },

        // Update de positie van de gebruiker op de kaart
        updatePosition: function(event) {
            // use currentPosition to center the map
            var newPos = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
            map.setCenter(newPos);
            currentPositionMarker.this.setPosition(newPos);
        },

        // Callback functie voor het instellen van de huidige positie, vuurt een event af
        setPosition: function(position) {
            currentPosition = position;
            et.fire("positionUpdated");
            debug.message(intervalCounter + " positie lat:" + position.coords.latitude + " long:" + position.coords.longitude);
        },

        // Controleer de locaties en verwijs naar een andere pagina als we op een locatie zijn
        checkLocations: function(event) {
            // Liefst buiten google maps om... maar helaas, ze hebben alle coole functies
            for (var i = 0; i < locaties.length; i++) {
                var locatie = {
                    coords: {
                        latitude: locaties[i][3],
                        longitude: locaties[i][4]
                    }
                };

                if (this.calculateDistance(locatie, currentPosition) < locaties[i][2]) {

                    // Controle of we NU op die locatie zijn, zo niet gaan we naar de betreffende page
                    if (window.location != locaties[i][1] && localStorage[locaties[i][0]] == "false") {
                        // Probeer local storage, als die bestaat incrementeer de locatie
                        try {
                            (localStorage[locaties[i][0]] == "false") ? localStorage[locaties[i][0]] = 1: localStorage[locaties[i][0]]++;
                        } catch (error) {
                            debug.message("Localstorage kan niet aangesproken worden: " + error);
                        }

                        // TODO: Animeer de betreffende marker

                        window.location = locaties[i][1];
                        debug.message("Speler is binnen een straal van " + locaties[i][2] + " meter van " + locaties[i][0]);
                    }
                }
            }
        },

        // Bereken het verchil in meters tussen twee punten
        calculateDistance: function(p1, p2) {
            var pos1 = new google.maps.LatLng(p1.coords.latitude, p1.coords.longitude);
            var pos2 = new google.maps.LatLng(p2.coords.latitude, p2.coords.longitude);
            return Math.round(google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2), 0);
        },


        generateMap: function(myOptions, canvasId) {
            // TODO: Kan ik hier asynchroon nog de google maps api aanroepen? dit scheelt calls
            debug.message("Genereer een Google Maps kaart en toon deze in #" + canvasId)
            map = new google.maps.Map(document.getElementById(canvasId), myOptions);

            var routeList = [];
            // Voeg de markers toe aan de map afhankelijk van het tourtype
            debug.message("Locaties intekenen, tourtype is: " + tourType);
            for (var i = 0; i < locaties.length; i++) {

                // Met kudos aan Tomas Harkema, probeer local storage, als het bestaat, voeg de locaties toe
                try {
                    (localStorage.visited == undefined || util.isNumber(localStorage.visited)) ? localStorage[locaties[i][0]] = false: null;
                } catch (error) {
                    debug.message("Localstorage kan niet aangesproken worden: " + error);
                }

                var markerLatLng = new google.maps.LatLng(locaties[i][3], locaties[i][4]);
                routeList.push(markerLatLng);

                markerRij[i] = {};
                for (var attr in locatieMarker) {
                    markerRij[i][attr] = locatieMarker[attr];
                }
                markerRij[i].scale = locaties[i][2] / 3;

                var marker = new google.maps.Marker({
                    position: markerLatLng,
                    map: map,
                    icon: markerRij[i],
                    title: locaties[i][0]
                });
            }
            // TODO: Kleur aanpassen op het huidige punt van de tour
            if (tourType == linear) {
                // Trek lijnen tussen de punten
                debug.message("Route intekenen");
                var route = new google.maps.Polyline({
                    clickable: false,
                    map: map,
                    path: routeList,
                    strokeColor: 'Black',
                    strokeOpacity: .6,
                    strokeWeight: 3
                });

            }

            // Voeg de locatie van de persoon door
            currentPositionMarker = new google.maps.Marker({
                position: kaartOpties.center,
                map: map,
                icon: positieMarker,
                title: 'U bevindt zich hier'
            });

            // Zorg dat de kaart geupdated wordt als het positionUpdated event afgevuurd wordt
            et.addListener(positionUpdated, this.updatePosition);
        }
    };

        // FUNCTIES VOOR DEBUGGING

    var debug = {
        errorHandler: function(code, message) {
            debug.message('this.js error ' + code + ': ' + message);
        },

        message: function(message) {
            (customDebugging && debugId) ? document.getElementById(debugId).innerHTML: console.log(message);
        },

        setCustomDebugging: function(debugId) {
            debugId = this.debugId;
            customDebugging = true;
        }
    }

        // FUNCTIES VOOR UTILITY

    var util = {
        isNumber: function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
    }
}());

// CMDA Github Dashboard
// Author: Robert Spier

// Main variables
// var users = ["beemstb002", "kasszz", "dennis-van-bennekom", "dvens", "EmielZuurbier", "strexx", "heleensnoeck", "jaimiederijk", "jarnovnico", "JesperHonders", "onwezen", "LeanderVanBaekel", "linda2912", "sayLISA", "Wasknijper", "MartijnNieuwenhuizen", "melvinr", "RaymondKorrel", "rianneschouwstra", "roberrrt-s", "reauv", "roosness", "rovervannispen", "sembakkum", "sennykalidien", "tijsluitse", "tomsnep", "Wesleyvd"];

var users = ["beemstb002", "kasszz", "dennis-van-bennekom", "dvens", "EmielZuurbier", "strexx", "heleensnoeck", "jaimiederijk", "jarnovnico", "JesperHonders", "onwezen", "LeanderVanBaekel", "linda2912", "sayLISA", "Wasknijper", "MartijnNieuwenhuizen", "melvinr", "RaymondKorrel", "rianneschouwstra", "roberrrt-s", "reauv", "roosness", "rovervannispen", "sembakkum", "sennykalidien", "tijsluitse", "tomsnep", "Wesleyvd"];
var token = "?access_token=75442d9eb43dff41810ce1bc7b470b34c3805d80";
var delay = 60000;
var repos = []
var memory = {}

// Setting an interval to refresh the data queries
var refreshInterval = setInterval(function() {
	repos = [];
	memory = {};
	getRepos()
}, delay);

// Start the loop while entering the application
getRepos()

// This took me a long amount of hours
function getRepos() {
"use strict"

	// Map all the promises that contain a xhr for every user
	var requests = users.map((item) => {
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'https://api.github.com/users/' + item + '/repos' + token, true);
			xhr.onload = resolve;
			xhr.onerror = reject;
			xhr.send();
		});
	})

	// When all the users are back, process this data
	Promise.all(requests).then(function(e) {

		// Parse the data, and place it in the repository array
		for(var i = 0; i < e.length; i++) {
			repos.push(JSON.parse(e[i].target.response))
		}

			// For each repository, create the main object
			e.forEach(function(item) {
				var data = JSON.parse(item.target.response);

				memory[data[0].owner.login] = {
					owner: data[0].owner,
					repositories: {}
				}

				data.forEach(function(item) { 
					memory[item.owner.login].repositories[item.name] = {}
					memory[item.owner.login].repositories[item.name].issues = []
				})

			})

		// Call the issue function
		getIssues()

	})
}

// Get all issues of all repository
function getIssues() {
"use strict"

	// Map all the repositories individually
	repos.map((a) => {

		// Also, map through all issues of the repository, and create a Promise w/ xhr for it.
		var requests = a.map((item, index, array) => {
			return new Promise(function(resolve, reject) {
				var xhr = new XMLHttpRequest();
				xhr.open('GET', item.issues_url.replace('{/number}', '') + token, true);
				xhr.onload = resolve;
				xhr.onerror = reject;
				xhr.send();
			});	

		})

		// When a series of issues is returned, split the responseURL to find out where the information came from.
		Promise.all(requests).then(function(e) {

			e.forEach(function(item, index, array) {
				var data = JSON.parse(item.target.response);
				var origin = item.target.responseURL.replace('https://api.github.com/repos/', '').replace('/issues?access_token=75442d9eb43dff41810ce1bc7b470b34c3805d80','');
				var location = origin.split('/');
				memory[location[0]].repositories[location[1]].issues = data;
			})

			// Give the name repository's owner to check with the array's.
			postData(e[e.length - 1].target.responseURL.replace('https://api.github.com/repos/', '').replace('/issues?access_token=75442d9eb43dff41810ce1bc7b470b34c3805d80','').split('/')[0])

		})
	})
}

function postData(currentUser) {
	// If matched, post the data to the application
	if(users[users.length -1] === currentUser) {
		postMessage(memory)
	}
}

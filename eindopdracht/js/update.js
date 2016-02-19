var users = ["beemstb002", "kasszz", "dennis-van-bennekom", "dvens", "EmielZuurbier", "strexx", "heleensnoeck", "jaimiederijk", "jarnovnico", "JesperHonders", "onwezen", "LeanderVanBaekel", "linda2912", "sayLISA", "Wasknijper", "MartijnNieuwenhuizen", "matth96", "melvinr", "RaymondKorrel", "rianneschouwstra", "roberrrt-s", "reauv", "roosness", "rovervannispen", "sembakkum", "sennykalidien", "tijsluitse", "tomsnep", "Wesleyvd"];
var token = "?access_token=75442d9eb43dff41810ce1bc7b470b34c3805d80";
var delay = 10000;
var repos = []
var memory = {}

var refreshInterval = setInterval(function() {
	repos = [];
	memory = {};
	getRepos()
}, delay);

getRepos()

function getRepos() {
"use strict"
	var requests = users.map((item) => {
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'https://api.github.com/users/' + item + '/repos' + token, true);
			xhr.onload = resolve;
			xhr.onerror = reject;
			xhr.send();
		});
	})

	Promise.all(requests).then(function(e) {

		for(var i = 0; i < e.length; i++) {
			repos.push(JSON.parse(e[i].target.response))
		}

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

		getIssues()

	})
}

function getIssues() {
"use strict"
	repos.map((a) => {
		var requests = a.map((item, index, array) => {
			return new Promise(function(resolve, reject) {
				var xhr = new XMLHttpRequest();
				xhr.open('GET', item.issues_url.replace('{/number}', '') + token, true);
				xhr.onload = resolve;
				xhr.onerror = reject;
				xhr.send();
			});	

		})

		Promise.all(requests).then(function(e) {

			e.forEach(function(item, index, array) {
				var data = JSON.parse(item.target.response);
				var origin = item.target.responseURL.replace('https://api.github.com/repos/', '').replace('/issues?access_token=75442d9eb43dff41810ce1bc7b470b34c3805d80','');
				var location = origin.split('/');
				memory[location[0]].repositories[location[1]].issues = data;
			})

			postData(e[e.length - 1].target.responseURL.replace('https://api.github.com/repos/', '').replace('/issues?access_token=75442d9eb43dff41810ce1bc7b470b34c3805d80','').split('/')[0])

		})
	})
}

function postData(currentUser) {
	if(users[users.length -1] === currentUser) {
		postMessage(memory)
	}
}

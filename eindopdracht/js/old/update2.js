var repos = ["roberrrt-s"];
var token = "?access_token=75442d9eb43dff41810ce1bc7b470b34c3805d80";
var delay = 10000;

var request = function(method, url) {

	return new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url, true);
		xhr.onload = resolve;
		xhr.onerror = reject;
		xhr.send();
	});

}

var isPullRequest = function(element, index, array) {
	return (!element.pull_request);
}

var hasIssues = function(element, index, array) {
	return (element.open_issues >= 0);
}

var getUser = function(user) {
	request('GET', 'https://api.github.com/users/' + user + '/repos' + token).then(function(e) {

		var data = JSON.parse(e.target.response);
//		data = data.filter(hasIssues)

		data.forEach(function(item) {
			getIssues(item.issues_url, item.owner)
		})

	});
}

var getIssues = function(url, owner) {
	request('GET', url.replace('{/number}', '') + token).then(function(e) {

		var data = JSON.parse(e.target.response);

		// Githubs feedback is shitty

		if(data.length === 0) {
			data.push({repository_url: e.target.responseURL.replace('issues?access_token=75442d9eb43dff41810ce1bc7b470b34c3805d80', '')});
			return postMessage(data);
		}

		data.map(function(value) {
			value.owner = owner;
		})

		data = data.filter(isPullRequest)
		
		postMessage(data)
	});
}

var refresh = function() {
	for(var i = 0; i < repos.length; i++) {
		getUser(repos[i])
	}
}

refresh()

var refreshInterval = setInterval(function() {
	refresh();
}, delay)
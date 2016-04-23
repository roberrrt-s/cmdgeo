 
var template = (function(){

	// Create the tracker template
	var tracker = function() {

		// If there is data, continue, else, show the loading
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
						
						if(data.memory[user].repositories[repo].issues[i].pull_request) {
							div.classList.add('pull-request')
						}
						else {
							div.classList.add('issue')
						}
						
						// ES6 FTW!
						var string = `<h2>${data.memory[user].repositories[repo].issues[i].title}</h2> <h4>Posted by: ${data.memory[user].repositories[repo].issues[i].user.login} on ${login}'s repository</h4> <hr> <p>${data.memory[user].repositories[repo].issues[i].body}<br></p><p><a href="#details/${user}/${repo}/${i}">View details</a><a href="${data.memory[user].repositories[repo].issues[i].html_url}">View on github</a>`
						
						// Placing the string inside the created block for each issue.
						div.innerHTML = string;
					}
				}
			}
		}
	};

	// Create the statistics template
	var statistics = function() {

		// If there is data, continue, else, show the loading
		if(data.checkMemory()) {
			data.loading()
		}
		else {

			var stats = document.getElementById('main__stats')
			var allcontainer = document.getElementById("allcontainer")
			var pullcontainer = document.getElementById("pullcontainer")
			var issuecontainer = document.getElementById("issuecontainer")

			var i = 0, j = 0, k = 0;
			var all = data.count()

			var isPullRequest = function(element, index, array) {
				return (element.pull_request);
			}

			var isIssue = function(element, index, array) {
				return (!element.pull_request);
			}

			var pull = all.filter(isPullRequest);
			var issues = all.filter(isIssue);

			// Sorry Laurens, dit zouden functies moeten zijn...

			var intall = setInterval(function() {

				if(i === all.length) {
					clearInterval(intall)
				}

				var counter = `<div class="statistics">Total amount of problems: ${i} </div>`
				allcontainer.innerHTML = counter
				i++

			}, 15)

			var intpull = setInterval(function() {

				if(j === pull.length) {
					clearInterval(intpull)
				}

				var counter = `<div class="statistics">Total amount of pull requests: ${j} </div>`
				pullcontainer.innerHTML = counter
				j++

			}, 15)
			
			var intiss = setInterval(function() {

				if(k === issues.length) {
					clearInterval(intiss)
				}

				var counter = `<div class="statistics">Total amount of issues: ${k} </div>`
				issuecontainer.innerHTML = counter
				k++	
			}, 15)
		}
	};

	var detail = function(usr, rep, iss) {
		if(data.checkMemory()) {
			data.loading()
		}
		else {
			var container = document.getElementById('main__details')
			var short = data.memory[usr].repositories[rep].issues[iss]
			var string = `<h2>Issue information</h2><br> <b>assignee:</b> ${short.assignee} <br> <b>body:</b> ${short.body} <br> <b>closed_at:</b> ${short.closed_at} <br> <b>comments:</b> ${short.comments} <br> <b>comments_url:</b> ${short.comments_url} <br> <b>created_at:</b> ${short.created_at} <br> <b>events_url:</b> ${short.events_url} <br> <b>html_url:</b> ${short.html_url} <br> <b>id:</b> ${short.id} <br> <b>labels_url:</b> ${short.labels_url} <br> <b>locked:</b> ${short.locked} <br> <b>milestone:</b> ${short.milestone} <br> <b>number:</b> ${short.number} <br> <b>repository_url:</b> ${short.repository_url} <br> <b>state:</b> ${short.state} <br> <b>title:</b> ${short.title} <br> <b>updated_at:</b> ${short.updated_at} <br> <b>url:</b> ${short.url} <br><br> <h2>Issue poster information</h2><br> <b>user.avatar_url:</b> ${short.user.avatar_url} <br> <b>user.events_url:</b> ${short.user.events_url} <br> <b>user.followers_url:</b> ${short.user.followers_url} <br> <b>user.following_url:</b> ${short.user.following_url} <br> <b>user.gists_url:</b> ${short.user.gists_url} <br> <b>user.gravatar_id:</b> ${short.user.gravatar_id} <br> <b>user.html_url:</b> ${short.user.html_url} <br> <b>user.id:</b> ${short.user.id} <br> <b>user.login:</b> ${short.user.login} <br> <b>user.organizations_url:</b> ${short.user.organizations_url} <br> <b>user.received_events_url:</b> ${short.user.received_events_url} <br> <b>user.repos_url:</b> ${short.user.repos_url} <br> <b>user.site_admin:</b> ${short.user.site_admin} <br> <b>user.starred_url:</b> ${short.user.starred_url} <br> <b>user.subscriptions_url:</b> ${short.user.subscriptions_url} <br> <b>user.type:</b> ${short.user.type} <br> <b>user.url:</b> ${short.user.url} <br>  <br><h2>Repository owner information</h2><br><b>avatar_url:</b> ${data.memory[usr].owner.avatar_url} <br> <b>events_url:</b> ${data.memory[usr].owner.events_url} <br> <b>followers_url:</b> ${data.memory[usr].owner.followers_url} <br> <b>following_url:</b> ${data.memory[usr].owner.following_url} <br> <b>gists_url:</b> ${data.memory[usr].owner.gists_url} <br> <b>gravatar_id:</b> ${data.memory[usr].owner.gravatar_id} <br> <b>html_url:</b> ${data.memory[usr].owner.html_url} <br> <b>id:</b> ${data.memory[usr].owner.id} <br> <b>login:</b> ${data.memory[usr].owner.login} <br> <b>organizations_url:</b> ${data.memory[usr].owner.organizations_url} <br> <b>received_events_url:</b> ${data.memory[usr].owner.received_events_url} <br> <b>repos_url:</b> ${data.memory[usr].owner.repos_url} <br> <b>site_admin:</b> ${data.memory[usr].owner.site_admin} <br> <b>starred_url:</b> ${data.memory[usr].owner.starred_url} <br> <b>subscriptions_url:</b> ${data.memory[usr].owner.subscriptions_url} <br> <b>type:</b> ${data.memory[usr].owner.type} <br> <b>url:</b> ${data.memory[usr].owner.url} <br>  `

			container.innerHTML = string
		}
	};

	return {
		tracker: tracker,
		statistics: statistics,
		detail: detail
	};

}());
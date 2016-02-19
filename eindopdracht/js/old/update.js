var repos = ["beemstb002", "kasszz", "dennis-van-bennekom", "dvens", "EmielZuurbier", "strexx", "heleensnoeck", "jaimiederijk", "jarnovnico", "JesperHonders", "onwezen", "LeanderVanBaekel", "linda2912", "sayLISA", "Wasknijper", "MartijnNieuwenhuizen", "matth96", "melvinr", "RaymondKorrel", "rianneschouwstra", "roberrrt-s", "reauv", "roosness", "rovervannispen", "sembakkum", "sennykalidien", "tijsluitse", "tomsnep", "Wesleyvd"];
var saveData = []

var main = function() {

	for (var i = 0; i < repos.length; i++) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://api.github.com/users/' + repos[i] + '/repos?access_token=75442d9eb43dff41810ce1bc7b470b34c3805d80', false);
		xhr.onload = function() {
			saveData.push(JSON.parse(xhr.responseText))
		}
		xhr.onerror = function() {
			postMessage("broke");
		}	
		xhr.send();
	}

	postMessage(saveData);
	saveData = [];

}

do {
	main()
}
while(!repos)

var repeatRequest = setInterval(function(){
	main()
}, 30000)


# Web App from Scratch

Repository for the course "Web App from Scratch" for the minor "Everything Web" at the HvA

##Opdracht 2
### JavaScript libraries/frameworks voor en nadelen 

##### Voordelen:

jQuery is een veelzijdige, easy to use en foolproof manier van javascript schrijven. Het vereenvoudigt het schrijven van code voor de programmeur, en geeft deze een krachtige set aan functies om snel en eenvoudig DOM manipulaties door te voeren. De code schrijft korter, waardoor het global.js bestand (of script.js, hangt van de voorkeur af) dusdanig kleiner wordt. Dit vergemakkelijkt het opzoeken en aanpassen van kleine stukjes code. Verder hoeft er veel minder code geschreven te worden, als voorbeeld:

$("#test").click(function() { window.alert("Hello world!")})

Een geldig stuk jQuery code.

document.getElementById("test").addEventListener("click", function() { window.alert("hello") })

Een geldig stuk Javascript code.

De truc die jQuery toepast is om met behulp van het dollarteken ($) alles wat het selecteert om te zetten naar een jQuery object, hierdoor worden veel handelingen al bij voorbaat klaargemaakt om 

##### Nadelen:

Zoals ook boven al te zien is, is jQuery langzamer. Omdat het heel veel handelingen doet als je het dollar-teken invoked is het automatisch minder snel qua gebruik.

##Opdracht 3
### Single page web app voor en nadelen

##### Voordelen:

##### Nadelen:


## Credits:

 - http://lea.verou.me/2015/04/jquery-considered-harmful/
 - http://programmers.stackexchange.com/questions/166273/advantages-of-using-pure-javascript-over-jquery
 - http://youmightnotneedjquery.com/
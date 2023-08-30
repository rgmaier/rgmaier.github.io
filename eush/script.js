function calculate(end){
	var days, hours, minutes, seconds, string;
	var start = new Date();
	var duration = (end-start);
	
	if(end < start){
		document.querySelector('#seconds').textContent = 0;
		document.querySelector('#minutes').textContent = 0;
		document.querySelector('#hours').textContent = 0;
		document.querySelector('#days').textContent = 0;
	}
	else{
	  
		duration = Math.floor(duration/1000);
		document.querySelector('#seconds').textContent = duration % 60;
		document.querySelector('#sec_txt').textContent = (duration % 60 == 1) ? "Sekunde" : "Sekunden";

		duration = Math.floor(duration/60);
		document.querySelector('#minutes').textContent = duration % 60;
		document.querySelector('#min_txt').textContent = (duration % 60 == 1) ? "Minute" : "Minuten";

		duration = Math.floor(duration/60);
		hours = duration % 24;
		document.querySelector('#hours').textContent = duration % 24;
		document.querySelector('#hrs_txt').textContent = (duration % 24 == 1) ? "Stunde" : "Stunden";

		duration = Math.floor(duration/24);
		document.querySelector('#days').textContent = duration;
		document.querySelector('#day_txt').textContent = (duration == 1) ? "Tag" : "Tage";
	}
}

function time_remaining(end){
  setInterval(function(){calculate(end);},1000);
}

function bgupdate(initialStart, end){
	var current = new Date();
	var initialDuration = (end-initialStart);
	var currentDuration = (end-current);
	var iteration = initialDuration/24;
	var counter = Math.ceil((initialDuration-currentDuration)/iteration);
	if(current < initialStart){
		document.body.style.backgroundImage = "url('1.png')"; 
	}else if(current > end){
		document.body.style.backgroundImage = "url('25.png')"; 
	}
	else{
		document.body.style.backgroundImage = "url('"+(counter+1)+".png')"; 
	}
}

window.onload = function () {
	var end = new Date(2023, 7, 30, 22, 0, 0);
	var initialStart = new Date(2023,7,30,21,0);
	bgupdate(initialStart,end)
	setInterval(function(){bgupdate(initialStart,end);},10000);
    calculate(end);
    time_remaining(end);
};
var game;
window.addEventListener('DOMContentLoaded', function () {
    game = new Game();
	game.init();
	initMotionDetection();
	window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
	window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false); 
});


var fsm = StateMachine.create({
  initial: 'StartScreen',
  
  events: [
    { name: 'start', 	from: ['StartScreen','FinalScore'], to: 'Play'    },
    { name: 'finish', 	from: 'Play', to: 'FinalScore'  },
    { name: 'end', 		from: ['FinalScore', 'Play'], to: 'StartScreen'  }
  ],
  
  callbacks: {
	  
    onstart:  		function(event, from, to, msg) {
		stopMotionFlag = false;
		updateDetection();
		// Reset Game stats
		game.resetStats();
		// Reset all Targets
		game.resetTargets();
		// Change camera and enable movment by motion
		game.punchCam();
		// Show game panels like score
		panels.showGameStats();
		// Start Countdown and after that start timer
		timer.start();
		// Run game (maybe have a countdown here of 3 secs or sth)
		game.runGame();
    },  
    onfinish: 		function(event, from, to, msg) {
		stopMotionFlag = true;
		// Stop game
		game.stopGame(); 
		// Show Finish Screen
		panels.showFinishScreen();
    },
    
    onend:  		function(event, from, to, msg) {
		stopMotionFlag = true;
		// Show Start Screen
		panels.showStartScreen();
		// Change Camera
		game.menuCam();
		// Stop Timer!
		timer.end();
		// Stop game
		game.stopGame();
    }
  } 
});

 
//Manages the time interval setting and gives game.js access to the current value in the render loop
var timer = {
    //Interval Time in seconds
    interval : 50,   
	
    //Register a eventhandler when element is changing and set inital state of interval variable
    start : function(){
		timer.displayTimer(timer.interval);
		timer.timeout = setTimeout(function(){ 
			fsm.finish();
		}, timer.interval * 1000);
    },
	
    end : function(){
		clearTimeout(timer.timeout);
		clearInterval(timer.intervalFunc);
	},
	
	displayTimer: function(duration){
		var time = duration, minutes, seconds; 
		timer.intervalFunc = setInterval(function () {
			minutes = parseInt(time / 60, 10);
			seconds = parseInt(time % 60, 10);

			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			$("#stats_time div").html(minutes + ":" + seconds);

			if (--time < 0) {
				time = duration;
			}
		}, 1000);
	}
}


var panels = {
    showStartScreen: function(width){
        panels.hideAll();
		$("#start_screen").show();
    },
    hideStartScreen: function(killed, killer){
		$("#start_screen").hide();
    },
    showGameStats: function(name){ 
		panels.hideAll();
		$("#game_screen").show();
    },
    hideGameStats: function(name){	
		$("#game_screen").hide();
    },
    showFinishScreen: function(){
        panels.hideAll();
		$("#finish_screen").show();
		$("#score div").html($("#stats_punches div").html());
    },
    hideFinishScreen: function(){
		$("#finish_screen").hide();
    },
	hideAll : function(){
		panels.hideStartScreen();
		panels.hideGameStats();
		panels.hideFinishScreen();
	},
	updateScore: function(score){
		$("#stats_punches div").html(score);
	},
	updateTimer: function(){
		
	}
}  

//Other Event Handlers for 2D Buttons and so on ....
//===========================================================

$("#start_game").click(function(){
	fsm.start();
});

$("#restart").click(function(){
	fsm.start();
});

$("#end_game").click(function(){
	fsm.end();
});

//Toggle Controll => To keyboard
$("#chose_webcam").click(function(){
	$().toastmessage('showNoticeToast', 'WebCam Controll Active');
    $(this).hide();
    $("#chose_keyboard").show();
    game.webCam = false;
});

//Toggle Controll => To webcam
$("#chose_keyboard").click(function(){
	$().toastmessage('showNoticeToast', 'Keyboard Controll Active');
    $(this).hide();
    $("#chose_webcam").show();
	game.webCam = true;
	initMotionDetection();
});

//Toggle Debug => on
$("#debug_off").click(function(){
	$().toastmessage('showNoticeToast', 'Debug OFF');
    $(this).hide();
    $("#debug_on").show();
    debug = true;	// variable in motionDetection.js
	$("#canvas-source").show();
});

//Toggle Debug => off
$("#debug_on").click(function(){
	$().toastmessage('showNoticeToast', 'Debug ON');
    $(this).hide();
    $("#debug_off").show();
	debug = false;	// variable in motionDetction.js
	$("#canvas-source").hide();
});

//Sound => on
$("#volume_off").click(function(){
	$().toastmessage('showNoticeToast', 'Sound ON');
    $(this).hide();
    $("#volume_up").show();
    game.sounds.unMute();
});

//Sound => off
$("#volume_up").click(function(){
	$().toastmessage('showNoticeToast', 'Sound OFF');
    $(this).hide();
    $("#volume_off").show();
	game.sounds.mute();
});





















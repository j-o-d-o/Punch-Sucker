/**
 * Plays Music and Sounds. Plays a random sound every "Round" in the Game.
 * I am not a musician. I just looked up some chords and put them in chords array
 * It sounds allright, but it could ofc done much better by someone who actually knows music ; )
 */

//@game : object of the main game
var Sounds = function(game){
    this.game = game;

    this.volumeBase = 0.3;
    this.isMuted = false;
}

//Loading all Sounds needed for the game
Sounds.prototype.loadSounds = function(){
    this.sigh = new BABYLON.Sound("sound0", "assets/sounds/sigh.wav", this.game.scene, null, { volume: this.volumeBase});
    this.swing = new BABYLON.Sound("sound1", "assets/sounds/swing.wav", this.game.scene, null, { volume: this.volumeBase});
    this.hit = new BABYLON.Sound("sound2", "assets/sounds/punch.wav", this.game.scene, null, { volume: this.volumeBase});
 

    //Soundtrack from the TV-Show Mr. Robot which you should defently watch in case you havent!
    //this.mainMusic = new BABYLON.Sound("mrRobot", "assets/sounds/mr-robot-i-hate-socity.mp3", this.game.scene, null , {volume: this.volumeMusic, loop: true, autoplay: true });
}  

//Mute sound
Sounds.prototype.mute = function(){
    this.isMuted = true;
    //this.mainMusic.setVolume(0);
}

//Unmute sound
Sounds.prototype.unMute = function(){
    this.isMuted = false;
    //this.mainMusic.setVolume(this.volumeMusic);
}


Sounds.prototype.playHit = function(){
	if(!this.isMuted)
		this.hit.play();
}
Sounds.prototype.playSwing = function(){
	if(!this.isMuted)
		this.swing.play();
}
Sounds.prototype.playPunchBlocked = function(){
	if(!this.isMuted)
		this.sigh.play();
}
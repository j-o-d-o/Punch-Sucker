var Game = (function () {
	
    function Game() {
    }
	
    Game.prototype.init = function () {
		this.counter=0;
		this.gameRunning = false;
        var _this = this; 
		this.discArray = []; 
		this.hitTargets = [];
		this.webCam = true;
		this.punchBlocked = false;
		
        this.canvas = document.getElementById('renderCanvas');
        this.engine = new BABYLON.Engine(this.canvas, true);
		this.engine.displayLoadingUI(); //Will be disabled before render loop starts
        this.scene = new BABYLON.Scene(this.engine);
  
		this.scene.enablePhysics(new BABYLON.Vector3(0, -12, 0), new BABYLON.OimoJSPlugin());
		
        this.initCamera();
        this.initLight();
		
		// Create Box Ring, Floor, Podest ...
		this.env = new Environment(this.scene);
		this.env.init();
		
		// Create the Puncher Hands
		this.punchers = new Punchers(this.scene, this.camera);
		this.punchers.init();
		this.punchers.hide();
		
		this.sound = new Sounds(this);
		this.sound.loadSounds();
		
        this.registerEventListener();

        this.scene.registerBeforeRender(function () {
            _this.renderLoopLogic();
        });
        this.scene.executeWhenReady(function () {
			panels.showStartScreen();
			_this.engine.hideLoadingUI();
            _this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
        });
    };
	
    Game.prototype.initCamera = function () {
        this.camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 0,new BABYLON.Vector3(0,1.8,0), this.scene);

		this.camera.maxZ = 600;   
		this.camera.minZ = 1;
		
		this.scene.activeCamera = this.camera;
        this.camera.detachControl(this.canvas, false);
 
		this.camera.setPosition(new BABYLON.Vector3(20, 70, 90));
    };
	
	Game.prototype.menuCam = function(){
		this.camera.setPosition(new BABYLON.Vector3(20, 70, 90));
		this.punchers.hide();
	};
	
	Game.prototype.punchCam = function(){
		this.camera.setPosition(new BABYLON.Vector3(0, 5, -19));
		this.punchers.show();
	}
	
    Game.prototype.initLight = function () {
        this.light = new BABYLON.HemisphericLight('lightHs', new BABYLON.Vector3(0.2, 1, 0.2), this.scene);
        this.light.specular = new BABYLON.Color3(0.1, 0.1, 0.1);
        this.light.intensity = 0.7;
		var light0 = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(0, 150, 0), new BABYLON.Vector3(0, -1, 0), 0.7, 2, this.scene);
		light0.diffuse = new BABYLON.Color3(1, 1, 1);
		light0.specular = new BABYLON.Color3(0.3, 0.3, 0.3);
    };
	
    Game.prototype.registerEventListener = function () {
        var _this = this;
        window.addEventListener('resize', function () {
            _this.engine.resize();
        });
    };
    
	Game.prototype.initTargets = function () {
		//Just for cloning the other discs
		this.hitTargetMat = new BABYLON.StandardMaterial("discMatHit", this.scene);
		this.hitTargetMat.diffuseTexture = new BABYLON.Texture("assets/textures/targetHit.png", this.scene);
		var discMat = new BABYLON.StandardMaterial("discMat", this.scene);
		discMat.diffuseTexture = new BABYLON.Texture("assets/textures/target.png", this.scene);
		this.discMain = BABYLON.Mesh.CreateCylinder("post1", 0.5, 4, 4, 0, 6, this.scene, false, new BABYLON.Vector3(0,1,0));
		this.discMain.material = discMat;
		this.discMain.rotation.x = Math.PI/2;
		this.discMain.position.y = 2;
		this.discMain.isVisible = false;
		
		this.addNewDisc();
		this.addNewDisc();
			
    };
	
	Game.prototype.addNewDisc = function(){
		var newDisc = this.discMain.clone();
		newDisc.isVisible = true;  
		
		var unique = false;
		var counter = 0; // Just to stop endless loops
		while(!unique || counter < 30){
			var randAngle = Math.random() * (2*Math.PI); 
			
			newDisc.rotAngle = randAngle;
			var unique = true;
			for(var i = 0; i < this.discArray.length; i++){
				//At least Pi/10 gap between each disc
				if(this.discArray[i].rotAngle < (randAngle + Math.PI / 8) && this.discArray[i].rotAngle > (randAngle - Math.PI / 8)){
					unique = false;
					break;
				}
			}
			counter++;
		} 
		newDisc.rotation.y = (3/2) * Math.PI - randAngle;
		newDisc.position.x = Math.cos(randAngle) * 11;
		newDisc.position.z = Math.sin(randAngle) * 11;

		var discBody = newDisc.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0.001, friction: 0.2, restitution: 0.2 });
		
		newDisc.updatePhysicsBodyPosition();
		
		newDisc.gameState = 0;		// state 0: float, state 1: punch ... than removed from array anyway
		newDisc.physicsBody = discBody;
		
		newDisc.originalPos = new BABYLON.Vector3(Math.round( newDisc.position.x * 10 ) / 10 , Math.round( newDisc.position.y * 10 ) / 10, Math.round( newDisc.position.z * 10 ) / 10);
		
		
		this.discArray.push(newDisc);
	};
	
	Game.prototype.punchDisc = function(i, impulseCenter){
		var forceVector = this.camera.target.subtract(this.camera.position).normalize().scale(44);
		this.discArray[i].applyImpulse(forceVector, impulseCenter); 
		this.removeTarget(i);
		this.addScore();
		
		var _this = this;
		setTimeout(function(){ _this.addNewDisc(); }, 1500);
		this.sound.playHit();
	}
	
	Game.prototype.addScore = function(){
		this.counter++;
		panels.updateScore(this.counter); 
	}
	
	Game.prototype.resetStats = function(){
		this.counter = 0;
		panels.updateScore(this.counter);
	}
	
	Game.prototype.resetTargets = function(){
		for(var i = 0; i < this.discArray.length; i++){
			this.discArray[i].dispose();
		}
		for(var i = 0; i < this.hitTargets.length; i++){
			this.hitTargets[i].dispose();
		}
		this.discArray = [];
		this.hitTargets = [];
		
		this.initTargets();
	}
	
	Game.prototype.removeTarget = function(i){
		this.discArray[i].material = this.hitTargetMat;
		this.hitTargets.push(this.discArray[i]);
		this.discArray.splice(i,1);
		
	} 
	
	Game.prototype.stopGame = function(){
		this.gameRunning = false;
	}
	
	Game.prototype.runGame = function() {
		this.gameRunning = true;
	}
	  
	Game.prototype.moveRight = function(){
		if(this.gameRunning)
			this.camera.alpha += 0.82 * (this.engine.deltaTime/1000);
	}
	
	Game.prototype.moveLeft = function() {
		if(this.gameRunning)
			this.camera.alpha -= 0.82 * (this.engine.deltaTime/1000);
	}
	
	Game.prototype.punchLeft = function(){
		if(this.gameRunning){
			this.punchers.punchLeft();
			this.sound.playSwing();		
		}
	} 
	
	Game.prototype.punchRight = function(){
		if(this.gameRunning){
			this.punchers.punchRight();
			this.sound.playSwing();		
		}
	}
	
    Game.prototype.renderLoopLogic = function () {
		if(this.gameRunning){
			if(this.webCam){ 
				var rotation = getMotions();
				this.camera.alpha += rotation * (this.engine.deltaTime/1000);
			}
		
			for(var i = 0; i < this.discArray.length; i++){
				if (this.discArray[i] != undefined && this.punchers.armLeft.intersectsMesh(this.discArray[i], true)) {
					this.punchDisc(i, this.discArray[i].position); 
				}  
				else if (this.discArray[i] != undefined && this.punchers.armRight.intersectsMesh(this.discArray[i], true)) {
					this.punchDisc(i, this.discArray[i].position);
				}
				else{
					var x = Math.round( this.discArray[i].position.x * 10 ) / 10;
					var y = Math.round( this.discArray[i].position.y * 10 ) / 10;
					var z = Math.round( this.discArray[i].position.z * 10 ) / 10;

					if(x != this.discArray[i].originalPos.x || y != this.discArray[i].originalPos.y || z != this.discArray[i].originalPos.z){
						this.punchDisc(i, this.discArray[i].position);
					}
				}
			}
			
			this.checkControlls();
		}
    };
	
	Game.prototype.checkControlls = function(){
		var _this = this;
		//moving
		if(!this.webCam){ 
			if(Key.isDown(Key.LEFT)){
				game.moveLeft();
			} 
			else if(Key.isDown(Key.RIGHT)){
				game.moveRight();
			}
			
			//punching
			if(Key.isDown(Key.PUNCH_LEFT)){
				if(this.punchBlocked){
					this.sound.playPunchBlocked();
				}
				else{
					setTimeout(function(){ _this.punchBlocked = false;}, 1800);
					this.punchBlocked = true;
					this.punchLeft(); 
				}
			} 
			else if(Key.isDown(Key.PUNCH_RIGHT)){
				if(this.punchBlocked){
					// Do some sound ?
					this.sound.playPunchBlocked();
				}
				else{
					setTimeout(function(){ _this.punchBlocked = false;}, 1800);
					this.punchBlocked = true;
					this.punchRight();
				}
			}
		}
		//quit
		if(Key.isDown(Key.QUIT)){
			fsm.end();
		} 
	}
	
    return Game;
})();





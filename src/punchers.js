var Punchers = (function () {
	
    function Punchers(scene, camera) {
		this.scene = scene;
		this.camera = camera;
		this.blockAnimationsLeft = false;
		this.blockAnimationsRight = false;
    }

	Punchers.prototype.init = function(){
		//Create Boxing Hands 
		this.handMat = new BABYLON.StandardMaterial("armMat", this.scene);
		this.handMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
		this.armMat = new BABYLON.StandardMaterial("handMat", this.scene);
		this.armMat.diffuseColor = new BABYLON.Color3(0.866, 0.62, 0.62);
		this.armLeft =  BABYLON.Mesh.CreateCylinder("armLeft", 5, 0.4, 0.6, 0, 6, this.scene, true, new BABYLON.Vector3(0,1,0));
		this.armLeft.material = this.armMat;
		var handLeft = BABYLON.Mesh.CreateSphere("handLeft", 5, 1.0, this.scene, true, new BABYLON.Vector3(0,1,0));
		handLeft.position.y = 3.1;		//How far away is the hand from the arm
		handLeft.parent = this.armLeft;
		handLeft.material = this.handMat;
		this.armLeft.parent = this.camera;
		//this.armLeft.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.2, restitution: 0.2 });
		this.armLeft.rotation.z = -Math.PI/18;
		this.armLeft.rotation.x = Math.PI/10;
		this.armLeft.position = new BABYLON.Vector3(-2.3,-3.9,4.2);
		
		this.armRight = this.armLeft.clone();
		this.armRight.parent = this.camera;
		this.armRight.position.x = 2.3;
		this.armRight.rotation.z = Math.PI/18;
	}
	 
	Punchers.prototype.hide = function(){
		this.armMat.alpha = 0.0
		this.handMat.alpha = 0.0
	}
	
	Punchers.prototype.show = function(){
		this.armMat.alpha = 1.0
		this.handMat.alpha = 1.0
	}
	
	Punchers.prototype.punchLeft = function(){
		//Rotation down
		var animRotArm = new BABYLON.Animation("animRotArm", "rotation.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
			
		var keyRotArm = [];
		keyRotArm.push({ frame: 0, value: this.armLeft.rotation.x });
		keyRotArm.push({ frame: 7, value: Math.PI/4 });
		keyRotArm.push({  frame: 30, value: this.armLeft.rotation.x });
		
		animRotArm.setKeys(keyRotArm);
		this.armLeft.animations.push(animRotArm);

		//Forward punch
		var animForwardArm = new BABYLON.Animation("animForwardArm", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
			
		var keyForwardArm = [];
		keyForwardArm.push({ frame: 0, value: this.armLeft.position.z });
		keyForwardArm.push({ frame: 7, value: 9.6 });
		keyForwardArm.push({ frame: 30, value: this.armLeft.position.z });
		
		animForwardArm.setKeys(keyForwardArm);
		this.armLeft.animations.push(animForwardArm);
		
		//Little upward movement
		var animUpArm = new BABYLON.Animation("animUpArm", "position.y", 30,
		BABYLON.Animation.ANIMATIONTYPE_FLOAT,
		BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
			
		var keyUpArm = [];
		keyUpArm.push({ frame: 0, value: this.armLeft.position.y });
		keyUpArm.push({ frame: 7, value: -2.1 });
		keyUpArm.push({ frame: 30, value: this.armLeft.position.y });
		
		animUpArm.setKeys(keyUpArm);
		this.armLeft.animations.push(animUpArm);
		var _this = this;
		
		//start animation
		if(!this.blockAnimationsLeft){
			var _this = this;
			this.scene.beginAnimation(this.armLeft, 0, 30, false, 3, function () {
				_this.blockAnimationsLeft = false;
			}); 
			this.blockAnimationsLeft = true;
		}
	} 
		
	Punchers.prototype.punchRight = function(){
		//Rotation down
		var animRotArm = new BABYLON.Animation("animRotArm", "rotation.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
			
		var keyRotArm = [];
		keyRotArm.push({ frame: 0, value: this.armRight.rotation.x });
		keyRotArm.push({ frame: 7, value: Math.PI/4 });
		keyRotArm.push({  frame: 30, value: this.armRight.rotation.x });
		
		animRotArm.setKeys(keyRotArm);
		this.armRight.animations.push(animRotArm);

		//Forward punch
		var animForwardArm = new BABYLON.Animation("animForwardArm", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
			
		var keyForwardArm = [];
		keyForwardArm.push({ frame: 0, value: this.armRight.position.z });
		keyForwardArm.push({ frame: 7, value: 9.6 });
		keyForwardArm.push({ frame: 30, value: this.armRight.position.z });
		
		animForwardArm.setKeys(keyForwardArm);
		this.armRight.animations.push(animForwardArm);
		
		//Little upward movement
		var animUpArm = new BABYLON.Animation("animUpArm", "position.y", 30,
		BABYLON.Animation.ANIMATIONTYPE_FLOAT,
		BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
			
		var keyUpArm = [];
		keyUpArm.push({ frame: 0, value: this.armRight.position.y });
		keyUpArm.push({ frame: 7, value: -2.1 });
		keyUpArm.push({ frame: 30, value: this.armRight.position.y });
		
		animUpArm.setKeys(keyUpArm);
		this.armRight.animations.push(animUpArm);
		var _this = this;
		//start animation
		
				//start animation
		if(!this.blockAnimationsRight){
			var _this = this;
			this.scene.beginAnimation(this.armRight, 0, 30, false, 3, function () {
				_this.blockAnimationsRight = false;
			}); 
			this.blockAnimationsRight = true;
		}
	}
 
    return Punchers;
})();




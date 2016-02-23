var Environment = (function () {
	
    function Environment(scene) {
		this.scene = scene;
    }

	Environment.prototype.init = function(){

		this.scene.clearColor = new BABYLON.Vector3(0.3,0.3,0.3);
		
		var groundMaterial = new BABYLON.StandardMaterial("ground", this.scene);
		groundMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/gym_floor_2.jpg", this.scene);
		groundMaterial.diffuseTexture.uScale = 6.0;
		groundMaterial.diffuseTexture.vScale = 6.0;
		var ground = BABYLON.Mesh.CreateGround("ground", 1024, 1024, 24, this.scene, false);
		ground.position.y -= 15;
		ground.material = groundMaterial;
		ground.setPhysicsState({ impostor: BABYLON.PhysicsEngine.PlaneImpostor, mass: 0, friction: 0.9, restitution: 0.5 });
		
		//Main Box floor
		var mainRing = BABYLON.MeshBuilder.CreateBox("mainRing", {width: 70, height: 10, depth: 70}, this.scene);
		mainRing.position.y -= 10;
		mainRing.material= new BABYLON.StandardMaterial("boxring", this.scene); 
		mainRing.material.diffuseTexture = new BABYLON.Texture("assets/textures/boxring.jpg", this.scene);
		mainRing.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 1, friction: 0.99, restitution: 0.6 });
		
		//Side posts
		var postMaterial = new BABYLON.StandardMaterial("laserMat", this.scene);
		postMaterial.diffuseColor = new BABYLON.Color3(1, 0.2, 0.2);
		this.cylinder1 = BABYLON.Mesh.CreateCylinder("post1", 10, 2, 2, 0, 6, this.scene, false, new BABYLON.Vector3(0,1,0));
		this.cylinder1.material = postMaterial;
		this.cylinder2 = this.cylinder1.clone();
		this.cylinder3 = this.cylinder1.clone();
		this.cylinder4 = this.cylinder1.clone();
		this.cylinder1.position.x = 28;
		this.cylinder1.position.z = 28;
		this.cylinder2.position.x = -28;
		this.cylinder2.position.z = 28;
		this.cylinder3.position.x = 28;
		this.cylinder3.position.z = -28;
		this.cylinder4.position.x = -28;
		this.cylinder4.position.z = -28;
		//Ropes
		var ropeMat = new BABYLON.StandardMaterial("ropeMat", this.scene); 
		ropeMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.6);
		var rope1 = BABYLON.Mesh.CreateCylinder("post1", 60, 0.7, 0.7, 0, 6, this.scene, false, new BABYLON.Vector3(0,1,0));
		rope1.material = ropeMat;
		rope1.rotation.x = Math.PI/2;
		rope1.position.y += 3;
		rope1.position.x += 28;
		var rope2 = rope1.clone();
		rope2.position.y -= 4;
		var rope3 = rope1.clone();
		var rope4 = rope2.clone();
		rope3.position.x = -28;
		rope4.position.x = -28;
						
		var rope5 = rope1.clone();
		var rope6 = rope2.clone();
		rope5.position.x = 0;
		rope6.position.x = 0;
		rope5.position.z = 28;
		rope6.position.z = 28;
		rope5.rotation.y = Math.PI/2;
		rope6.rotation.y = Math.PI/2;
		var rope7 = rope5.clone();
		var rope8 = rope6.clone();
		rope7.position.z = -28;
		rope8.position.z = -28;

		//podest for the mesh;
		var podestMat = new BABYLON.StandardMaterial("transparentPodest", this.scene);
		podestMat.alpha = 0.0;
		var podest = BABYLON.Mesh.CreateCylinder("podest", 5, 25, 25, 0, 6, this.scene, false, new BABYLON.Vector3(0,1,0));
		podest.position.y = -2.5;
		podest.setPhysicsState({ impostor: BABYLON.PhysicsEngine.PlaneImpostor, mass: 5, friction: 0.0, restitution: 0.0 });
		podest.material = podestMat;
		 
	}
 
    return Environment;
})();






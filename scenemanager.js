var BOSS_LEVEL = false;

/* ========================================================================================================== */
// Level Manager stuff
/* ========================================================================================================== */
function SceneManager(game) {
	this.game = game;

	//Always starts at title scene
	console.log("Game Start");
	this.currentScene = new SplashScene(this.game);
	//to disable higher levels set this.game.level = 1
	this.game.level = 3;
	this.game.numOfBosses = 1;
}

SceneManager.prototype.constructor = SceneManager;

SceneManager.prototype.reset = function () {
	this.game.running = false;
	this.game.playerResources = 0;
	this.game.enemyResources = 0;
	this.game.ship.health = 100;
	this.game.numOfBosses = 1;


	for (var i = 0; i < this.game.player.length; i++) {
		this.game.player[i].removeFromWorld = true;
	}
	for (var i = 0; i < this.game.extras.length; i++) {
		this.game.extras[i].removeFromWorld = true;
	}
	for (var i = 0; i < this.game.allies.length; i++) {
		this.game.allies[i].removeFromWorld = true;
	}
	for (var i = 0; i < this.game.enemies.length; i++){
		this.game.enemies[i].removeFromWorld = true;
	}
	for(var i = 0; i < this.game.enemyProjectiles.length; i++){
		this.game.enemyProjectiles[i].removeFromWorld = true;
	}
	for(var i = 0; i < this.game.playerProjectiles.length; i++){
		this.game.playerProjectiles[i].removeFromWorld = true;
	}
	for(var i = 0; i < this.game.resources.length; i++){
		this.game.resources[i].removeFromWorld = true;
	}
	for (var i = 0; i < this.game.terrain.length; i++){
		this.game.terrain[i].removeFromWorld = true;
	}
	for (var i = 0; i < this.game.effects.length; i++) {
		this.game.effects[i].removeFromWorld = true;
	}
	for (var i = 0; i < this.game.levels.length; i++) {
		this.game.levels[i].removeFromWorld = true;
	}
}

SceneManager.prototype.update = function () {
	//console.log("health: " + this.game.ship.health);
	//sconsole.log("current: " + this.currentScene.name);
	if (!this.game.running && this.game.gameStart) {
		this.game.gameStart = false;
	}

	//console.log("menu: " + this.game.menu);
	if(this.game.select && this.currentScene.name != "Level") {
		this.game.select = false;
		if((this.game.level >= 1) && (this.game.pointer === 1)) {
			console.log("tutorial");
			this.changeScenes(new TutorialScene(this.game));
		}
		if((this.game.level >= 1) && (this.game.pointer === 2)) {
			console.log("level 1");
			this.changeScenes(new StoryScrollScene(this.game));
			//this.changeScenes(new Level1(this.game));
		}
		if(this.game.level >= 2 && this.game.pointer === 3) {
			console.log("level 2");
			this.changeScenes(new Level2(this.game));
		}
		if(this.game.level >= 3 && this.game.pointer === 4) {
			console.log("level 3");
			this.changeScenes(new Level3(this.game));
		}
	}

	if(this.game.menu) {
		this.game.menu = false;
		this.reset();
		this.changeScenes(new SplashScene(this.game));
	}
}

SceneManager.prototype.loadPlayer = function () {
	console.log("load player");
	this.game.ship.removeFromWorld = true;
	this.game.running = true;
	var ship = new TheShip(this.game);
	var reticle = new Reticle(this.game);
	this.game.addEntity(ship);
	this.game.addEntity(reticle);
	this.game.ship = ship;
	//this.game.ship.health = 100;
	SCORE = 0;
}

SceneManager.prototype.changeScenes = function (newScene) {
	//console.log("current: " + this.currentScene.name);
	//console.log("new: " + newScene.name);
	this.game.select = false;

	for(var i = 0; i < this.currentScene.entities.length; i++) {
		this.currentScene.entities[i].removeFromWorld = true;
		this.currentScene.removeFromWorld = true;
	}

	this.currentScene = newScene;
	this.game.addEntity(this.currentScene);
}


//Every playable level needs a hud.
function HUD(game) {
	this.name = "Element";

	this.hudOverlay = new Animation(AM.getAsset("./img/hudOverlay.png"), 1200, 300, 1200, 1, 1, true, 1);
	this.minimapBorder = new Animation(AM.getAsset("./img/hudMinimapBorder.png"), 272, 272, 272, 1, 1, true, 1);
	this.level3Overlay = new Animation(AM.getAsset("./img/levelThreeForeground.png"), 1359, 800, 1359, 1, 1, true, 1);
	this.rollIcon = new Animation(AM.getAsset("./img/hudRollIcon.png"), 128, 128, 1408, 0.15, 11, true, 0.5);
	this.laserIcon = new Animation(AM.getAsset("./img/hudLaserIcon.png"), 128, 128, 256, 0.15, 2, true, 0.5);
	this.waveIcon = new Animation(AM.getAsset("./img/hudWaveIcon.png"), 128, 128, 256, 0.15, 2, true, 0.5);
	this.bulletIcon = new Animation(AM.getAsset("./img/hudBulletIcon.png"), 128, 128, 256, 0.15, 2, true, 0.5);
	this.burstIcon = new Animation(AM.getAsset("./img/hudBurstIcon.png"), 128, 128, 256, 0.15, 2, true, 0.5);
	this.missileIcon = new Animation(AM.getAsset("./img/hudMissileIcon.png"), 128, 128, 256, 0.15, 2, true, 0.5);
	this.homingIcon = new Animation(AM.getAsset("./img/hudHomingIcon.png"), 128, 128, 256, 0.15, 2, true, 0.5);
	this.chargeIcon = new Animation(AM.getAsset("./img/hudChargeIcon.png"), 128, 128, 256, 0.15, 2, true, 0.5);
	this.orbiterIcon = new Animation(AM.getAsset("./img/hudOrbiterIcon.png"), 128, 128, 256, 0.15, 2, true, 0.5);


	this.minimapObjects = [];
	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

HUD.prototype.draw = function() {
	if (BOSS_LEVEL) {
		this.level3Overlay.drawFrame(game.clockTick, this.ctx, -139, 0, 0);
	}

	// HUD top back panel
	// this.game.ctx.fillStyle = "Black";
	this.game.ctx.fillRect(this.game.camera.x + 16, this.game.camera.y + 16, 320, 32);
	this.game.ctx.fillRect(this.game.camera.x + 16, this.game.camera.y + 64, 320, 32);
	this.game.ctx.fillStyle = "DarkRed";
	this.game.ctx.fillRect(this.game.camera.x + 16, this.game.camera.y + 16, 320 * this.game.ship.health / this.game.ship.healthMax, 32);
	this.game.ctx.fillStyle = "DarkBlue";
	this.game.ctx.fillRect(this.game.camera.x + 16, this.game.camera.y + 64, 320 * this.game.ship.boost / this.game.ship.boostMax, 32);
	this.hudOverlay.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x, this.game.camera.y, 0);

	// HUD text fields
	this.game.ctx.font = "16pt Impact";
	this.game.ctx.fillStyle = "White";
	this.game.ctx.textAlign = "center";
	this.game.ctx.fillText("Hull Integrity", this.game.camera.x + 176, this.game.camera.y + 40);
	this.game.ctx.fillText("Boost Fuel", this.game.camera.x + 176, this.game.camera.y + 88);
	this.game.ctx.fillText("Score: " + (SCORE * 100), this.game.camera.x + 600, this.game.camera.y + 40);
	this.game.ctx.fillStyle = "Black";
	this.game.ctx.strokeText("Hull Integrity", this.game.camera.x + 176, this.game.camera.y + 40);
	this.game.ctx.strokeText("Boost Fuel", this.game.camera.x + 176, this.game.camera.y + 88);
	this.game.ctx.strokeText("Score: " + (SCORE * 100), this.game.camera.x + 600, this.game.camera.y + 40);

	// Right Side HUD icons
	if (this.game.ship.primaryType === 0) {
		this.laserIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 880, this.game.camera.y + 16, 0);
	}
	else if (this.game.ship.primaryType === 1) {
		this.waveIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 880, this.game.camera.y + 16, 0);
	}
	else if (this.game.ship.primaryType === 2) {
		this.bulletIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 880, this.game.camera.y + 16, 0);
	}
	else {
		this.burstIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 880, this.game.camera.y + 16, 0);
	}

	if (this.game.ship.secondaryType === 0) {
		this.missileIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 992, this.game.camera.y + 16, 0);
	}
	else if (this.game.ship.secondaryType === 1) {
		this.homingIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 992, this.game.camera.y + 16, 0);
	}
	else if (this.game.ship.secondaryType === 2) {
		this.chargeIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 992, this.game.camera.y + 16, 0);
	}
	else {
		this.orbiterIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 992, this.game.camera.y + 16, 0);
	}

	this.rollIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 1104, this.game.camera.y + 16, 0);
	this.game.ctx.fillStyle = "rgba(128, 128, 128, 0.5)";
	this.game.ctx.fillRect(this.game.camera.x + 1101, this.game.camera.y + 16, 70 * this.game.ship.rollCooldown / 100 + 1, 64);

	if (BOSS_LEVEL) {
		this.game.ctx.fillStyle = "Black";
		this.game.ctx.fillRect(this.game.camera.x + 300, this.game.camera.y + 736, 600, 48);
		this.game.ctx.fillStyle = "DarkRed";
		this.game.ctx.fillRect(this.game.camera.x + 302, this.game.camera.y + 738,
							   596 * this.game.boss.health / this.game.boss.healthMax, 44);
		this.game.ctx.font = "24pt Impact";
		this.game.ctx.fillStyle = "White";
		this.game.ctx.textAlign = "center";
		this.game.ctx.fillText("Colossal Space Lice", this.game.camera.x + 600, this.game.camera.y + 773);
		this.game.ctx.fillStyle = "Black";
		this.game.ctx.strokeText("Colossal Space Lice", this.game.camera.x + 600, this.game.camera.y + 773);
	}
	else {
		// HUD minimap
		this.game.ctx.fillStyle = "rgba(176, 196, 222, 0.25)";
		this.game.ctx.fillRect(this.game.camera.x + 944, this.game.camera.y + 544, 240, 240);

		this.minimapBorder.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 928, this.game.camera.y + 528, 0);

		//minimap logic
		for (var i = 0; i< this.minimapObjects.length; i++){
			//parse what color to draw this dot
			if (this.minimapObjects[i].name === "Enemy"){
				//do math to convert world coordinates to map coordinates
				var mapX = (this.minimapObjects[i].xMid * 240)/this.game.ctx.canvas.width;
				var mapY = (this.minimapObjects[i].yMid * 240)/this.game.ctx.canvas.height;
				var mapWidth = (this.minimapObjects[i].pWidth * 240 * this.minimapObjects[i].scale)/this.game.ctx.canvas.width;
				var mapHeight = (this.minimapObjects[i].pHeight * 240 * this.minimapObjects[i].scale)/this.game.ctx.canvas.height;
				//draw the dude
				this.game.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
				this.game.ctx.fillRect(this.game.camera.x + 944 + mapX, this.game.camera.y + 544 + mapY, mapWidth, mapHeight);
			} else if (this.minimapObjects[i].name === "Ally"){
				//do math to convert world coordinates to map coordinates
				var mapX = (this.minimapObjects[i].xMid * 240)/this.game.ctx.canvas.width;
				var mapY = (this.minimapObjects[i].yMid * 240)/this.game.ctx.canvas.height;
				var mapWidth = (this.minimapObjects[i].pWidth * 240 * this.minimapObjects[i].scale)/this.game.ctx.canvas.width;
				var mapHeight = (this.minimapObjects[i].pHeight * 240 * this.minimapObjects[i].scale)/this.game.ctx.canvas.height;
				//draw the dude
				this.game.ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
				this.game.ctx.fillRect(this.game.camera.x + 944 + mapX, this.game.camera.y + 544 + mapY, mapWidth, mapHeight);
			} else if (this.minimapObjects[i].name === "Player"){
				//do math to convert world coordinates to map coordinates
				var mapX = (this.minimapObjects[i].xMid * 240)/this.game.ctx.canvas.width;
				var mapY = (this.minimapObjects[i].yMid * 240)/this.game.ctx.canvas.height;
				var mapWidth = (this.minimapObjects[i].pWidth * 240 * this.minimapObjects[i].scale)/this.game.ctx.canvas.width;
				var mapHeight = (this.minimapObjects[i].pHeight * 240 * this.minimapObjects[i].scale)/this.game.ctx.canvas.height;
				//draw the dude
				this.game.ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
				this.game.ctx.fillRect(this.game.camera.x + 944 + mapX, this.game.camera.y + 544 + mapY, mapWidth, mapHeight);
			} else if (this.minimapObjects[i].name === "Terrain"){
				//do math to convert world coordinates to map coordinates
				var mapX = (this.minimapObjects[i].xMid * 240)/this.game.ctx.canvas.width;
				var mapY = (this.minimapObjects[i].yMid * 240)/this.game.ctx.canvas.height;
				var mapWidth = (this.minimapObjects[i].pWidth * 240 * this.minimapObjects[i].scale)/this.game.ctx.canvas.width;
				var mapHeight = (this.minimapObjects[i].pHeight * 240 * this.minimapObjects[i].scale)/this.game.ctx.canvas.height;
				//draw the dude
				if(this.minimapObjects[i].hasbase){
					if(this.minimapObjects[i].base.name === "Ally"){
						this.game.ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
						this.game.ctx.fillRect(this.game.camera.x + 944 + mapX, this.game.camera.y + 544 + mapY, mapWidth, mapHeight);
					}else {
						this.game.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
						this.game.ctx.fillRect(this.game.camera.x + 944 + mapX, this.game.camera.y + 544 + mapY, mapWidth, mapHeight);
					}
				}else {
					this.game.ctx.fillStyle = "rgba(167, 167, 167, 0.5)";
					this.game.ctx.fillRect(this.game.camera.x + 944 + mapX, this.game.camera.y + 544 + mapY, mapWidth, mapHeight);
				}
			}
		}
		var oldLinewidth = this.game.ctx.lineWidth;
		//camera Box
		var mapX = (this.game.camera.x * 240)/this.game.ctx.canvas.width;
		var mapY = (this.game.camera.y * 240)/this.game.ctx.canvas.height;
		var mapWidth = (this.game.cameraCtx.canvas.width * 240)/this.game.ctx.canvas.width;
		var mapHeight = (this.game.cameraCtx.canvas.height * 240)/this.game.ctx.canvas.height;
		this.game.ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
		this.game.ctx.lineWidth = "2";
		this.game.ctx.strokeRect(this.game.camera.x + 944 + mapX, this.game.camera.y + 544 + mapY, mapWidth, mapHeight);

		this.game.ctx.lineWidth = oldLinewidth;
	}


	// Player resource counter
	// this.game.ctx.fillText("Player Faction Resources: " + this.game.playerResources,this.game.camera.x + 200, this.game.camera.y + 40);

	// Return to main menu
	this.game.ctx.font = "16pt Impact";
	this.game.ctx.fillStyle = "White";
	this.game.ctx.textAlign = "left";
	this.game.ctx.fillText("Main Menu: ESC", this.game.camera.x + 16, this.game.camera.y + 784);
	this.game.ctx.fillStyle = "Black";
	this.game.ctx.strokeText("Main Menu: ESC", this.game.camera.x + 16, this.game.camera.y + 784);

	// Pause
	if (this.game.paused) {
		this.game.ctx.font = "64pt Impact";
		this.game.ctx.fillStyle = "Red";
		this.game.ctx.textAlign = "center";
		this.game.ctx.fillText("PAUSED", this.game.camera.x + 600, this.game.camera.y + 432);
		this.game.ctx.fillStyle = "Black";
		this.game.ctx.strokeText("PAUSED", this.game.camera.x + 600, this.game.camera.y + 432);
		this.game.ctx.font = "16pt Impact";
		this.game.ctx.fillStyle = "Red";
		this.game.ctx.fillText("-Press P to unpause-", this.game.camera.x + 600, this.game.camera.y + 456);
		this.game.ctx.fillStyle = "Black";
		this.game.ctx.strokeText("-Press P to unpause-", this.game.camera.x + 600, this.game.camera.y + 456);
	}

	Entity.prototype.draw.call(this);
}

HUD.prototype.update = function () {
	this.minimapObjects = [];
	var j = 0;
	for (j = 0; j<this.game.terrain.length; j++){
		this.minimapObjects[j] = this.game.terrain[j];
	}

	for (var i = 0; i< this.game.enemies.length; i++){
		// if(this.game.enemies[i].isBuilder){
			this.minimapObjects[j] = this.game.enemies[i];
			j++;
		// }

	}
	for (var i = 0; i< this.game.allies.length; i++){
		this.minimapObjects[j] = this.game.allies[i];
		j++;
	}

	this.minimapObjects[j] = this.game.ship;

	Entity.prototype.update.call(this);
}


//SPACEFIGHT title object for SplashScreen
//Needs a pretty star
function TitleEffect(game) {
	this.name = "Element";
	this.pWidth = 800;
	this.pHeight = 538;
	this.scale = 1;

	this.animation = new Animation(AM.getAsset("./img/SPACEFIGHT.png"),
								 this.pWidth, this.pHeight,
								 2, 0.155, 12,
								 true, this.scale);

	this.game = game;
	this.ctx = game.ctx;

	this.x = this.game.ctx.canvas.width/2 - this.pWidth/2;
	this.y = this.game.ctx.canvas.height/2 - this.pHeight/2 - 150;
	this.angle = 0;
	this.removeFromWorld = false;

	Entity.call(this, this.game, this.x, this.y);
}

TitleEffect.prototype.draw = function () {
	if(onCamera(this)){
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}

	var ctx = this.game.ctx;
	ctx.font = "24pt Impact";
	this.game.ctx.fillStyle = "Blue";

	this.game.ctx.textAlign = "center";
	this.game.ctx.fillText("Super Plutonian Ace Command Earth Fighting Inter-Galactic Hero Team", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 400, 500);
	this.game.ctx.fillText("W and S to move cursor: Enter to Select level", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 500, 400);

	this.cursor = new Animation(AM.getAsset("./img/shipRollSpeed0.png"), 128, 128, 256, 0.03, 22, false, 0.5);

	//This needs to flicker
	this.game.ctx.fillText("Tutorial", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 600, 500);
	this.game.ctx.fillText("Level 1", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 650, 500);
	if(this.game.level > 1) {
		this.game.ctx.fillText("Level 2", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 700, 500);
	} else {
		this.game.ctx.fillStyle = "Grey";
		this.game.ctx.fillText("Level 2", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 700, 500);
	}
	if(this.game.level > 2) {
		this.game.ctx.fillText("Level 3", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 750, 500);
	} else {
		this.game.ctx.fillStyle = "Grey";
		this.game.ctx.fillText("Level 3", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 750, 500);
	}

	Entity.prototype.draw.call(this);
}

TitleEffect.prototype.update = function () {

	Entity.prototype.update.call(this);
}

function ShipCursor(game) {
	//ship roll animation
	this.game = game;
	this.ctx = game.ctx;
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.5;
	this.animation = new Animation(AM.getAsset("./img/shipRollSpeed0.png"), this.pWidth, this.pHeight, 256, 0.03, 22, true, this.scale);

	//Start X/Y
	this.x = 485;
	this.y = 557;

	this.angle = 0;

	this.name = "Player";
	this.game.pointer = 1;

	Entity.call(this, game, this.x, this.y);
}

ShipCursor.prototype.update = function () {
	//move up
	//move down

	if(this.game.moveDown) {
		this.game.moveDown = false;
		if(this.y <= 705) {
			this.y += 50;
			this.game.pointer++;
			//console.log(this.game.pointer);
		}
	}
	if(this.game.moveUp) {
		this.game.moveUp = false;
		if(this.y >= 607) {
			this.y -= 50;
			this.game.pointer--;
			//console.log(this.game.pointer);
		}
	}

	Entity.prototype.update.call(this);
}

ShipCursor.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	Entity.prototype.draw.call(this);
}

function SplashScene(game) {
	this.name = "Splash";
	this.game = game;
	this.entities = [];

	this.background = new MainBackground(this.game, AM.getAsset("./img/plutoSplashPixel.png"));
	this.game.addEntity(this.background);
	this.entities.push(this.background);

	this.title = new TitleEffect(game);
	this.game.addEntity(this.title);
	this.entities.push(this.title);

	this.cursor = new ShipCursor(this.game);
	this.game.addEntity(this.cursor);
	this.entities.push(this.cursor);
	//this.game.roll = true;
	//this.game.ship.x = this.game.camera.x + this.game.cameraCtx.canvas.width/2 - 128;
	//this.game.ship.y = this.game.camera.y + 600;

	this.scroll = null;
}

SplashScene.prototype.constructor = SplashScene;

function TutorialScene(game) {
	this.name = "Tutorial";
	this.game = game;
	this.ctx = this.game.ctx;
	this.entities = [];

	BOSS_LEVEL = false;

	this.background = new MainBackground(this.game, AM.getAsset("./img/PScroll1/Background_1.png"));
	this.game.addEntity(this.background);
	this.entities.push(this.background);
	this.layer1 = new BackgroundLayer(this.game, AM.getAsset("./img/PScroll1/Background3k.png"));
	this.game.addEntity(this.layer1);
	this.entities.push(this.layer1);

	this.tutorial = new HowTo(this.game);
	this.game.addEntity(this.tutorial);
	this.entities.push(this.tutorial);

	this.hud = new HUD(this.game);
	this.game.addEntity(this.hud);
	this.entities.push(this.hud);
	this.game.sceneManager.loadPlayer();
}

function HowTo(game) {
	this.game = game;
	this.ctx = game.ctx;
	this.name = "Element";
	this.x = 0;
	this.y = 0;
	this.removeFromWorld = false;
	this.isDone = false;

	this.entities = [];

	this.asteroid1 = new Asteroid(this.game, 875, 1600);
	this.station = new SpaceStation(this.game, 875, 1600, this.asteroid1);

	this.asteroid2 = new Asteroid(this.game, 2500, 1600);
	this.enemyStation = new AlienSpaceStation(this.game, 2500, 1600, this.asteroid2);


	//infinite respawn
	this.testEnemy = new Stalker(this.game, 2800, 700, this.enemyStation);
	this.testEnemy.speed = 0;

	this.game.addEntity(this.asteroid1);
	this.game.addEntity(this.asteroid2);
	this.game.addEntity(this.station);
	this.game.addEntity(this.enemyStation);
	this.game.addEntity(this.testEnemy);

	this.entities.push(this.asteroid1);
	this.entities.push(this.asteroid2);
	this.entities.push(this.station);
	this.entities.push(this.enemyStation);
	this.entities.push(this.testEnemy);

	Entity.call(this, this.game, this.x, this.y);
}

HowTo.prototype.update = function() {
	this.game.ship.health = 1000;

	if(false) { //?
		this.isDone = true;
		//this.removeFromWorld = true; - Will be in changeScenes
	}

	Entity.prototype.update.call(this);
}

HowTo.prototype.draw = function() {
	var ctx = this.game.ctx;
	ctx.font = "26pt Impact";
	this.game.ctx.fillStyle = "Blue";
	this.offset = 35;
	this.line = 4;

	this.game.ctx.textAlign = "center";
	this.game.ctx.fillText("Welcome to SPACEFIGHT!", 600, (this.offset * this.line++), 800);
	/*this.game.ctx.fillText("Your goal is to take revenge on Earth for demoting", 600, (this.offset * this.line++), 800);
	this.game.ctx.fillText("the seat of the Empire to \"dwarf\" planet.", 600, (this.offset * this.line++), 800);
	this.game.ctx.fillText("As you travel to Earth, your caravan will build bases,", 600, (this.offset * this.line++), 800);
	this.game.ctx.fillText("harvest materials and fight the scum of the Sol System.", 600, (this.offset * this.line++), 800);*/
	this.game.ctx.fillStyle = "Blue";
	this.game.ctx.fillText("Follow the path to learn the ways of Pluto.", 600, (this.offset * this.line), 800);

	this.point = this.line;

	//Basic Controls
	this.offset = 30;
	this.line += 3;
	this.game.ctx.textAlign = "left";
	this.game.ctx.fillStyle = "Blue";
	ctx.font = "22pt Impact";
	var page = 0;
	//this.game.ctx.fillText("Basic Controls", page, (this.offset * this.line++), 400);
	this.game.ctx.fillText("To Move: W A S D", 0, 270, 400);
	this.game.ctx.fillText("Return to Menu at Anytime: ESC", 0, 300, 400);

	//horizontal
	this.pathStartX = 400;
	this.pathStartY = 400;
	this.pathStopX = this.pathStartX + 3250;
	this.pathStopY = this.pathStartY;
	this.game.ctx.beginPath();
	this.game.ctx.moveTo(this.pathStartX, this.pathStartY);
	this.game.ctx.lineTo(this.pathStopX, this.pathStopY);
	this.game.ctx.lineWidth = 100;
	this.game.ctx.strokeStyle = 'grey';
	this.game.ctx.stroke();

	page += 1200;
	this.game.ctx.fillText("To Dodge: SPACEBAR", page, (this.offset * this.line--), 400);
	this.game.ctx.fillText("To Boost Speed: SHIFT", page, (this.offset * this.line), 400);


	page += 1200;
	//weapons
	this.game.ctx.fillStyle = "Blue";
	this.line = 4; //resetline to top of screen
	this.game.ctx.textAlign = "center";
	this.game.ctx.fillText("Learn To Shoot!", page + 500, (this.offset * this.line++), 800);
	this.game.ctx.fillText("Don't worry, you can't die.", page + 500, (this.offset * this.line++), 800);
	this.line =+ 17;
	this.game.ctx.fillText("To aim: Place cursor on target", page, (this.offset * this.line++), 400);
	this.game.ctx.fillText("To Shoot Primary Weapon: Left Click", page, (this.offset * this.line++), 400);
	this.game.ctx.fillText("To Shoot Secondary Weapon: Right Click", page, (this.offset * this.line++), 400);

	//vertical
	this.pathStartX = 4000 - 400;
	this.pathStartY = 400;
	this.pathStopX = this.pathStartX;
	this.pathStopY = this.pathStartY + 800;
	this.game.ctx.beginPath();

	this.game.ctx.moveTo(this.pathStartX, this.pathStartY);
	this.game.ctx.lineTo(this.pathStopX, this.pathStopY);
	this.game.ctx.lineWidth = 100;
	this.game.ctx.strokeStyle = 'grey';
	this.game.ctx.stroke();

	this.game.ctx.fillText("Cycle Primary Weapons: 1", 3000, 1100, 400);
	this.game.ctx.fillText("Cycle Secondary Weapons: 2", 3000, 1140, 400);
	this.game.ctx.fillText("There are 4 versions of each", 3000, 1300, 400);


	this.game.ctx.fillText("Cycle Primary Weapons: 1", 3000, 1100, 400);
	this.game.ctx.fillText("Cycle Secondary Weapons: 2", 3000, 1140, 400);
	this.game.ctx.fillText("There are 4 versions of each", 3000, 1300, 400);

	//powerups
	//When you kill them, enemies have a chance to drop a power up!
	//put a new powerup of each type on the path w
	this.game.ctx.fillText("Power Up tutorial coming soon!", 1200, 1000, 400);
	this.game.ctx.fillText("Keep going to learn more about how to win!", 1200, 1030, 400);


	//Allied Station - need to drop a layer
	//this.station = new SpaceStation(this.game, 2000, 800, this.asteroid);
	this.game.ctx.fillText("This is an allied space station.", 650, 1630, 400);
	this.game.ctx.fillText("Stations mine asteroids for material.", 650, 1660, 400);
	this.game.ctx.fillText("The gatherers collect the material.", 650, 1690, 400);
	this.game.ctx.fillText("Destroying enemy ships will also drop material.", 650, 1720, 400);
	this.game.ctx.fillText("The material is used to build allied fighters!", 650, 1750, 400);

	//Enemy Station - need to drop a layer
	this.game.ctx.fillText("This is an enemy space station.", 2200, 1700, 400);
	this.game.ctx.fillText("They can build more enemy fighters!", 2200, 1730, 400);
	this.game.ctx.fillText("Practice dodging (SPACE) and boosting (SHIFT).", 2200, 1760, 400);
	this.game.ctx.fillText("The tide of enemies will stop when the station is destroyed.", 2200, 1790, 400);
	this.game.ctx.fillText("Press ESC when you you're ready to return to the menu.", 2200, 1820, 400);

	//horizontal
	this.pathStartX += 50;
	this.pathStartY = 1200;
	this.pathStopX = this.pathStartX - 3200;
	this.pathStopY = this.pathStartY;
	this.game.ctx.beginPath();

	this.game.ctx.moveTo(this.pathStartX, this.pathStartY);
	this.game.ctx.lineTo(this.pathStopX, this.pathStopY);
	this.game.ctx.lineWidth = 100;
	this.game.ctx.strokeStyle = 'grey';
	this.game.ctx.stroke();

	//vertical
	this.pathStartX = 400;
	this.pathStartY = 1150;
	this.pathStopX = this.pathStartX;
	this.pathStopY = this.pathStartY + 800;
	this.game.ctx.beginPath();

	this.game.ctx.moveTo(this.pathStartX, this.pathStartY);
	this.game.ctx.lineTo(this.pathStopX, this.pathStopY);
	this.game.ctx.lineWidth = 100;
	this.game.ctx.strokeStyle = 'grey';
	this.game.ctx.stroke();

	//horizontal
	this.pathStartX = 350;
	this.pathStartY =+ 2000;
	this.pathStopX = this.pathStartX + 3200;
	this.pathStopY = this.pathStartY;
	this.game.ctx.beginPath();

	this.game.ctx.moveTo(this.pathStartX, this.pathStartY);
	this.game.ctx.lineTo(this.pathStopX, this.pathStopY);
	this.game.ctx.lineWidth = 100;
	this.game.ctx.strokeStyle = 'grey';
	this.game.ctx.stroke();
	this.game.ctx.lineWidth = 1;

	Entity.prototype.draw.call(this);
}

function StoryScrollScene(game) {
	console.log("scroll");
	this.name = "Level";
	this.game = game;
	this.entities = [];
	this.background = new MainBackground(this.game, AM.getAsset("./img/plutoSplashPixel.png"));
	this.game.addEntity(this.background);
	this.entities.push(this.background);
	this.scroll = new StoryScroll1(this.game, this.level);
	this.entities.push(this.scroll);
	this.game.addEntity(this.scroll);
}

StoryScrollScene.prototype.draw = function () {}
StoryScrollScene.prototype.update = function () {}


function StoryScroll1(game) {
	//is an entity but doesn't contain an animation
	this.game = game;
	this.ctx = game.ctx;
	this.name = "Element";

	this.x = 0;
	this.y = 0;
	this.width = 650; //max pixel width printed per line
	this.lift = 0; //vertical lift factor
	this.narrow = -1; //width scaler to send text into screen later
	this.start = 800; //text starts off the bottom of the screen
	this.offset = 50; //line height
	this.removeFromWorld = false;
	this.isDone = false;

	Entity.call(this, this.game, this.x, this.y);
}

StoryScroll1.prototype.draw = function () {
	var ctx = this.game.ctx;
	ctx.font = "24pt Impact";
	this.game.ctx.fillStyle = "Yellow";
	this.line = 0;

	this.game.ctx.textAlign = "center";
	this.game.ctx.fillText("Press Enter to Skip", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 50 + this.offset + this.lift, 650);
	this.game.ctx.fillText("Episode IV Pluto’s Revenge", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.line++;
	this.game.ctx.fillText("Since the fateful year of 2006, Plutonian civilization has been in upheaval. The demotion of", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.game.ctx.fillText("Pluto from planet to mere dwarf planet threw its entire culture into shock. Gone were the", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.game.ctx.fillText("halcyon days of old where their home planet sat as an equal among a council of nine.", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.line++;
	this.game.ctx.fillText("Years of bloody civil war ravaged the Plutonians, threatening their very extinction, yet from", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("amongst the warring factions of Pluto emerged a single victor, an Empress who unified her", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("people with a singular and abiding message “Earth will pay.”", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.line++;
	this.game.ctx.fillText("From her palace complex on Pluto she has hired heroic space captains and equipped them with", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("Pluto’s finest craft. Now is the time to restore Pluto to her rightful status as a Planet,", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("now is the time for Pluto’s Revenge…", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);

	Entity.prototype.draw.call(this);
}

StoryScroll1.prototype.update = function () {
	//console.log("scroll update");
	this.lift += -1; //negative makes it go up
	//this.narrow *= 2; //adjust to allow for in-to-screen scroll
	if(this.lift === -1400 || this.game.select) {
		console.log("scroll 1 ended");
		this.game.select = false;
		this.isDone = true;
		//To test new level, swap level here.
		this.removeFromWorld = true;
		this.game.sceneManager.reset();
		var level = new Level1(this.game);
		this.game.sceneManager.changeScenes(level);
		//this.game.addEntity(level);
		//this.game.menu = true;
	}

	Entity.prototype.update.call(this);
}

function Level1(game) {
	console.log("prototype");
	this.name = "Level";
	this.game = game;
	this.bossTimerStart = 1000;
	this.bossTimer = 0;
	this.spawnNum = 1;
	this.spawnTimerStart = 100;
	this.counter = 0;
	this.victory = false;

	BOSS_LEVEL = false;

	this.entities = [];
	this.background = new MainBackground(this.game, AM.getAsset("./img/level1mainAlt.png"));
	this.game.addEntity(this.background);
	this.entities.push(this.background);
	this.layer1 = new BackgroundLayer(this.game, AM.getAsset("./img/PScroll1/Background3k.png"));
	this.game.addEntity(this.layer1);
	this.entities.push(this.layer1);
	// this.layer2 = new BackgroundLayer(this.game, AM.getAsset("./img/gasGiantsNebulaLayer.png"));
	// this.game.addEntity(this.layer2);
	// this.entities.push(this.layer2);
	// this.layer2 = new BackgroundLayer(this.game, AM.getAsset("./img/PScroll1/BackgroundMedium.png"));
	// this.game.addEntity(this.layer2);
	// this.entities.push(this.layer2);
	// this.layer3 = new BackgroundLayer(this.game, AM.getAsset("./img/PScroll1/Starfield1-1.png"));
	// this.game.addEntity(this.layer3);
	// this.entities.push(this.layer3);
	// this.layer4 = new BackgroundLayer(this.game, AM.getAsset("./img/PScroll1/BackgroundVariant.png"));
	// this.game.addEntity(this.layer4);
	// this.entities.push(this.layer4);

	//this spawns and places the player base
	this.rock1 = new Asteroid(this.game, 300, 300);
	this.game.addEntity(this.rock1);
	this.entities.push(this.rock1);

	this.playerSpaceStation = new SpaceStation(this.game, 300, 300, this.rock1);
	this.game.addEntity(this.playerSpaceStation);
	this.entities.push(this.playerSpaceStation);
	this.playerSpaceStation.resourceIncr = .05;

	this.rock1.hasbase = true;
	this.rock1.base = this.playerSpaceStation;


	//this spawns the enemy base
	this.rock2 = new Asteroid(this.game, 3000, 3000);
	this.game.addEntity(this.rock2);
	this.entities.push(this.rock2);

	this.enemySpaceStation = new AlienSpaceStation(this.game, 3000, 3000, this.rock2);
	this.enemySpaceStation.resourceIncr = .475;
	this.game.addEntity(this.enemySpaceStation);
	this.entities.push(this.enemySpaceStation);

	this.rock2.hasbase = true;
	this.rock2.base = this.enemySpaceStation;


	//Neutral rock
	this.rock3 = new Asteroid(this.game, 1600, 300);
	this.game.addEntity(this.rock3);
	this.entities.push(this.rock3);

	//Neutral rock
	this.rock4 = new Asteroid(this.game, 300, 1600);
	this.game.addEntity(this.rock4);
	this.entities.push(this.rock4);

	//Neutral rock
	this.rock5 = new Asteroid(this.game, 2700, 2300);
	this.game.addEntity(this.rock5);
	this.entities.push(this.rock5);

	//Neutral rock
	this.rock6 = new Asteroid(this.game, 2200, 3000);
	this.game.addEntity(this.rock6);
	this.entities.push(this.rock6);

	//Neutral rock
	this.rock7 = new Asteroid(this.game, 2400, 600);
	this.game.addEntity(this.rock7);
	this.entities.push(this.rock7);

	this.game.playerResources = 700;
	this.game.enemyResources = 700;

	this.hud = new HUD(this.game); //mandatory
	this.game.addEntity(this.hud);
	this.entities.push(this.hud);
	this.game.sceneManager.loadPlayer(); //mandatory
	console.log("level 1 created");
}

Level1.prototype.update = function(){
	this.victory = false;

	if (this.game.ship.health < 1){
		//console.log("dead");
		this.victory = false;
		this.game.sceneManager.reset();
		this.game.sceneManager.changeScenes(new SplashScene(this.game));
		return;
	}

	if(this.game.numOfBosses <= 0) {
		//console.log("All Bosses Defeated!");
		this.victory = true;
	}

	if(this.victory) {
		this.game.level++;
		this.game.sceneManager.reset();
		this.game.sceneManager.changeScenes(new VictoryScrollScene(this.game, 1));

	}
}

Level1.prototype.draw = function () {}
Level1.prototype.constructor = Level1;

function Level2(game) {
	console.log("prototype");
	this.name = "Level";
	this.game = game;
	this.bossTimerStart = 1000;
	this.bossTimer = 0;
	this.spawnNum = 1;
	this.spawnTimerStart = 100;
	this.counter = 0;

	BOSS_LEVEL = false;

	this.entities = [];
	this.background = new MainBackground(this.game, AM.getAsset("./img/level1mainAlt.png"));
	this.game.addEntity(this.background);
	this.entities.push(this.background);
	this.layer1 = new BackgroundLayer(this.game, AM.getAsset("./img/PScroll1/Background3k.png"));
	this.game.addEntity(this.layer1);
	this.entities.push(this.layer1);


	//this spawns and places the player base
	this.rock1 = new Asteroid(this.game, 1850, 1850);
	this.game.addEntity(this.rock1);
	this.entities.push(this.rock1);

	this.playerSpaceStation = new SpaceStation(this.game, 1850, 1850, this.rock1);
	this.game.addEntity(this.playerSpaceStation);
	this.entities.push(this.playerSpaceStation);
	this.playerSpaceStation.resourceIncr = .1;
	this.rock1.hasbase = true;
	this.rock1.base = this.playerSpaceStation;

	this.rock8 = new Asteroid(this.game, 1242, 1265);
	this.game.addEntity(this.rock8);
	this.entities.push(this.rock8);

	this.rock9 = new Asteroid(this.game, 1200, 1950);
	this.game.addEntity(this.rock9);
	this.entities.push(this.rock9);

	this.rock10 = new Asteroid(this.game, 1989, 1157);
	this.game.addEntity(this.rock10);
	this.entities.push(this.rock10);

	this.rock11 = new Asteroid(this.game, 150, 3350);
	this.game.addEntity(this.rock11);
	this.entities.push(this.rock11);

	this.rock12 = new Asteroid(this.game, 3250, 350);
	this.game.addEntity(this.rock12);
	this.entities.push(this.rock12);

	this.rock13 = new Asteroid(this.game, 2250, 3427);
	this.game.addEntity(this.rock13);
	this.entities.push(this.rock13);

	this.rock13 = new Asteroid(this.game, 850, 2707);
	this.game.addEntity(this.rock13);
	this.entities.push(this.rock13);




	//this spawns the enemy base
	this.rock2 = new Asteroid(this.game, 70, 70);
	this.game.addEntity(this.rock2);
	this.entities.push(this.rock2);

	this.enemySpaceStation = new AlienSpaceStation(this.game, 70, 70, this.rock2);
	this.game.addEntity(this.enemySpaceStation);
	this.entities.push(this.enemySpaceStation);
	this.enemySpaceStation.resourceIncr = .5;
	this.rock2.hasbase = true;
	this.rock2.base = this.enemySpaceStation;



	//Neutral rock
	this.rock3 = new Asteroid(this.game, 1600, 300);
	this.game.addEntity(this.rock3);
	this.entities.push(this.rock3);

	//Neutral rock
	this.rock4 = new Asteroid(this.game, 100, 1200);
	this.game.addEntity(this.rock4);
	this.entities.push(this.rock4);

	//Neutral rock
	this.rock5 = new Asteroid(this.game, 2700, 2300);
	this.game.addEntity(this.rock5);
	this.entities.push(this.rock5);

	//enemy base rock
	this.rock6 = new Asteroid(this.game, 3500, 3300);
	this.game.addEntity(this.rock6);
	this.entities.push(this.rock6);

	this.enemySpaceStation2 = new AlienSpaceStation(this.game, 3500,3300, this.rock6);
	this.game.addEntity(this.enemySpaceStation2);
	this.entities.push(this.enemySpaceStation2);
	this.enemySpaceStation2.resourceIncr = .55;
	this.rock6.hasbase = true;
	this.rock6.base = this.enemySpaceStation2;



	//Neutral rock
	this.rock7 = new Asteroid(this.game, 2400, 600);
	this.game.addEntity(this.rock7);
	this.entities.push(this.rock7);

	this.game.playerResources = 700;
	this.game.enemyResources = 500;
	this.game.numOfBosses = 2;

	this.hud = new HUD(this.game); //mandatory
	this.game.addEntity(this.hud);
	this.entities.push(this.hud);
	this.game.sceneManager.loadPlayer(); //mandatory
	this.game.ship.x = 1850;
	this.game.ship.y = 1850;
}

Level2.prototype.update = function() {
	this.victory = false;

	if (this.game.ship.health < 1){
		//console.log("dead");
		this.victory = false;
		this.game.sceneManager.reset();
		this.game.sceneManager.changeScenes(new SplashScene(this.game));
		return;
	}

	if(this.game.numOfBosses <= 0) {
		//console.log("All Bosses Defeated!");
		this.victory = true;
	}

	if(this.victory) {
		this.game.level++;
		this.game.sceneManager.reset();
		//change to new victory scroll here
		this.game.sceneManager.changeScenes(new VictoryScrollScene(this.game, 2));
	}
}

Level2.prototype.draw = function () {}
Level2.prototype.constructor = Level2;

function Level3(game) {
	console.log("prototype");
	this.name = "Level";
	this.game = game;

	BOSS_LEVEL = true;

	this.entities = [];
	this.background = new MainBackground(this.game, AM.getAsset("./img/levelThreeBackground.png"));
	this.game.addEntity(this.background);
	this.entities.push(this.background);

	this.boss = new BossWorm(this.game, 1200, 93);
	this.game.addEntity(this.boss);
	this.entities.push(this.boss);
	this.game.boss = this.boss;

	this.hud = new HUD(this.game); //mandatory
	this.game.addEntity(this.hud);
	this.entities.push(this.hud);
	this.game.sceneManager.loadPlayer(); //mandatory
	this.game.ship.x = 100;
	this.game.ship.y = 600;
}

Level3.prototype.update = function() {
	this.victory = false;

	if (this.game.ship.health < 1) {
		this.game.sceneManager.reset();
		this.game.sceneManager.changeScenes(new SplashScene(this.game));
		return;
	}

	if (this.game.enemies.length < 1) {
		this.victory = true;
	}

	if (this.victory) {
		this.game.level++;
		this.game.sceneManager.reset();
		this.game.sceneManager.changeScenes(new VictoryScrollScene(this.game, 3));
	}
}

Level3.prototype.draw = function () {}
Level3.prototype.constructor = Level3;

function VictoryScrollScene(game, num) {
	this.name = "VictoryScroll";
	this.game = game;
	this.entities = [];
	this.background = new MainBackground(this.game, AM.getAsset("./img/plutoSplashPixel.png"));
	this.game.addEntity(this.background);
	this.entities.push(this.background);
	if (num ===1){
		this.scroll = new VictoryStoryScroll1(this.game, this.level);
	}else if (num === 2){
		this.scroll = new VictoryStoryScroll2(this.game, this.level);
	}else if (num === 3){
		this.scroll = new VictoryStoryScroll3(this.game, this.level);
	}
	this.entities.push(this.scroll);
	this.game.addEntity(this.scroll);
}

function VictoryStoryScroll1(game) {
	//is an entity but doesn't contain an animation
	this.game = game;
	this.ctx = game.ctx;
	this.name = "Element";

	this.x = 0;
	this.y = 0;
	this.width = 650; //max pixel width printed per line
	this.lift = 0; //vertical lift factor
	this.narrow = -1; //width scaler to send text into screen later
	this.start = 800; //text starts off the bottom of the screen
	this.offset = 50; //line height
	this.removeFromWorld = false;
	this.isDone = false;

	Entity.call(this, this.game, this.x, this.y);
}

VictoryStoryScroll1.prototype.draw = function () {
	var ctx = this.game.ctx;
	ctx.font = "24pt Impact";
	this.game.ctx.fillStyle = "Yellow";
	this.line = 0;

	this.game.ctx.textAlign = "center";
	this.game.ctx.fillText("Press Esc for Main Menu", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 50 + this.offset + this.lift, 650);
	this.game.ctx.fillText("Press Enter to Replay this level", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 100 + this.offset + this.lift, 650);
	this.game.ctx.fillText("Victory", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.line++;
	this.game.ctx.fillText("Victory in the Kuiper Belt over the space lice was not without losses...", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.game.ctx.fillText("It seems the Depraved Humans of Earth have Enslaved the Space Lice Queen", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.game.ctx.fillText("Pluto will not be able to defeat the humans of earth until the Space Lice defeated", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.line++;
	this.game.ctx.fillText("Plutonian's are used to prolonged war, so first we must defeat the Human ally", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("The next step for you in Pluto's rise to solar power is to go to the asteroid belt.", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("There lies the bulk of the Space Lice forces, and there we shall fine their Queen", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.line++;
	this.game.ctx.fillText("Kill all the Space Lice you can in the asteroid belt", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("Once this is done, the Queen of the Space Lice will show herself.", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("Kill her too!", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);

	Entity.prototype.draw.call(this);
}

VictoryStoryScroll1.prototype.update = function () {
	this.lift += -1; //negative makes it go up
	//this.narrow *= 2; //adjust to allow for in-to-screen scroll
	if(this.lift === -1400 || this.game.menu) {
		console.log("ended the scroll");
		this.game.select = false;
		this.isDone = true;
		this.game.menu = true;
		this.removeFromWorld = true;
		this.game.sceneManager.reset();
		this.game.sceneManager.currentScene = new SplashScene(this.game);
	}
	Entity.prototype.update.call(this);
}


///////////////////////level 2 victory scroll/////////////////////////////////////////
function VictoryStoryScroll2(game) {
	//is an entity but doesn't contain an animation
	this.game = game;
	this.ctx = game.ctx;
	this.name = "Element";

	this.x = 0;
	this.y = 0;
	this.width = 650; //max pixel width printed per line
	this.lift = 0; //vertical lift factor
	this.narrow = -1; //width scaler to send text into screen later
	this.start = 800; //text starts off the bottom of the screen
	this.offset = 50; //line height
	this.removeFromWorld = false;
	this.isDone = false;

	Entity.call(this, this.game, this.x, this.y);
}

VictoryStoryScroll2.prototype.draw = function () {
	var ctx = this.game.ctx;
	ctx.font = "24pt Impact";
	this.game.ctx.fillStyle = "Yellow";
	this.line = 0;

	this.game.ctx.textAlign = "center";
	this.game.ctx.fillText("Press Esc for Main Menu", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 50 + this.offset + this.lift, 650);
	this.game.ctx.fillText("Press Enter to Replay this level", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 100 + this.offset + this.lift, 650);
	this.game.ctx.fillText("Victory", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.line++;
	this.game.ctx.fillText("The Space Lice forces in the Asteroid belt have been all but annihilated.", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.game.ctx.fillText("The Space Lice Queen is bound to be hiding inside one of the larger asteroids", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.game.ctx.fillText("Soon our scanning ships will find her, and we will send our greatest Ship to destroy her", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.line++;
	this.game.ctx.fillText("Legends say the great Space Lice Queen is immune to all but the most powerful weapons", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("You will prove those legends wrong by killing the Human's precious ally", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("You will destroy the Space Lice Queen without mercy!", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.line++;
	this.game.ctx.fillText("When the Queen is gone, the Human forces will be weakened enough to mount an attack", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("Go now, we've detected the Queen burrowed inside and asteroid known as 4 Vesta", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("Kill the Queen and we will be one step closer to Justice for Pluto!", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);

	Entity.prototype.draw.call(this);
}

VictoryStoryScroll2.prototype.update = function () {
	this.lift += -1; //negative makes it go up
	//this.narrow *= 2; //adjust to allow for in-to-screen scroll
	if(this.lift === -1400 || this.game.menu) {
		console.log("ended the scroll");
		this.game.select = false;
		this.isDone = true;
		this.game.menu = true;
		this.removeFromWorld = true;
		this.game.sceneManager.reset();
		this.game.sceneManager.currentScene = new SplashScene(this.game);
	}
	Entity.prototype.update.call(this);
}


///////////////////////level 3 victory scroll/////////////////////////////////////////
function VictoryStoryScroll3(game) {
	//is an entity but doesn't contain an animation
	this.game = game;
	this.ctx = game.ctx;
	this.name = "Element";

	this.x = 0;
	this.y = 0;
	this.width = 650; //max pixel width printed per line
	this.lift = 0; //vertical lift factor
	this.narrow = -1; //width scaler to send text into screen later
	this.start = 800; //text starts off the bottom of the screen
	this.offset = 50; //line height
	this.removeFromWorld = false;
	this.isDone = false;

	Entity.call(this, this.game, this.x, this.y);
}

VictoryStoryScroll3.prototype.draw = function () {
	var ctx = this.game.ctx;
	ctx.font = "24pt Impact";
	this.game.ctx.fillStyle = "Yellow";
	this.line = 0;

	this.game.ctx.textAlign = "center";
	this.game.ctx.fillText("Press Esc for Main Menu", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 50 + this.offset + this.lift, 650);
	this.game.ctx.fillText("Press Enter to Replay this level", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 100 + this.offset + this.lift, 650);
	this.game.ctx.fillText("Victory", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.line++;
	this.game.ctx.fillText("The Queen of the Space lice is Dead", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.game.ctx.fillText("Hopefully with the death of their Great Queen, the space lice will stop fighting.", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.game.ctx.fillText("Our scientists say the Humans were Controlling the Queen with evil Technology", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.line++;
	this.game.ctx.fillText("Its typical earthling behavior to eslave and demote others.", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("Our forces have taken a beating while you were away from the front lines Killing the Queen", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("With your Return to the front lines however we are confident earth will Fall", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.line++;
	this.game.ctx.fillText("The Humans are now without Allies in the Sol system", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("Earth is weak, and it is time for them to pay for what they did to Pluto.", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("Remember our rallying Cry: Earth Will Pay!", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.line++;
	this.game.ctx.fillText("Thanks for playing, come back later for more content!", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);

	Entity.prototype.draw.call(this);
}

VictoryStoryScroll3.prototype.update = function () {
	this.lift += -1; //negative makes it go up
	//this.narrow *= 2; //adjust to allow for in-to-screen scroll
	if(this.lift === -1400 || this.game.menu) {
		console.log("ended the scroll");
		this.game.select = false;
		this.isDone = true;
		this.game.menu = true;
		this.removeFromWorld = true;
		this.game.sceneManager.reset();
		this.game.sceneManager.currentScene = new SplashScene(this.game);
	}
	Entity.prototype.update.call(this);
}

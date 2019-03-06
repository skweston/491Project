/* ========================================================================================================== */
// Level Manager stuff
/* ========================================================================================================== */
function SceneManager(game) {
	this.game = game;

	//Always starts at title scene
	console.log("Game Start");
	this.currentScene = new SplashScene(this.game);
}

SceneManager.prototype.constructor = SceneManager;

SceneManager.prototype.reset = function () {
	this.game.running = false;
	//this.game.clicked = false;
	this.game.playerResources = 0;
	this.game.enemyResources = 0;
	this.game.ship.health = 100;

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
}

SceneManager.prototype.update = function () {
	//console.log("health: " + this.game.ship.health);
	//sconsole.log("current: " + this.currentScene.name);
	if (!this.game.running && this.game.gameStart) {
		this.game.gameStart = false;
	}

	//console.log("menu: " + this.game.menu);

	if(this.game.menu === true) {
		this.game.menu = false;
		this.reset();
		this.changeScenes(new SplashScene(this.game));
	}

	if(this.game.tutrl === true) {
		this.game.tutrl = false;
		this.reset();
		this.changeScenes(new TutorialScene(this.game));
	}

	if(this.game.level === true) {
		console.log("level");
		this.game.level = false;
		this.reset();
		this.changeScenes(new StoryScrollScene(this.game));
	}
}

SceneManager.prototype.loadPlayer = function () {
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

	for(var i = 0; i < this.currentScene.entities.length; i++) {
		this.currentScene.entities[i].removeFromWorld = true;
	}

	this.currentScene = newScene;
}

//Every playable level needs a hud.
function HUD(game) {
	this.name = "Element";

	this.rollIcon = new Animation(AM.getAsset("./img/hudRollIcon.png"), 128, 128, 1408, 0.15, 11, true, 0.5);
	this.laserIcon = new Animation(AM.getAsset("./img/hudLaserIcon.png"), 128, 128, 256, 0.15, 2, true, 0.5);
	this.waveIcon = new Animation(AM.getAsset("./img/hudWaveIcon.png"), 128, 128, 256, 0.15, 2, true, 0.5);
	this.bulletIcon = new Animation(AM.getAsset("./img/hudBulletIcon.png"), 128, 128, 256, 0.15, 2, true, 0.5);
	this.burstIcon = new Animation(AM.getAsset("./img/hudBurstIcon.png"), 128, 128, 256, 0.15, 2, true, 0.5);
	this.missileIcon = new Animation(AM.getAsset("./img/hudMissileIcon.png"), 128, 128, 256, 0.15, 2, true, 0.5);
	this.homingIcon = new Animation(AM.getAsset("./img/hudHomingIcon.png"), 128, 128, 256, 0.15, 2, true, 0.5);
	this.chargeIcon = new Animation(AM.getAsset("./img/hudChargeIcon.png"), 128, 128, 256, 0.15, 2, true, 0.5);
	this.orbiterIcon = new Animation(AM.getAsset("./img/hudOrbiterIcon.png"), 128, 128, 256, 0.15, 2, true, 0.5);

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

HUD.prototype.draw = function() {
	// HUD top back panel
	this.game.ctx.fillStyle = "DimGrey";
	this.game.ctx.fillRect(this.game.camera.x, this.game.camera.y, 402, 114);
	this.game.ctx.fillRect(this.game.camera.x + 390, this.game.camera.y, 420, 66);
	this.game.ctx.fillRect(this.game.camera.x + 798, this.game.camera.y, 402, 114);

	this.game.ctx.fillStyle = "LightSlateGrey";
	this.game.ctx.fillRect(this.game.camera.x, this.game.camera.y, 400, 112);
	this.game.ctx.fillRect(this.game.camera.x + 390, this.game.camera.y, 420, 64);
	this.game.ctx.fillRect(this.game.camera.x + 800, this.game.camera.y, 400, 112);

	this.game.ctx.fillStyle = "DimGrey";
	this.game.ctx.fillRect(this.game.camera.x + 14, this.game.camera.y + 14, 372, 36);
	this.game.ctx.fillRect(this.game.camera.x + 14, this.game.camera.y + 62, 372, 36);
	this.game.ctx.fillStyle = "Black";
	this.game.ctx.fillRect(this.game.camera.x + 16, this.game.camera.y + 16, 368, 32);
	this.game.ctx.fillRect(this.game.camera.x + 16, this.game.camera.y + 64, 368, 32);
	this.game.ctx.fillStyle = "DarkRed";
	this.game.ctx.fillRect(this.game.camera.x + 16, this.game.camera.y + 16, 368 * this.game.ship.health / this.game.ship.healthMax, 32);
	this.game.ctx.fillStyle = "DarkBlue";
	this.game.ctx.fillRect(this.game.camera.x + 16, this.game.camera.y + 64, 368 * this.game.ship.boost / this.game.ship.boostMax, 32);
	
	// HUD text fields
	this.game.ctx.font = "16pt Impact";
	this.game.ctx.fillStyle = "White";
	this.game.ctx.textAlign = "center";
	this.game.ctx.fillText("Hull Integrity", this.game.camera.x + 200, this.game.camera.y + 40);
	this.game.ctx.fillText("Boost Fuel", this.game.camera.x + 200, this.game.camera.y + 88);
	this.game.ctx.fillText("Score", this.game.camera.x + 600, this.game.camera.y + 24);
	this.game.ctx.fillStyle = "Black";
	this.game.ctx.strokeText("Hull Integrity", this.game.camera.x + 200, this.game.camera.y + 40);
	this.game.ctx.strokeText("Boost Fuel", this.game.camera.x + 200, this.game.camera.y + 88);
	this.game.ctx.strokeText("Score", this.game.camera.x + 600, this.game.camera.y + 24);
	this.game.ctx.font = "24pt Impact";
	this.game.ctx.fillStyle = "White";
	this.game.ctx.fillText(SCORE, this.game.camera.x + 600, this.game.camera.y + 56);
	this.game.ctx.fillStyle = "Black";
	this.game.ctx.strokeText(SCORE, this.game.camera.x + 600, this.game.camera.y + 56);

	// Weapon Display
	this.game.ctx.fillStyle = "DimGrey";
	this.game.ctx.fillRect(this.game.camera.x + 958, this.game.camera.y + 22, 68, 68);
	this.game.ctx.fillRect(this.game.camera.x + 1038, this.game.camera.y + 22, 68, 68);
	this.game.ctx.fillRect(this.game.camera.x + 1118, this.game.camera.y + 22, 68, 68);
	this.game.ctx.fillStyle = "rgba(128, 128, 128, 0.5)";
	this.rollIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 960, this.game.camera.y + 24, 0);
	this.game.ctx.fillRect(this.game.camera.x + 960, this.game.camera.y + 24, 64 * this.game.ship.rollCooldown / 100 , 64);

	if (this.game.ship.primaryType === 0) {
		this.laserIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 1040, this.game.camera.y + 24, 0);
	}
	else if (this.game.ship.primaryType === 1) {
		this.waveIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 1040, this.game.camera.y + 24, 0);
	}
	else if (this.game.ship.primaryType === 2) {
		this.bulletIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 1040, this.game.camera.y + 24, 0);
	}
	else {
		this.burstIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 1040, this.game.camera.y + 24, 0);
	}

	if (this.game.ship.secondaryType === 0) {
		this.missileIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 1120, this.game.camera.y + 24, 0);
	}
	else if (this.game.ship.secondaryType === 1) {
		this.homingIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 1120, this.game.camera.y + 24, 0);
	}
	else if (this.game.ship.secondaryType === 2) {
		this.chargeIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 1120, this.game.camera.y + 24, 0);
	}
	else {
		this.orbiterIcon.drawFrame(this.game.clockTick, this.ctx, this.game.camera.x + 1120, this.game.camera.y + 24, 0);
	}

	this.game.ctx.font = "16pt Impact";
	this.game.ctx.fillStyle = "White";
	this.game.ctx.fillText("Laser", this.game.camera.x + 1072, this.game.camera.y + 112);















	// HUD minimap
	this.game.ctx.fillStyle = "rgba(176, 196, 222, 0.5)";
	this.game.ctx.fillRect(this.game.camera.x + 934, this.game.camera.y + 534, 250, 250);


	//Player resource counter
	// this.game.ctx.fillText("Player Faction Resources: " + this.game.playerResources,this.game.camera.x + 200, this.game.camera.y + 40);

	// Return to main menu
	this.game.ctx.font = "24pt Impact";
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

	//This needs to flicker
	this.game.ctx.fillText("Press V to Play Level 1", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 600, 500);
	this.game.ctx.fillText("Press O to Play Tutorial", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 650, 500);

	Entity.prototype.draw.call(this);
}

TitleEffect.prototype.update = function () {

	Entity.prototype.update.call(this);
}

function SplashScene(game) {
	this.name = "Splash";
	this.game = game;
	this.entities = [];

	this.background = new MainBackground(this.game, AM.getAsset("./img/plutoSplash.png"));
	this.game.addEntity(this.background);
	this.entities.push(this.background);

	this.title = new TitleEffect(game);
	this.game.addEntity(this.title);
	this.entities.push(this.title);

	this.scroll = null;
}

SplashScene.prototype.constructor = SplashScene;

function TutorialScene(game) {
	this.name = "Tutorial";
	this.game = game;
	this.ctx = this.game.ctx;
	this.entities = [];

	this.background = new MainBackground(this.game, AM.getAsset("./img/level1main.png"));
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

	Entity.call(this, this.game, this.x, this.y);
}

HowTo.prototype.update = function() {
	/*if(false) {
		this.isDone = true;
		//this.removeFromWorld = true; - Will be in changeScenes
	}*/

	Entity.prototype.update.call(this);
}

HowTo.prototype.draw = function() {
	var ctx = this.game.ctx;
	ctx.font = "26pt Impact";
	this.game.ctx.fillStyle = "Grey";
	this.offset = 35;
	this.line = 2;

	this.game.ctx.textAlign = "center";
	this.game.ctx.fillText("Welcome to SPACEFIGHT!", 600, (this.offset * this.line++), 800);
	this.game.ctx.fillText("Your goal is to take revenge on Earth for demoting", 600, (this.offset * this.line++), 800);
	this.game.ctx.fillText("the seat of the Empire to \"dwarf\" planet.", 600, (this.offset * this.line++), 800);
	this.game.ctx.fillText("As you travel to Earth, your caravan will build bases,", 600, (this.offset * this.line++), 800);
	this.game.ctx.fillText("harvest materials and fight the scum of the Sol System.", 600, (this.offset * this.line), 800);

	this.point = this.line;


	//Basic Controls
	this.offset = 30;
	this.line += 3;
	this.game.ctx.textAlign = "left";
	this.game.ctx.fillStyle = "Blue";
	ctx.font = "22pt Impact";
	this.game.ctx.fillText("To Move: W A S D", 0, (this.offset * this.line++), 400);
	this.game.ctx.fillText("To Dodge: SPACEBAR", 0, (this.offset * this.line++), 400);
	this.game.ctx.fillText("To Boost Speed: SHIFT", 0, (this.offset * this.line++), 400);
	this.game.ctx.fillText("To aim: Place cursor on target", 0, (this.offset * this.line++), 400);
	this.game.ctx.fillText("To Shoot Primary Weapon: Left Click", 0, (this.offset * this.line++), 400);
	this.game.ctx.fillText("To Shoot Secondary Weapon: Right Click", 0, (this.offset * this.line++), 400);
	this.game.ctx.fillText("Cycle Primary Weapons: 1", 0, (this.offset * this.line++), 400);
	this.game.ctx.fillText("Cycle Secondary Weapons: 2", 0, (this.offset * this.line++), 400);
	this.game.ctx.fillText("Return to Menu at Anytime: ESC", 0, (this.offset * this.line++), 400);

	//Weapons
	/*
	this.game.ctx.textAlign = "right";
	this.game.ctx.fillText("Primary Weapons", 1200, (this.offset * this.point++), 550);
	this.game.ctx.fillText("Laser", 1200, (this.offset * this.point++), 550);
	this.game.ctx.fillText("Wave", 1200, (this.offset * this.point++), 550);
	this.game.ctx.fillText("Bullet", 1200, (this.offset * this.point++), 550);
	this.game.ctx.fillText("Burst", 1200, (this.offset * this.point++), 550);
	this.game.ctx.fillText("", 1200, (this.offset * this.point++), 550); //blank line
	this.game.ctx.fillText("Secondary Weapons", 1200, (this.offset * this.point++), 550);
	this.game.ctx.fillText("Missle", 1200, (this.offset * this.point++), 550);
	this.game.ctx.fillText("Homing Missle", 1200, (this.offset * this.point++), 550);
	this.game.ctx.fillText("Orbiters", 1200, (this.offset * this.point++), 550);
	this.game.ctx.fillText("Charge Shot", 1200, (this.offset * this.point++), 550);
	this.game.ctx.fillText("", 1200, (this.offset * this.point++), 550); //blank line
	this.game.ctx.fillText("In Game Power Ups", 1200, (this.offset * this.point++), 550);
	this.game.ctx.fillText("Spreader", 1200, (this.offset * this.point++), 550);
	this.game.ctx.fillText("Repair", 1200, (this.offset * this.point++), 550);
	this.game.ctx.fillText("", 1200, (this.offset * this.point++), 550);
	this.game.ctx.fillText("", 1200, (this.offset * this.point++), 550); //blank wline
	this.game.ctx.fillText("Enemies", 1200, (this.offset * this.point++), 550);
	this.game.ctx.fillText("", 1200, (this.offset * this.point++), 550);
	this.game.ctx.fillText("", 1200, (this.offset * this.point++), 550);
	*/

	this.game.ctx.textAlign = "right";
	ctx.font = "24pt Impact";
	//Stays in bottom right corner of screen
	this.game.ctx.fillText("Main Menu: ESC", this.game.camera.x + 1200, this.game.camera.y + 800, 650);

	Entity.prototype.draw.call(this);
}

function StoryScrollScene(game) {
	console.log("scroll");
	this.name = "Scroll";
	this.game = game;
	this.entities = [];
	this.background = new MainBackground(this.game, AM.getAsset("./img/plutoSplash.png"));
	this.game.addEntity(this.background);
	this.entities.push(this.background);
	this.scroll = new StoryScroll1(this.game, this.leve);
	this.entities.push(this.scroll);
	this.game.addEntity(this.scroll);
}

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
	console.log("scroll update");
	this.lift += -1; //negative makes it go up
	//this.narrow *= 2; //adjust to allow for in-to-screen scroll
	if(this.lift === -1400 || this.game.clicked) {
		this.game.clicked = false;
		this.isDone = true;
		//To test new level, swap level here.
		this.removeFromWorld = true;
		var level = new PrototypeLevel(this.game);
		this.game.sceneManager.changeScenes(level);
		this.game.addEntity(level);
	}
	Entity.prototype.update.call(this);
}

function PrototypeLevel(game) {
	console.log("prototype");
	this.name = "Level";
	this.game = game;
	this.bossTimerStart = 1000;
	this.bossTimer = 0;
	this.spawnNum = 1;
	this.spawnTimerStart = 100;
	this.counter = 0;

	this.entities = [];
	this.background = new MainBackground(this.game, AM.getAsset("./img/level1main.png"));
	this.game.addEntity(this.background);
	this.entities.push(this.background);
	this.layer1 = new BackgroundLayer(this.game, AM.getAsset("./img/PScroll1/Background3k.png"));
	this.game.addEntity(this.layer1);
	this.entities.push(this.layer1);
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

	this.rock1.hasbase = true;
	this.rock1.base = this.playerSpaceStation;


	//this spawns the enemy base
	this.rock2 = new Asteroid(this.game, 3000, 3000);
	this.game.addEntity(this.rock2);
	this.entities.push(this.rock2);

	this.enemySpaceStation = new AlienSpaceStation(this.game, 3000, 3000, this.rock2);
	this.game.addEntity(this.enemySpaceStation);
	this.entities.push(this.enemySpaceStation);

	this.rock2.hasbase = true;
	this.rock2.base = this.enemySpaceStation;

	var abuilder = new AlienBuilder(this.game, this.enemySpaceStation);
	this.enemySpaceStation.builders = 1;
	abuilder.x = 3500;
	abuilder.y = 3500;
	game.addEntity(abuilder);

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
}

PrototypeLevel.prototype.update = function(){
	//this.removeFromWorld = true;
	//console.log("health: " + this.game.ship.health);
	this.victory = true;

	if (this.game.ship.health < 1){
		//console.log("dead");
		//this.victory = false;
		this.victory = false;
		this.game.sceneManager.reset();
		this.game.sceneManager.changeScenes(new SplashScene(this.game));
		return;
	}

	for(var i = 0; i < this.game.terrain.length; i++){

		if(this.game.terrain[i].hasbase && this.game.terrain[i].base.name === "Enemy") {

			//this.removeFromWorld = false;
			this.victory = false;

		}
	}

	//if (this.removeFromWorld && !this.game.menu){
	console.log("victory: " + this.victory);
	if(this.victory) {
		this.game.sceneManager.reset();
		this.game.sceneManager.changeScenes(new VictoryScrollScene(this.game));
	}
}

PrototypeLevel.prototype.draw = function () {}
PrototypeLevel.prototype.constructor = PrototypeLevel;

function LevelOne() {
	this.bossTimer = 1000;
	this.spawnTimer = 0;
	this.spawnNum = 1;
	this.counter = 0;

	//background - or whatever background image we want
	this.background = new MainBackground(this.game, AM.getAsset("./img/4kBackground1.png"));
	this.hud = new HUD(this.game); //mandatory
	this.game.sceneManager.loadPlayer(); //mandatory
}

function VictoryScrollScene(game) {
	this.name = "VictoryScroll";
	this.game = game;
	this.entities = [];
	this.background = new MainBackground(this.game, AM.getAsset("./img/plutoSplash.png"));
	this.game.addEntity(this.background);
	this.entities.push(this.background);
	this.scroll = new VictoryStoryScroll1(this.game, this.leve);
	this.entities.push(this.scroll);
	this.game.addEntity(this.scroll);

	for (var i = 0; i < this.game.levels.length; i++) {
		this.game.levels[i].removeFromWorld = true;
	}

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
	this.game.ctx.fillText("Press Enter to Skip", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 50 + this.offset + this.lift, 650);
	this.game.ctx.fillText("Victory", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.line++;
	this.game.ctx.fillText("Victory in the Kuiper Belt over the space lice was not without losses.", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.game.ctx.fillText("Many Plutonians died not only in the fighting but in the mines", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.game.ctx.fillText("as a great deal of resources were required for the war effort.", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650 + this.narrow);
	this.line++;
	this.game.ctx.fillText("Plutonian's are used to the losses that come with a prolonged war,", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("Since 2006 they have become hardened. Ready to accept tremendous losses", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("their people are united under a singular and abiding message “Earth will pay.”", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.line++;
	this.game.ctx.fillText("Thanks for playing our game, and congrats on beating the first level", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("Come back soon to experience new and glorious content,", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);
	this.game.ctx.fillText("For now though, care for another go?", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + this.start + (this.offset * this.line++) + this.lift, 650);

	Entity.prototype.draw.call(this);
}

VictoryStoryScroll1.prototype.update = function () {
	this.lift += -1; //negative makes it go up
	//this.narrow *= 2; //adjust to allow for in-to-screen scroll
	if(this.lift === -1400 || this.game.clicked) {
		this.game.clicked = false;
		this.isDone = true;
		//To test new level, swap level here.
		//this.removeFromWorld = true;
		var level = new SplashScene(this.game);
		this.game.sceneManager.changeScenes(level);
		this.game.addEntity(level);
	}
	Entity.prototype.update.call(this);
}

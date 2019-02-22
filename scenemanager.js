/* ========================================================================================================== */
// Level Manager stuff
/* ========================================================================================================== */
function SceneManager(game) {
	this.game = game;
	//Always starts at title scene
	this.currentScene = new SplashScene(this.game);
}

SceneManager.prototype.constructor = SceneManager;

SceneManager.prototype.reset = function () {
	this.game.running = false;
	this.game.clicked = false;
	this.game.playerResources = 0;
	this.game.enemyResources = 0;

	for (var i = 0; i < this.game.extras.length; i++) {
		this.game.extras[i].removeFromWorld = true;
	}
	for (var i = 0; i < this.game.allies.length; i++) {
		this.game.allies[i].removeFromWorld = true;
	}
	for (var i = 0; i < this.game.enemies.length; i++){
		this.game.enemies[i].removeFromWorld = true;
	}
	for(var i = 0; i< this.game.enemyProjectiles.length; i++){
		this.game.enemyProjectiles[i].removeFromWorld = true;
	}
	for(var i = 0; i< this.game.playerProjectiles.length; i++){
		this.game.playerProjectiles[i].removeFromWorld = true;
	}
	for(var i = 0; i< this.game.resources.length; i++){
		this.game.resources[i].removeFromWorld = true;
	}
	for (var i = 0; i < this.game.effects.length; i++) {
		this.game.effects[i].removeFromWorld = true;
	}

	var ship = new TheShip(this.game);
	var reticle = new Reticle(this.game);
	this.game.addEntity(ship);
	this.game.addEntity(reticle);
	this.game.ship = ship;

	//back to title screen on death
	this.changeScenes(new SplashScene(this.game));
}

SceneManager.prototype.update = function () {
	if (!this.game.running && this.game.gameStart) {
		this.changeScenes(new StoryScrollScene(game));
		this.game.gameStart = false;
	}


//	this.spawnAtRandom();

	if (this.game.ship.health < 1) {
		//var audio = document.createElement('audio');
		//audio.src = "./img/Die.wav";
		//audio.play();
		this.reset();
	}
}

SceneManager.prototype.loadPlayer = function () {
	this.game.running = true;
	this.game.ship.health = 100;
	SCORE = 0;
}

SceneManager.prototype.changeScenes = function (newScene) {
	for(var i = 0; i < this.currentScene.entities.length; i++) {
		this.currentScene.entities[i].removeFromWorld = true;
	}

	this.currentScene = newScene;
}

SceneManager.prototype.spawnAtRandom = function () {
	if (this.currentScene.spawnTimer > 0) {
		this.currentScene.spawnTimer--;
	}
	if (this.game.running && this.currentScene.spawnTimer === 0) {
		this.currentScene.spawnTimer = this.currentScene.spawnTimerStart;

		for (var i = 0; i < this.currentScene.spawnNum; i++) {
			var border = 0;
			var x = Math.random() * this.game.ctx.canvas.width;
			var y = 0;

			border = Math.floor((Math.random() * 2));

			if (border === 0) {
				x = (Math.random() * 1000) - 100;
				y = (Math.random() * 100);

				if (y < 50) { // top
					y = -50 - y;
				}
				else { // bottom
					y = this.game.ctx.canvas.height + y;
				}
			}
			else {
				y = (Math.random() * 1000) - 100;
				x = (Math.random() * 100);

				if (x < 50) { // left
					x = -50 - x;
				}
				else { // right
					x = this.game.ctx.canvas.width + x;
				}
			}

			this.currentScene.randomSpawns(x, y);
			this.currentScene.counter++;
		}

		if (this.currentScene.counter % 10 === 0) {
			this.currentScene.spawnNum++;
		}
	}
}

//Every playable level needs a hud.
function HUD(game) {
	this.name = "Element";
	this.game = game;
	this.removeFromWorld = false;
}

HUD.prototype.draw = function() {
	this.game.ctx.font = "24pt Impact";
	this.game.ctx.fillStyle = "Red";
	this.game.ctx.textAlign = "left";
	this.game.ctx.fillText("Health: " + this.game.ship.health,  this.game.camera.x + 10, this.game.camera.y + 40);
	this.game.ctx.fillText("Score: " + SCORE, this.game.camera.x + 10, this.game.camera.y + 70);

	//Boost meter
	this.game.ctx.fillText("Boost Meter: ",this.game.camera.x + 10, this.game.camera.y + 100);
	this.game.ctx.strokeRect(this.game.camera.x + 10, this.game.camera.y + 105, 200, 20);
	this.game.ctx.fillRect(this.game.camera.x + 10, this.game.camera.y + 105, this.game.ship.boost/5, 20);

	//Player resource counter
	this.game.ctx.fillText("Player Faction Resources: " + this.game.playerResources,this.game.camera.x + 200, this.game.camera.y + 40);



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
	this.game.ctx.fillText("Press V to Play", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 600, 500);

	Entity.prototype.draw.call(this);
}

TitleEffect.prototype.update = function () {

	Entity.prototype.update.call(this);
}

function SplashScene(game) {
	this.game = game;
	this.entities = [];

	this.background = new MainBackground(this.game, AM.getAsset("./img/splash.png"));
	this.game.addEntity(this.background);
	this.entities.push(this.background);

	this.title = new TitleEffect(game);
	this.game.addEntity(this.title);
	this.entities.push(this.title);

	this.scroll = null;
}

SplashScene.prototype.constructor = SplashScene;


function StoryScrollScene(game) {
	this.game = game;
	this.entities = [];
	this.background = new MainBackground(this.game, AM.getAsset("./img/splash.png"));
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

	this.entities = [];
	this.background = new MainBackground(this.game, AM.getAsset("./img/splash.png"));
	this.game.addEntity(this.background);
	this.entities.push(this.background);

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
	this.lift += -1; //negative makes it go up
	//this.narrow *= 2; //adjust to allow for in-to-screen scroll
	if(this.lift === -1400 || this.game.clicked) {
		this.isDone = true;
		//To test new level, swap level here.
		this.game.sceneManager.changeScenes(new PrototypeLevel(this.game));
	}
	Entity.prototype.update.call(this);
}

function PrototypeLevel(game) {
	this.game = game;
	this.bossTimerStart = 1000;
	this.bossTimer = 0;
	this.spawnNum = 1;
	this.spawnTimerStart = 100;
	this.spawnTimer = this.spawnTimerStart;
	this.counter = 0;



	this.entities = [];
	this.background = new MainBackground(this.game, AM.getAsset("./img/4kBackground1.png"));
	this.game.addEntity(this.background);
	this.entities.push(this.background);
	this.layer1 = new BackgroundLayer(this.game, AM.getAsset("./img/PScroll1/cloud.png"));
	this.game.addEntity(this.layer1);
	this.entities.push(this.layer1);
	this.layer2 = new BackgroundLayer(this.game, AM.getAsset("./img/PScroll1/comet.png"));
	this.game.addEntity(this.layer2);
	this.entities.push(this.layer2);
	this.layer3 = new BackgroundLayer(this.game, AM.getAsset("./img/PScroll1/planet1.png"));
	this.game.addEntity(this.layer3);
	this.entities.push(this.layer3);
	this.layer4 = new BackgroundLayer(this.game, AM.getAsset("./img/PScroll1/planet2.png"));
	this.game.addEntity(this.layer4);
	this.entities.push(this.layer4);

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

	//Neutral rock
	this.rock3 = new Asteroid(this.game, 1600, 300);
	this.game.addEntity(this.rock3);
	this.entities.push(this.rock3);

	//Neutral rock
	this.rock4 = new Asteroid(this.game, 1600, 1600);
	this.game.addEntity(this.rock4);
	this.entities.push(this.rock4);

	this.game.playerResources = 1100;
	this.game.enemyResources = 1000;

	this.hud = new HUD(this.game); //mandatory
	this.game.addEntity(this.hud);
	this.entities.push(this.hud);
	this.game.sceneManager.loadPlayer(); //mandatory


}

PrototypeLevel.prototype.randomSpawns = function (x, y) {
	var newSpawn;
	if(Math.random() * 100 < 50){
		newSpawn = new Scourge(this.game, AM.getAsset("./img/scourge.png"), x, y);
	}else{
		// console.log("Spawning a resource gatherer");
		newSpawn = new BiologicalResourceGatherer(this.game);
		//newSpawn = new Leech(this.game, AM.getAsset("./img/Leech.png"), y, x);
	}

	this.entities.push(newSpawn);
	this.game.addEntity(newSpawn);
}

PrototypeLevel.prototype.addBoss = function () {
	this.boss = new Boss1(game);
	this.game.addEntity(this.boss);
	this.entities.push(this.boss);
}

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

//LevelOne.prototype.randomSpawns = function (x, y) {

//LevelOne.prototype.addBoss = function () {

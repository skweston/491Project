/* ========================================================================================================== */
// Level Manager stuff
/* ========================================================================================================== */
function SceneManager(game) {
	this.game = game;
	this.currentScene = new SplashScene(this.game);
}

SceneManager.prototype.constructor = SceneManager;

SceneManager.prototype.reset = function () {
	this.game.running = false;
	this.game.clicked = false;

	for (var i = 0; i < this.game.extras.length; i++) {
		this.game.extras[i].removeFromWorld = true;
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

	var ship = new TheShip(this.game);
	var reticle = new Reticle(this.game);
	this.game.addEntity(ship);
	this.game.addEntity(reticle);
	this.game.ship = ship;

	this.currentScene = new SplashScene(this.game);
}

SceneManager.prototype.update = function () {
	//console.log("scene update");
	if (!this.game.running && this.game.gameStart) {
		//console.log("switch");
		this.changeScenes(new PrototypeLevel(this.game));
		this.game.ship.health = 100;
		SCORE = 0;
		this.game.running = true;
		this.game.gameStart = false;
	}
	if (this.currentScene.bossTimer > 0){
		this.currentScene.bossTimer--;
	}
	if (this.game.running && this.currentScene.bossTimer === 0) {
		this.currentScene.bossTimer = this.currentScene.bossTimerStart;
		this.game.addEntity(this.currentScene.boss);
	}


	this.spawnAtRandom();

	if (this.game.ship.health < 1) {
		//var audio = document.createElement('audio');
		//audio.src = "./img/Die.wav";
		//audio.play();
		this.reset();
	}
}

SceneManager.prototype.changeScenes = function (newScene) {
	for(var i = 0; i < this.currentScene.entities.length; i++) {
		this.currentScene.entities[i].removeFromWorld = true;
	}

	this.currentScene = newScene;
}

SceneManager.prototype.spawnAtRandom = function () {
	//console.log("spawnAtRandom");
	if (this.currentScene.spawnTimer > 0) {
		this.currentScene.spawnTimer--;
	}
	if (this.game.running && this.currentScene.spawnTimer === 0) {
		this.currentScene.spawnTimer = this.currentScene.spawnTimerStart;
		//console.log("spawnAtRandom");

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

			//this.game.addEntity(new Scourge(this.game, AM.getAsset("./img/scourge.png"), x, y));
			//this.game.addEntity(this.currentLevel.random(x, y));
			//console.log("asking for random");
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
	//console.log(this.game);
	//console.log("hud");
}

HUD.prototype.draw = function() {
	//console.log("draw");
	this.game.ctx.font = "24pt Impact";
	this.game.ctx.fillStyle = "Red";
	this.game.ctx.textAlign = "left";
	this.game.ctx.fillText("Health: " + this.game.ship.health,  this.game.camera.x + 10, this.game.camera.y + 40);
	this.game.ctx.fillText("Score: " + SCORE, this.game.camera.x + 10, this.game.camera.y + 70);
	//Boost meter
	this.game.ctx.fillText("Boost Meter: ",this.game.camera.x + 10, this.game.camera.y + 100);
	this.game.ctx.strokeRect(this.game.camera.x + 10, this.game.camera.y + 105, 200, 20);
	this.game.ctx.fillRect(this.game.camera.x + 10, this.game.camera.y + 105, this.game.ship.boost/5, 20);

	Entity.prototype.draw.call(this);
}

HUD.prototype.update = function () {
	Entity.prototype.update.call(this);
}

//SPACEFIGHT title object for SplashScreen
function TitleEffect(game) {
	this.name = "Element"; //maybe we need a new list for scene elements?
	this.pWidth = 800;
	this.pHeight = 538;
	this.scale = 1;

	this.animation = new Animation(AM.getAsset("./img/SPACEFIGHT.png"),
								 this.pWidth, this.pHeight,
								 2, 0.1, 12,
								 true, this.scale);

	this.game = game;
	this.ctx = game.ctx;

	this.x = (this.game.cameraCtx.canvas.width / 2) - (this.pWidth / 2);
	this.y = (this.game.cameraCtx.canvas.height / 3) - (this.pHeight / 2);
	this.angle = 0;
	this.removeFromWorld = false; //there needs to be SOME way to make this true;

	Entity.call(this, this.game, this.x, this.y);
}

TitleEffect.prototype.draw = function () {
	if(onCamera(this)){
		//console.log("draw")
		//console.log(this.animation.currentFrame());
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}

	var ctx = this.game.ctx;
	ctx.font = "24pt Impact";
	this.game.ctx.fillStyle = "Blue";

	this.game.ctx.textAlign = "center";
	//console.log(game);
	this.game.ctx.fillText("Super Plutonian Ace Command Earth Fighting Inter-Galactic Hero Team", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 400, 500);

	//This neds to flicker
	this.game.ctx.fillText("Press V to Play", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 600, 500);
	//this.game.ctx.draw();

	Entity.prototype.draw.call(this);
}

TitleEffect.prototype.update = function () {

	Entity.prototype.update.call(this);
}

function SplashScene(game) {
	//console.log("here: " + game.currentScene);
	this.game = game;
	this.entities = [];

	this.background = new Background(this.game, AM.getAsset("./img/4kBackground1.png"));
	this.game.addEntity(this.background);
	this.entities.push(this.background);

	this.title = new TitleEffect(game);
	this.game.addEntity(this.title);
	this.entities.push(this.title);
}	

SplashScene.prototype.constructor = SplashScene;


function PrototypeLevel(game) {
	this.game = game;
	this.boss = new Boss1(game);
	//this only allows for one type of random spawn per level at the moment
	this.bossTimerStart = 1000;
	this.bossTimer = this.bossTimeStart;
	this.spawnNum = 1;
	this.spawnTimerStart = 100;
	this.spawnTimer = this.spawnTimerStart;
	this.counter = 0;

	this.entities = [];
	this.background = new Background(this.game, AM.getAsset("./img/4kBackground1.png"));
	this.game.addEntity(this.background);
	this.entities.push(this.background);

	this.hud = new HUD(this.game);
	this.game.addEntity(this.hud);
	this.entities.push(this.hud);
}

PrototypeLevel.prototype.randomSpawns = function (x, y) {
	var newSpawn;
	if(Math.random()*100<50){
		newSpawn = new Scourge(this.game, AM.getAsset("./img/scourge.png"), x, y);
		//console.log("scourge")
	}else{
		newSpawn = new Leech(this.game, AM.getAsset("./img/Leech.png"), y, x);
		//console.log("leech");
	}
	this.entities.push(newSpawn);
	this.game.addEntity(newSpawn);
}

PrototypeLevel.prototype.constructor = PrototypeLevel;

function LevelOne() {
	this.bossTimer = 1000;
	this.spawnTimer = 0;
	this.spawnNum = 1;
	this.counter = 0;
}

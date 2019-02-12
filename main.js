// useful global things here
var SHOW_HITBOX = false;
var SCORE = 0;

/*
function distance(a, b) {
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy);
}*/

//collision - objects must have xMid, yMid and a radius defined.
function distance(a, b) {
	var dx = a.xMid - b.xMid;
	var dy = a.yMid - b.yMid;
	//console.log("a: " + a.xMid + ", " + a.yMid);
	//console.log("b: " + b.xMid + ", " + b.yMid);
	//console.log("distance: " + (dx * dx + dy * dy));
	return Math.sqrt(dx * dx + dy * dy);
}

function direction(a, b) {
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	var dist = Math.sqrt(dx * dx + dy * dy);
	if(dist > 0) return { x: dx / dist, y: dy / dist }; else return {x:0,y:0};
}

function Collide(a, b) {
	//console.log("checking collision");
	return distance(a, b) < a.radius + b.radius;
}

function onCamera(ent){
	this.game = ent.game;
	this.camera = this.game.camera;
	this.camera.width = this.game.camera.ctx.canvas.width;
	this.camera.height = this.game.camera.ctx.canvas.height;


	if (this.camera.x < ent.x + ent.pWidth * ent.scale &&
   this.camera.x + this.camera.width > ent.x &&
   this.camera.y < ent.y + ent.pHeight * ent.scale &&
   this.camera.y + this.camera.height > ent.y) {
	    return true;// collision detected!
	}




	return false;
}
/* ========================================================================================================== */
// Entity Template
/* ========================================================================================================== */
/*
function sampleEntity(game, extraInputVarial, extraInputVarialTwo) {


	this.pWidth = Interger width Of Single Frame of Animation;
	this.pHeight = Interger height Of Single Frame of Animation;
	this.scale = the scaling factor for this entity;

  	Stuff gets passed into an animation object in this order:
  	spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale

	this.animation = new Animation(AM.getAsset("./img/NameOfAsset.png"),
								 this.pWidth, this.pHeight,
								 width of spriteSheet,  Duration Each Frame Lasts, # of Frames,
								 Boolean for looping, this.scale);



	this.game = game;
	this.ctx = game.ctx;
	this.name = "Effect" XOR "Level" XOR "Background" XOR "Player" XOR "Enemy" XOR
				"PlayerProjectile" XOR "EnemyProjectile" XOR "Extra" XOR "Effect";

	this.x = 0;
	this.y = 0;
	this.removeFromWorld = false; //there needs to be SOME way to make this true;
///////////Above this is MANDATORY for all entities////////////////////////
//If it's killable
	this.health = some magic number;

//this is for collision
	this.xMid = extraInputVarial;
	this.yMid = extraInputVarialTwo;
	this.radius = some magic number * this.scale;

//this is for movement
	this.speed = some magic number;

//this is for if it needs to decay off the lists, like an explostion
this.lifetime = 100; //when this reaches 0, it is removed from world

//Add other variables to objects for whatever added functionality you need
	this.sampleValue = sample Magic Number;



}

sampleEntity.prototype.draw = function () {
	if(onCamera(this)){
  		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
  	}
	Entity.prototype.draw.call(this);
}

sampleEntity.prototype.update = function () {

	//something likethis for an Effect
	this.lifetime--;
	if (this.lifetime < 1){
		this.removeFromWorld = true;
	}
	// update angle if you want it to point at the ship
	var dx = this.game.ship.xMid - this.xMid;
	var dy = this.yMid - this.game.ship.yMid;
	this.angle = -Math.atan2(dy,dx);

	// move the thing
	this.x += Math.cos(this.angle) * 10 * this.speed;
	this.y += Math.sin(this.angle) * 10 * this.speed;

	//update its hitbox
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;


	// check collision with player projectiles
	for (var i = 0; i < this.game.playerProjectiles.length; i++ ) {
		var ent = this.game.playerProjectiles[i];
		if (Collide(this, ent)) {
			this.health -= ent.damage;
			ent.removeFromWorld = true;
			var splatter = new BloodSplatter(this.game, this.xMid, this.yMid);
			splatter.angle = this.angle;
			this.game.addEntity (splatter);
			if (this.health < 1) {
				break;
			}
		}
	}

	// check collision with ship if it matters
	if (!this.game.ship.rolling && Collide(this, this.game.ship)) {
		this.game.ship.health -= this.damage;
		this.removeFromWorld = true;
	}

	// check health
	if (this.health < 1) {
		SCORE++; //how many points is it worth

		//does it drop a powerup?
		if (Math.random() * 100 < 20) { //the 20 here is the % chance it drops
			var spreader = new Spreader(this.game);
			spreader.x = this.xMid - (spreader.pWidth * spreader.scale / 2);
			spreader.y = this.yMid - (spreader.pHeight * spreader.scale / 2);
			spreader.xMid = this.xMid;
			spreader.yMid = this.yMid;

			this.game.addEntity(spreader);
		}

		this.removeFromWorld = true;
	}

	//does it blow up when it dies?
	if (this.removeFromWorld) {
		var explosion = new SpaceExplosion(this.game, this.xMid, this.yMid, this.angle);
		this.game.addEntity(explosion);
	}

	Entity.prototype.update.call(this);


}






*/
/*a list of powerups, things like multishot and such


/* ========================================================================================================== */
// Animation
/* ========================================================================================================== */

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.spriteSheet = spriteSheet;
	this.frameWidth = frameWidth;
	this.frameDuration = frameDuration;
	this.frameHeight = frameHeight;
	this.sheetWidth = sheetWidth;
	this.frames = frames;
	this.totalTime = frameDuration * frames;
	this.elapsedTime = 0;
	this.loop = loop;
	this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, angle, game) {
	this.elapsedTime += tick;
	if (this.isDone()) {
		if (this.loop) this.elapsedTime = 0;
	}
	var frame = this.currentFrame();
	var xindex = 0;
	var yindex = 0;
	xindex = frame % this.sheetWidth;
	yindex = Math.floor(frame / this.sheetWidth);

	var offscreenCanvas = document.createElement('canvas');
	var size = Math.max(this.frameWidth * this.scale, this.frameHeight * this.scale);
	var xOffset = 0;
	var yOffset = 0;

	if ((this.frameWidth * this.scale) > (this.frameHeight * this.scale)){
	  yOffset = (this.frameWidth * this.scale) - (this.frameHeight * this.scale);
	} else if ((this.frameWidth*this.scale) < (this.frameHeight * this.scale)) {
	  xOffset = (this.frameHeight * this.scale) - (this.frameWidth * this.scale);
	}

	offscreenCanvas.width = size;
	offscreenCanvas.height = size;
	var offscreenCtx = offscreenCanvas.getContext('2d');

	var thirdCanvas = document.createElement('canvas');
	thirdCanvas.width = size;
	thirdCanvas.height = size;
	var thirdCtx = thirdCanvas.getContext('2d');

	thirdCtx.drawImage(this.spriteSheet,
				 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
				 this.frameWidth, this.frameHeight,
				 0, 0,
				 this.frameWidth * this.scale,
				 this.frameHeight * this.scale);
	offscreenCtx.save();
	offscreenCtx.translate(size / 2, size / 2);
	offscreenCtx.rotate(angle);
	offscreenCtx.translate(0, 0);
	offscreenCtx.drawImage(thirdCanvas, -(this.frameWidth*this.scale / 2), -(this.frameHeight*this.scale / 2));
	offscreenCtx.restore();
	thirdCtx.clearRect(0,0, size, size);


	ctx.drawImage(offscreenCanvas, x-(xOffset/2), y- (yOffset/2));
	//offscreenCtx.clearRect(0,0, size, size);
}

Animation.prototype.currentFrame = function () {
	return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
	return (this.elapsedTime >= this.totalTime);
}



/* ========================================================================================================== */
// Camera
/* ========================================================================================================== */
function Camera(game){

	this.game = game;
	this.ctx = this.game.cameraCtx;
	this.x = this.game.ship.xMid - this.ctx.canvas.width/2;
	this.y = this.game.ship.yMid - this.ctx.canvas.height/2;
	this.isScrolling = false;
	this.deadzoneRatio = 3;


}
Camera.prototype.draw = function (cameraCtx) {
	cameraCtx.drawImage(this.game.ctx.canvas, this.x , this.y,
		 				this.ctx.canvas.width, this.ctx.canvas.height,
		 				0, 0,
						this.ctx.canvas.width, this.ctx.canvas.height);

	this.game.ctx.clearRect(0,0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
};

Camera.prototype.update = function () {
	// this.game.reticle.x =
	// this.game.reticle.y =
	// this.x = this.game.ship.xMid - this.ctx.canvas.width/2;
	// this.y = this.game.ship.yMid - this.ctx.canvas.height/2;



	//deadzone bounding box logic


	if(this.game.ship.xMid > this.x + this.ctx.canvas.width-(this.ctx.canvas.width/this.deadzoneRatio)){
		this.x = this.game.ship.xMid - (this.ctx.canvas.width-(this.ctx.canvas.width/this.deadzoneRatio));
		this.isScrolling = true;
	}
	if(this.game.ship.yMid > this.y + this.ctx.canvas.height-(this.ctx.canvas.height/this.deadzoneRatio)){
		this.y = this.game.ship.yMid - (this.ctx.canvas.height-(this.ctx.canvas.height/this.deadzoneRatio));
		this.isScrolling = true;
	}
	if(this.game.ship.xMid < this.x + (this.ctx.canvas.width/this.deadzoneRatio)){
		this.x = this.game.ship.xMid - (this.ctx.canvas.width/this.deadzoneRatio);
		this.isScrolling = true;
	}
	if(this.game.ship.yMid < this.y + (this.ctx.canvas.height/this.deadzoneRatio)){
		this.y = this.game.ship.yMid - (this.ctx.canvas.height/this.deadzoneRatio);
		this.isScrolling = true;
	}


	//bounds the edge of the background so we don't draw in the void
	if(this.x < 0){
		this.x = 0;
	}
	if(this.y < 0){
		this.y = 0;
	}
	if (this.x + this.ctx.canvas.width > (this.game.ctx.canvas.width)){
		this.x = this.game.ctx.canvas.width - this.ctx.canvas.width;
	}
	if (this.y + this.ctx.canvas.height > (this.game.ctx.canvas.height)){
		this.y = this.game.ctx.canvas.height - this.ctx.canvas.height;
	}



};

/* ========================================================================================================== */
// Background
/* ========================================================================================================== */
function Background(game, spritesheet) {

	this.name = "Background";

	this.spritesheet = spritesheet;
	this.game = game;
	this.ctx = game.ctx;
	this.ctx.canvas.width = this.spritesheet.naturalWidth;
	this.ctx.canvas.height = this.spritesheet.naturalHeight;

	// Where the frame starts for the background. Divide image in half then subract the half the canvas,
	// for both sx and sy. (i.e: 5600 / 2 - 800 / 2 = 2400) Allowing ship to fit to the exact middle.
	this.sx = spritesheet.naturalWidth / 2 - this.ctx.canvas.width / 2;
	this.sy = spritesheet.naturalHeight / 2 - this.ctx.canvas.height / 2;

	// This is the location to draw the background
	this.dx = 0;
	this.dy = 0;

	// This is the current canvas snapshot of the level
	this.frameWidth = this.ctx.canvas.width;
	this.frameHeight = this.ctx.canvas.height;

	if (spritesheet.width - this.sx < this.frameWidth) {
		this.frameWidth = this.spritesheet.width - this.sx;
	}
	if (spritesheet.height - this.sy < this.frameHeight) {
		this.frameHeight = this.spritesheet.height - this.sy;
	}

	this.dWidth = this.frameWidth;
	this.dHeight = this.frameHeight;


};

Background.prototype.draw = function () {
	this.ctx.drawImage(this.spritesheet,
		   this.sx, this.sy,
		   this.frameWidth, this.frameHeight,
				   this.dx, this.dy,
		   this.dWidth, this.dHeight);
};

Background.prototype.update = function () {



};



/* ========================================================================================================== */
// Asset Manager aka Main
/* ========================================================================================================== */

var AM = new AssetManager();

AM.queueDownload("./img/space1-1.png");
AM.queueDownload("./img/Uberspace.png");
AM.queueDownload("./img/4kBackground1.png");
AM.queueDownload("./img/4kBackground2.png");
AM.queueDownload("./img/BloodSplatter.png");
// ship stuff
AM.queueDownload("./img/shipIdle.png");
AM.queueDownload("./img/shipBoost.png");
AM.queueDownload("./img/shipRoll.png");
AM.queueDownload("./img/shipBoostRoll.png");
AM.queueDownload("./img/shipReticle.png");
AM.queueDownload("./img/shipPrimary1.png");
AM.queueDownload("./img/shipSecondary1.png");

//drops and powerups
AM.queueDownload("./img/RepairDrop.png");
AM.queueDownload("./img/spreader.png");

// enemies
AM.queueDownload("./img/Boss1.png");
AM.queueDownload("./img/BossTurret.png");
AM.queueDownload("./img/LaserBlast.png");
AM.queueDownload("./img/BossExplosion.png");
AM.queueDownload("./img/Leech.png");

AM.queueDownload("./img/scourge.png");
AM.queueDownload("./img/SpawnDoor.png");

AM.queueDownload("./img/SpaceExplosion.png");
AM.queueDownload("./img/SPACEFIGHT.png");
AM.queueDownload("./img/splash.png")

AM.downloadAll(function () {
	console.log("starting up da sheild");
	var cameraTrick = document.getElementById("gameWorld");
	var cameraCtx = cameraTrick.getContext("2d");
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");

	var gameEngine = new GameEngine();
	//danny fiddling:
	gameEngine.ctx = ctx;
	gameEngine.init(ctx, cameraCtx);


	gameEngine.running = false;

	var ship = new TheShip(gameEngine);
	var reticle = new Reticle(gameEngine);
	//var background = new Background(gameEngine, AM.getAsset("./img/4kBackground1.png"));
	//var pg = new PlayGame(gameEngine);
	
	//pg.loadGame();
	


	gameEngine.addEntity(ship);
	gameEngine.addEntity(reticle);
	//gameEngine.addEntity(background);
	

	gameEngine.ship = ship;
	gameEngine.cameraTrick = cameraTrick;
	gameEngine.camera = new Camera(gameEngine);
	gameEngine.sceneManager = new SceneManager(gameEngine);
	gameEngine.start();

	//console.log(gameEngine);
	//var pg = new PlayGame(gameEngine);
	//gameEngine.addEntity(pg);
	
	console.log("All Done!");
});

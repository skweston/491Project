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
/* ========================================================================================================== */
// Entity Template
/* ========================================================================================================== */
/*

Every entity must have the following variables:
this.pWidth
this.pHeight
this.scale
this.animation

this.name = "EntityType";
this.x = 0;
this.y = 0;
this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
this.speed = 0;
this.angle = 0;
this.radius
this.weaponCooldown

a list of powerups, things like multishot and such

*/

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
	this.x = 0;
	this.y = 0;
	this.ctx = this.game.cameraCtx;


}
Camera.prototype.draw = function (cameraCtx) {
	cameraCtx.drawImage(this.game.ctx.canvas, this.x , this.y, 800, 800, 0, 0, 800, 800);


};

Camera.prototype.update = function () {
	this.x = this.game.ship.xMid - 400;
	this.y = this.game.ship.yMid - 400;

	//this is where we'll build the binding box to house the ship in a deadzone.
	//that logic is what will be needed to update x and y to better values.


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

/* =========== General Effects ========= */
function SpaceExplosion(game, shipXMid, shipYMid) {
  this.pWidth = 324;
  this.pHeight = 169;
  this.scale = 1;
  //this.animation = new Animation(AM.getAsset("./img/SpaceExplosion.png"), 324, 169, 2,  0.15, 6, true, this.scale);
  this.animation = new Animation(AM.getAsset("./img/SpaceExplosion.png"),
								 this.pWidth, this.pHeight,
								 2,  0.15, 6, false, this.scale);
  this.game = game;
  this.ctx = game.ctx;
  this.name = "Effect";
  this.xMid = shipXMid;
  this.yMid = shipYMid;
  //console.log("middle explosion: " + this.xMid + ", " + this.yMid);
  this.x = this.xMid - ((this.pWidth * this.scale) / 2);
  this.y = this.yMid - ((this.pHeight * this.scale) / 2);
  this.removeFromWorld = false; //need to remove from world when animation finishes.
}

SpaceExplosion.prototype.draw = function () {
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
  //console.log("explosion: " + this.x + ", " + this.y);
  Entity.prototype.draw.call(this);
}

SpaceExplosion.prototype.update = function () {
  /*if (this.animation.elapsedTime < this.animation.totalTime)
	this.x += this.game.clockTick * this.speed;
  if (this.x > 800) this.x = -230;*/
}

function GroundExplosion(game, spritesheet, shipX, shipY) {
  this.animation = new Animation(spritesheet, 32, 32, 2, 0.15, 6, true, 1);
  this.game = game;
  this.name = "Effect";
  this.ctx = game.ctx;
  this.x = shipX;
  this.y = shipY;
}

GroundExplosion.prototype.draw = function () {
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
  Entity.prototype.draw.call(this);
}

GroundExplosion.prototype.update = function () {

}

/* ========================================================================================================== */
// Asset Manager aka Main
/* ========================================================================================================== */

var AM = new AssetManager();

AM.queueDownload("./img/space1-1.png");
AM.queueDownload("./img/Uberspace.png");
AM.queueDownload("./img/4kBackground1.png");
AM.queueDownload("./img/4kBackground2.png");
// ship stuff
AM.queueDownload("./img/shipIdle.png");
AM.queueDownload("./img/shipBoost.png");
AM.queueDownload("./img/shipRoll.png");
AM.queueDownload("./img/shipBoostRoll.png");
AM.queueDownload("./img/shipReticle.png");
AM.queueDownload("./img/shipPrimary1.png");
AM.queueDownload("./img/shipSecondary1.png");
AM.queueDownload("./img/Boss1.png");
AM.queueDownload("./img/BossTurret.png");
AM.queueDownload("./img/LaserBlast.png");

AM.queueDownload("./img/spreader.png");

// enemies
AM.queueDownload("./img/scourge.png");
AM.queueDownload("./img/SpawnDoor.png");

AM.queueDownload("./img/SpaceExplosion.png");

AM.downloadAll(function () {
	console.log("starting up da sheild");
	var cameraTrick = document.getElementById("gameWorld");
	var cameraCtx = cameraTrick.getContext("2d");
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");

	var gameEngine = new GameEngine();

	gameEngine.init(ctx, cameraCtx);


	gameEngine.running = false;

	var ship = new TheShip(gameEngine);
	var reticle = new Reticle(gameEngine);
	var background = new Background(gameEngine, AM.getAsset("./img/4kBackground1.png"));
	var pg = new PlayGame(gameEngine);

	gameEngine.addEntity(ship);
	gameEngine.addEntity(reticle);
	gameEngine.addEntity(background);
	gameEngine.addEntity(pg);

	gameEngine.ship = ship;
	gameEngine.cameraTrick = cameraTrick;
	gameEngine.camera = new Camera(gameEngine);
	gameEngine.start();
	console.log("All Done!");
});

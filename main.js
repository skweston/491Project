// useful global things here
var SHOW_HITBOX = false;
var SCORE = 0;
var DEBUG = false;
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
			var multishot = new multishot(this.game);
			multishot.x = this.xMid - (multishot.pWidth * multishot.scale / 2);
			multishot.y = this.yMid - (multishot.pHeight * multishot.scale / 2);
			multishot.xMid = this.xMid;
			multishot.yMid = this.yMid;

			this.game.addEntity(multishot);
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
	// console.log(`${this.window.width} ${this.window.height} offScreen check
	// 			${this.size} = size`);
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
	this.scrollCheck = 0;
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
	//console.log(`${this.x} x, ${this.y} y,
	//	 				${this.ctx.canvas.width} CW, ${this.ctx.canvas.height} CH`);
	// this.game.reticle.x =
	// this.game.reticle.y =
	// this.x = this.game.ship.xMid - this.ctx.canvas.width/2;
	// this.y = this.game.ship.yMid - this.ctx.canvas.height/2;



	//deadzone bounding box logic
	this.scrollCheck--;

	if (this.scrollCheck < 0) {
		this.scrollCheck = 5;
	}

	var reset = true;

	if(this.game.ship.xMid > this.x + this.ctx.canvas.width - (this.ctx.canvas.width / this.deadzoneRatio)) {
		this.x = this.game.ship.xMid - (this.ctx.canvas.width - (this.ctx.canvas.width / this.deadzoneRatio));
		this.isScrolling = true;
		reset = false;
	}
	if(this.game.ship.yMid > this.y + this.ctx.canvas.height - (this.ctx.canvas.height / this.deadzoneRatio)) {
		this.y = this.game.ship.yMid - (this.ctx.canvas.height - (this.ctx.canvas.height / this.deadzoneRatio));
		this.isScrolling = true;
		reset = false;
	}
	if(this.game.ship.xMid < this.x + (this.ctx.canvas.width / this.deadzoneRatio)) {
		this.x = this.game.ship.xMid - (this.ctx.canvas.width / this.deadzoneRatio);
		this.isScrolling = true;
		reset = false;
	}
	if(this.game.ship.yMid < this.y + (this.ctx.canvas.height / this.deadzoneRatio)) {
		this.y = this.game.ship.yMid - (this.ctx.canvas.height / this.deadzoneRatio);
		this.isScrolling = true;
		reset = false;
	}

	if (this.scrollCheck === 0 && reset) {
		this.isScrolling = false;
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
// Background - parent of MainBackground and BackgroundLayer
/* ========================================================================================================== */
function Background(game, spritesheet) {

	this.name = 'Background';
	this.spritesheet = spritesheet;
	this.game = game;
	this.ctx = game.ctx;
	this.frameWidth;
	this.frameHeight;
	this.dWidth;
	this.dHeight;
	this.sx;
	this.sy;
	// This is the location to draw the background
	this.dx = 0;
	this.dy = 0;


};

Background.prototype.draw = function () {
	// console.log(`${this.ctx.canvas.width} = CW ${this.spritesheet.naturalWidth} = SNW
	// 		${this.ctx.canvas.height} = CH ${this.spritesheet.naturalHeight} = SNH`);
	//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
	this.ctx.drawImage(this.spritesheet,
					this.sx, this.sy,
					this.frameWidth, this.frameHeight,
					this.dx, this.dy,
					this.dWidth, this.dHeight);
};

Background.prototype.update = function () {


};

/* ========================================================================================================== */
// MainBackground
/* ========================================================================================================== */
function MainBackground(game, spritesheet) {
	Background.call(this, game, spritesheet);

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

MainBackground.prototype = Object.create(Background.prototype);
MainBackground.prototype.constructor = MainBackground;
Object.defineProperty(MainBackground.prototype, 'constructor', {
    value: MainBackground,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true }
);

/* ========================================================================================================== */
// BackgroundLayer
/* ========================================================================================================== */
function BackgroundLayer(game, spritesheet) {
	Background.call(this, game, spritesheet);

	// Where the frame starts for the background. Divide image in half then subract the half the canvas,
	// for both sx and sy. (i.e: 5600 / 2 - 800 / 2 = 2400) Allowing ship to fit to the exact middle.
	this.sx = 0;//spritesheet.naturalWidth / 2 - this.ctx.canvas.width / 2;
	this.sy = 0;//spritesheet.naturalHeight / 2 - this.ctx.canvas.height / 2;
	//console.log(`${this.ctx.canvas.width} = CW ${spritesheet.naturalWidth} = SNW
			//${this.ctx.canvas.height} = CH ${spritesheet.naturalHeight} = SNH`);
	// This is the location to draw the background
	this.dx = (this.ctx.canvas.width - spritesheet.naturalWidth) / 2;
	this.dy = (this.ctx.canvas.height - spritesheet.naturalHeight) / 2;

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
	this.oldX = this.dx;
	this.oldY = this.dy;
	/*
	This logic determines the scroll rate of the layer being applied.
	if the rate is less than 0, the image is greater in size than the
	actual background and needs more pixels to be covered in each update.
	*/
	this.xScrollRate = Number.parseFloat(this.ctx.canvas.width / spritesheet.naturalWidth).toFixed(4);
	this.yScrollRate = Number.parseFloat(this.ctx.canvas.height / spritesheet.naturalHeight).toFixed(4);
	if(this.xScrollRate < 1) {
		this.xScrollRate = Number.parseFloat(spritesheet.naturalWidth / this.ctx.canvas.width).toFixed(4);
	}
	if(this.yScrollRate < 1) {
		this.yScrollRate = Number.parseFloat(spritesheet.naturalHeight / this.ctx.canvas.Height).toFixed(4);
	}
};

BackgroundLayer.prototype = Object.create(Background.prototype);
BackgroundLayer.prototype.constructor = BackgroundLayer;
Object.defineProperty(BackgroundLayer.prototype, 'constructor', {
    value: BackgroundLayer,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true }
);

BackgroundLayer.prototype.update = function () {

    var differenceX = this.game.camera.x - this.oldX;
	var differenceY = this.game.camera.y - this.oldY;

	//assign the current camera values for next update.
	this.oldX = this.game.camera.x;
	this.oldY = this.game.camera.y;

	//change image position.
	this.dx += differenceX / this.xScrollRate;
	this.dy += differenceY / this.yScrollRate;
	console.log(`${this.dx + (differenceX / this.xScrollRate)} =(${differenceX} / ${this.xScrollRate}) and ${this.game.camera.x} camX`);
	console.log(`${this.dy + (differenceY / this.yScrollRate)} =(${differenceY} / ${this.yScrollRate}) and ${this.game.camera.y} camY`);

};
/* ========================================================================================================== */
// Asset Manager aka Main
/* ========================================================================================================== */

var AM = new AssetManager();
//Background
AM.queueDownload("./img/level1mainAlt.png");
AM.queueDownload("./img/gasGiantsNebulaLayer.png");
AM.queueDownload("./img/space1-1.png");
AM.queueDownload("./img/PScroll1/space.png");
AM.queueDownload("./img/PScroll1/cloud.png");
AM.queueDownload("./img/PScroll1/comet.png");
AM.queueDownload("./img/PScroll1/planet1.png");
AM.queueDownload("./img/PScroll1/planet2.png");
AM.queueDownload("./img/PScroll1/Background_1.png");
AM.queueDownload("./img/PScroll1/BackgroundLight.png");
AM.queueDownload("./img/PScroll1/BackgroundMedium.png");
AM.queueDownload("./img/PScroll1/BackgroundVariant.png");
AM.queueDownload("./img/PScroll1/Starfield1-1.png");
AM.queueDownload("./img/PScroll1/Background3k.png");

AM.queueDownload("./img/BloodSplatter.png");

// ship stuff
AM.queueDownload("./img/shipIdleSpeed0.png");
AM.queueDownload("./img/shipBoostSpeed0.png");
AM.queueDownload("./img/shipRollSpeed0.png");
AM.queueDownload("./img/shipBoostRollSpeed0.png");

AM.queueDownload("./img/shipIdleSpeed1.png");
AM.queueDownload("./img/shipBoostSpeed1.png");
AM.queueDownload("./img/shipRollSpeed1.png");
AM.queueDownload("./img/shipBoostRollSpeed1.png");

AM.queueDownload("./img/shipIdleSpeed2.png");
AM.queueDownload("./img/shipBoostSpeed2.png");
AM.queueDownload("./img/shipRollSpeed2.png");
AM.queueDownload("./img/shipBoostRollSpeed2.png");

AM.queueDownload("./img/shipReticle.png");
AM.queueDownload("./img/shipPrimary0.png");
AM.queueDownload("./img/shipPrimary1.png");
AM.queueDownload("./img/shipPrimary2.png");
AM.queueDownload("./img/shipPrimary3Idle.png");
AM.queueDownload("./img/shipPrimary3Burst.png");
AM.queueDownload("./img/shipSecondary0.png");
AM.queueDownload("./img/shipSecondary1Idle.png");
AM.queueDownload("./img/shipSecondary1Homing.png");
AM.queueDownload("./img/shipCharge1.png");
AM.queueDownload("./img/shipCharge2.png");
AM.queueDownload("./img/shipCharge3.png");
AM.queueDownload("./img/shipSecondary3.png");
AM.queueDownload("./img/shipDamage1.png");
AM.queueDownload("./img/shipDamage2.png");

// HUD
AM.queueDownload("./img/hudOverlay.png");
AM.queueDownload("./img/hudMinimapBorder.png");
AM.queueDownload("./img/hudRollIcon.png");
AM.queueDownload("./img/hudLaserIcon.png");
AM.queueDownload("./img/hudWaveIcon.png");
AM.queueDownload("./img/hudBulletIcon.png");
AM.queueDownload("./img/hudBurstIcon.png");
AM.queueDownload("./img/hudMissileIcon.png");
AM.queueDownload("./img/hudHomingIcon.png");
AM.queueDownload("./img/hudChargeIcon.png");
AM.queueDownload("./img/hudOrbiterIcon.png");


//Allies
AM.queueDownload("./img/allyDrone.png");
AM.queueDownload("./img/allyShip1.png");
AM.queueDownload("./img/allyShip2.png");
AM.queueDownload("./img/allyBase.png");

AM.queueDownload("./img/GreenChroma.png");
AM.queueDownload("./img/PurpleChroma.png");
AM.queueDownload("./img/RedChroma.png");
AM.queueDownload("./img/BlackWhiteChroma.png");
AM.queueDownload("./img/MechanicalResourceGatherer.png");
AM.queueDownload("./img/SpaceStation.png");
AM.queueDownload("./img/PlayerBuilder.png");

//Terrain
AM.queueDownload("./img/Asteroid.png");

//Allies
AM.queueDownload("./img/GreenChroma.png");
AM.queueDownload("./img/PurpleChroma.png");
AM.queueDownload("./img/RedChroma.png");
AM.queueDownload("./img/BlackWhiteChroma.png");
AM.queueDownload("./img/MechanicalResourceGatherer.png");
AM.queueDownload("./img/SpaceStation.png");

//drops and powerups
AM.queueDownload("./img/healthRefill.png");
AM.queueDownload("./img/multishot.png");
AM.queueDownload("./img/speedUp.png");
AM.queueDownload("./img/damageUp.png");
AM.queueDownload("./img/scrap.png");

// enemies
AM.queueDownload("./img/enemyScourge.png");
AM.queueDownload("./img/enemyDefiler.png");
AM.queueDownload("./img/enemyGuardian.png");
AM.queueDownload("./img/enemyDrone.png");
AM.queueDownload("./img/enemyQueen.png");
AM.queueDownload("./img/enemyBase.png");



AM.queueDownload("./img/Boss1.png");
AM.queueDownload("./img/BossTurret.png");
AM.queueDownload("./img/LaserBlast.png");
AM.queueDownload("./img/BossExplosion.png");
AM.queueDownload("./img/Leech.png");
AM.queueDownload("./img/scourge.png");
AM.queueDownload("./img/stalker32.png");

AM.queueDownload("./img/BiologicalResourceGatherer.png");
AM.queueDownload("./img/AlienSpaceStation.png");
AM.queueDownload("./img/AlienBuilder.png");
AM.queueDownload("./img/SpawnDoor.png");

AM.queueDownload("./img/SpaceExplosion.png");
AM.queueDownload("./img/SPACEFIGHT.png");
AM.queueDownload("./img/plutoSplashPixel.png");
//AM.queueDownload("./img/splash.png")
AM.queueDownload("./img/splash.png");
AM.queueDownload("./img/TutorialSceneLines.png");


AM.downloadAll(function () {
	console.log("starting up da sheild");
	var cameraTrick = document.getElementById("gameWorld");
	var cameraCtx = cameraTrick.getContext("2d");
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");

	var gameEngine = new GameEngine();
	gameEngine.ctx = ctx;
	gameEngine.init(ctx, cameraCtx);
	gameEngine.running = false;

	var ship = new TheShip(gameEngine);
	var reticle = new Reticle(gameEngine);
	var sm = new SceneManager(gameEngine);

	gameEngine.addEntity(ship);
	gameEngine.addEntity(reticle);

	gameEngine.ship = ship;
	gameEngine.cameraTrick = cameraTrick;
	gameEngine.camera = new Camera(gameEngine);
	gameEngine.sceneManager = sm;
	gameEngine.start();
	console.log("All Done!");
});

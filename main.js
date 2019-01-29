var SHOW_HITBOX = true;

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

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

/* ========================================================================================================== */
// Background
/* ========================================================================================================== */
function Background(game, spritesheet) {

    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;

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
// Boss 1
/* ========================================================================================================== */
function Boss1(game, spritesheet){
  this.animation = new Animation(spritesheet, 200, 450, 1200, 0.175, 6, true, 1);
  this.x = 300;
  this.y = 175;
  this.speed = 0;
  this.angle = 0;
  this.game = game;
  this.ctx = game.ctx;
  this.removeFromWorld = false;
}
Boss1.prototype = new Entity();
Boss1.prototype.constructor = Boss1;

Boss1.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    this.angle += 5;

    Entity.prototype.update.call(this);
}

Boss1.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function BossTurret(game, spritesheet, x, y){
  this.animation = new Animation(spritesheet, 32, 32, 672, 0.2, 21, true, 1.5);
  this.x = x;
  this.y = y;
  this.hitcenterX = this.x + 16;
  this.hitcenterY = this.y + 16;
  this.hitRadius = 16;
  this.speed = 0;
  this.angle = 0;
  this.game = game;
  this.ctx = game.ctx;
  this.removeFromWorld = false;
}
BossTurret.prototype = new Entity();
BossTurret.prototype.constructor = Boss1;

BossTurret.prototype.update = function () {

    //this.x += this.game.clockTick * this.speed;
    //if (this.x > 800) this.x = -230;
    var dx = this.game.mousex - this.x;
    var dy = this.y - this.game.mousey;
    // this should be the angle in radians
    this.angle = Math.atan2(dy,dx);
    //if we want it in degrees
    //this.angle *= 180 / Math.PI;


    if (this.game.wasclicked){
      console.log("the x of the turret: " + this.x  + " and the y: " + this.y);
      this.game.addEntity(new LaserBlast(this.game, AM.getAsset("./img/LaserBlast.png"), this.x, this.y, dx, dy));

    }


    Entity.prototype.update.call(this);
}

BossTurret.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);

    Entity.prototype.draw.call(this);
}
function LaserBlast(game, spritesheet, xIn, yIn, dx, dy){
  this.animation = new Animation(spritesheet, 32, 32, 128, 0.15, 4, true, 1);
  this.game = game;
  this.speedX = 1;
  this.speedY = 1;
  this.dx = dx/this.speedX;
  this.dy = -dy/this.speedY;
  this.ctx = game.ctx;
  this.x = xIn; //this.game.mousex - 22;
  this.y = yIn; //this.game.mousey;
  this.lifetime = 600;
  this.removeFromWorld = false;
}
LaserBlast.prototype = new Entity();
LaserBlast.prototype.constructor = LaserBlast;

LaserBlast.prototype.update = function () {
    this.x += this.game.clockTick * this.dx;
    this.y += this.game.clockTick * this.dy;

    if (this.x > 800) this.x = -230;
    if (this.y > 800) this.y = -230;
    this.lifetime = this.lifetime - 1;
    if (this.lifetime < 0){
      this.removeFromWorld = true;
    }

    Entity.prototype.update.call(this);
}

LaserBlast.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// Scourge - Enemy
/* ========================================================================================================== */
function Scourge(game, spritesheet) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.35;
	this.animation = new Animation(spritesheet, this.pWidth, this.pHeight, 640, 0.1, 5, true, this.scale);
	this.speed = 0;
	this.x = 700;
	this.y = 50;
	this.hitRadius = 40;
	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
	Entity.call(this, game, this.x, this.y);
}

Scourge.prototype = new Entity();
Scourge.prototype.constructor = Scourge;

Scourge.prototype.update = function () {
	Entity.prototype.update.call(this);
}

Scourge.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);

	if (SHOW_HITBOX) {
    	this.ctx.beginPath();
    	this.ctx.strokeStyle = "Red";
    	this.ctx.lineWidth = 2;
    	this.ctx.arc(this.x + this.pWidth * this.scale / 2, this.y + this.pHeight * this.scale / 2,
    				 this.hitRadius * this.scale, 0, Math.PI * 2, false);
    	this.ctx.stroke();
    	this.ctx.closePath();
    }

	Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// The Ship
/* ========================================================================================================== */
function TheShip(game) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.5;
    this.idleAnimation = new Animation(AM.getAsset("./img/shipIdle.png"), this.pWidth, this.pHeight, 256, 0.03, 2, true, this.scale);
    this.boostAnimation = new Animation(AM.getAsset("./img/shipBoost.png"), this.pWidth, this.pHeight, 256, 0.03, 2, true, this.scale);
    this.rollAnimation = new Animation(AM.getAsset("./img/shipRoll.png"), this.pWidth, this.pHeight, 256, 0.03, 22, false, this.scale);
    this.boostRollAnimation = new Animation(AM.getAsset("./img/shipBoostRoll.png"), this.pWidth, this.pHeight, 256, 0.03, 22, false, this.scale);
    this.speed = 0.5;
    this.boosting = false;
    this.cancelBoost = false;
    this.rolling = false;
    this.x = 100;
    this.y = 100;
    this.hitRadius = 28;
    this.game = game;
    this.ctx = game.ctx;
    this.removeFromWorld = false;
    Entity.call(this, game, this.x, this.y);
}

TheShip.prototype = new Entity();
TheShip.prototype.constructor = TheShip;

TheShip.prototype.update = function () {
	// movement
	if (this.game.moveUp) {
		this.y -= 10 * this.speed;
	}
	if (this.game.moveLeft) {
		this.x -= 10 * this.speed;
	}
	if (this.game.moveDown) {
		this.y += 10 * this.speed;
	}
	if (this.game.moveRight) {
		this.x += 10 * this.speed;
	}

	// rolling
	if (this.game.roll) {
		this.rolling = true;
	}
	if (this.rolling) {
		if (this.rollAnimation.isDone()) {
			this.rollAnimation.elapsedTime = 0;
			this.rolling = false;
		}
		else if (this.boostRollAnimation.isDone()) {
			this.boostRollAnimation.elapsedTime = 0;
			this.rolling = false;
			if (this.cancelBoost) {
				this.cancelBoost = false;
				this.boosting = false;
			}
		}
	}

	// boosting
	if (this.game.boost && !this.rolling) {
		this.cancelBoost = false;
		this.boosting = true;
		this.speed = 1;
	}
	if (!this.game.boost && !this.rolling) {
		this.boosting = false;
		this.speed = 0.5;
	}

	// boost input buffer during rolls
	if (this.game.boost && this.rolling) {
		this.cancelBoost = false;
	}
	if (!this.game.boost && this.rolling) {
		this.cancelBoost = true;
	}

    Entity.prototype.update.call(this);
}

TheShip.prototype.draw = function () {
	if (this.rolling) {
		if (this.boosting) {
			this.boostRollAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		}
		else {
			this.rollAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		}
	}
	else {
		if (this.boosting) {
			this.boostAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		}
		else {
			this.idleAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		}
	}

    if (SHOW_HITBOX) {
    	this.ctx.beginPath();
    	this.ctx.strokeStyle = "Red";
    	this.ctx.lineWidth = 2;
    	this.ctx.arc(this.x + this.pWidth * this.scale / 2, this.y + this.pHeight * this.scale / 2,
    				 this.hitRadius * this.scale, 0, Math.PI * 2, false);
    	this.ctx.stroke();
    	this.ctx.closePath();
    }

    Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// Asset Manager
/* ========================================================================================================== */
var AM = new AssetManager();
AM.queueDownload("./img/smartBomb.png");
AM.queueDownload("./img/space1-1.png");
AM.queueDownload("./img/shipIdle.png");
AM.queueDownload("./img/shipBoost.png");
AM.queueDownload("./img/shipRoll.png");
AM.queueDownload("./img/shipBoostRoll.png");
AM.queueDownload("./img/Boss1.png");
AM.queueDownload("./img/BossTurret.png");
AM.queueDownload("./img/LaserBlast.png");
AM.queueDownload("./img/scourge.png");

AM.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    // always load background first
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/space1-1.png")));

    // load the environment assets next
    gameEngine.addEntity(new Boss1(gameEngine, AM.getAsset("./img/Boss1.png")));
    gameEngine.addEntity(new BossTurret(gameEngine, AM.getAsset("./img/BossTurret.png"), 375, 380));
    gameEngine.addEntity(new BossTurret(gameEngine, AM.getAsset("./img/BossTurret.png"), 310, 520));
    gameEngine.addEntity(new BossTurret(gameEngine, AM.getAsset("./img/BossTurret.png"), 375, 325));
    gameEngine.addEntity(new BossTurret(gameEngine, AM.getAsset("./img/BossTurret.png"), 435, 520));
    gameEngine.addEntity(new Scourge(gameEngine, AM.getAsset("./img/scourge.png")));

    // the ship is always loaded last
    gameEngine.addEntity(new TheShip(gameEngine));

    console.log("All Done!");
});

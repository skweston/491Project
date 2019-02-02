// useful global things here
var SHOW_HITBOX = false;

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

Animation.prototype.drawFrame = function (tick, ctx, x, y, angle) {
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
// Background
/* ========================================================================================================== */
function Background(game, spritesheet) {

	this.name = "Background";

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
// Boss 1
/* ========================================================================================================== */
function Boss1(game){
	this.pWidth = 200;
	this.pHeight = 450;
	this.scale = 1;
    this.animation = new Animation(AM.getAsset("./img/Boss1.png"), 200, 450, 1200, 0.175, 6, true, 1);
    this.name = "Enemy";
    this.x = Math.random() *800;
    this.y = 2000;
    this.angle = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
    this.removeFromWorld = false;
	this.turret1 = new BossTurret(this.game, this, 70, 125);
	this.turret2 = new BossTurret(this.game, this, 70, 195);
	this.turret3 = new BossTurret(this.game, this, 10, 330);
	this.turret4 = new BossTurret(this.game, this, 135, 330);
	game.addEntity(this.turret1);
	game.addEntity(this.turret2);
	game.addEntity(this.turret3);
	game.addEntity(this.turret4);

	this.turretsRemaining = 4;

}
Boss1.prototype = new Entity();
Boss1.prototype.constructor = Boss1;

Boss1.prototype.update = function () {
	console.log("boss is updating");
	this.y -= this.game.clockTick * this.speed;

	if (this.turretsRemaining === 0){
		this.removeFromWorld = true;
	}
	if(this.y < -2000){
		this.turret1.removeFromWorld = true;
		this.turret2.removeFromWorld = true;
		this.turret3.removeFromWorld = true;
		this.turret4.removeFromWorld = true;
		this.removeFromWorld = true;
	}
	//add a comment

	Entity.prototype.update.call(this);
}

Boss1.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);

	if(!this.turret1.removeFromWorld){
		this.turret1.animation.drawFrame(this.game.clockTick, this.ctx, this.turret1.x, this.turret1.y, this.turret1.angle);
	}
	if(!this.turret2.removeFromWorld){
		this.turret2.animation.drawFrame(this.game.clockTick, this.ctx, this.turret2.x, this.turret2.y, this.turret2.angle);
	}
	if(!this.turret3.removeFromWorld){
		this.turret3.animation.drawFrame(this.game.clockTick, this.ctx, this.turret3.x, this.turret3.y, this.turret3.angle);
	}
	if(!this.turret4.removeFromWorld){
		this.turret4.animation.drawFrame(this.game.clockTick, this.ctx, this.turret4.x, this.turret4.y, this.turret4.angle);
	}
	Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// Boss turret
/* ========================================================================================================== */

function BossTurret(game, boss, xOffset, yOffset){
    this.pWidth = 32;
    this.pHeight = 32;
    this.scale = 1.5;
    this.animation = new Animation(AM.getAsset("./img/BossTurret.png"), this.pWidth, this.pHeight, 675, 0.2, 21, true, this.scale);
    this.name = "Enemy";
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	this.x = boss.x + xOffset;
    this.y = boss.y + yOffset;
    this.xMid = this.x + (this.pWidth * this.scale) / 2;
    this.yMid = this.y + (this.pHeight * this.scale) / 2;
    this.radius = 8 * this.scale;
    this.speed = 0;
    this.angle = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.removeFromWorld = false;
    this.health = 5;
	this.shootCooldown = 30;
	this.missleCooldown = 1500;
	this.shotCount = 0;
	this.boss = boss;


}
BossTurret.prototype = new Entity();
BossTurret.prototype.constructor = Boss1;

BossTurret.prototype.update = function () {

	this.x = this.boss.x + this.xOffset;
	this.y = this.boss.y + this.yOffset;

	this.xMid = this.x + (this.pWidth * this.scale) / 2;
	this.yMid = this.y + (this.pHeight * this.scale) / 2;

	this.shootCooldown--;
	if(this.health < 1){
		this.boss.turretsRemaining--;

        this.removeFromWorld = true;
    }
	for (var i = 0; i<this.game.playerProjectiles.length; i++){

		var ent = this.game.playerProjectiles[i];
		if(Collide(this, ent)){

			this.health -= ent.damage;
			ent.removeFromWorld = true;
		}
	}
    var dx = this.game.ship.xMid - this.xMid-1;
    var dy = (this.yMid - this.game.ship.yMid)-1;
    // this should be the angle in radians
    this.angle = -Math.atan2(dy,dx);

	if (this.shootCooldown < 1){
		if (this.shotCount >= 2){
			this.shootCooldown = 150;
			this.createProjectile("LaserBlast", 0, -Math.PI/2)
			this.shotCount = 0;
		}else{
			this.shootCooldown = 75;
			this.createProjectile("LaserBlast", 0, -Math.PI/2)
			this.shotCount++;
		}
        // this.createProjectile("LaserBlast", 0, -Math.PI/2);
	}


	Entity.prototype.update.call(this);
}
BossTurret.prototype.createProjectile = function(type, offset, adjustAngle) {
	var dist = 1000 * distance({xMid: this.xMid, yMid: this.yMid},
							   {xMid: this.game.ship.xMid, yMid: this.game.ship.YMid});
	var angle = this.angle + adjustAngle;
	if (type === "LaserBlast") {
		var projectile = new LaserBlast(this.game, this.angle);
	}
	if (type === "BossMissle") {
		var projectile = new BossMissle(this.game, this.angle);
	}
	var target = {x: Math.cos(angle) * dist + this.xMid,
				  y: Math.sin(angle) * dist + this.yMid};
	var dir = direction(this.game.ship, this);

	projectile.x = this.xMid;
	projectile.y = this.yMid;
	projectile.velocity.x = dir.x * projectile.maxSpeed;
	projectile.velocity.y = dir.y * projectile.maxSpeed;
	projectile.angle = angle;

	this.game.addEntity(projectile);
}
BossTurret.prototype.draw = function () {
	//this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);

	if (SHOW_HITBOX) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = "Red";
		this.ctx.lineWidth = 1;
		this.ctx.arc(this.xMid, this.yMid, this.radius * this.scale, 0, Math.PI * 2, false);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// BossTurret LaserBlaste
/* ========================================================================================================== */


function LaserBlast(game, angle){
	this.pWidth = 32;
	this.pHeight = 32;
	this.scale = 1;
	this.animation = new Animation(AM.getAsset("./img/LaserBlast.png"), this.pWidth, this.pHeight, 128, 0.15, 4, true, this.scale);
	this.name = "EnemyProjectile";

	this.x = 0;
	this.y = 0;
	this.xMid = -100;
	this.yMid = -100;
	this.radius = 4 * this.scale;
	this.angle = angle;

	this.lifetime = 500;
	this.damage = 7;
	this.maxSpeed = 300;
	this.velocity = {x: 10, y: 10};

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
  }

LaserBlast.prototype = new Entity();
LaserBlast.prototype.constructor = LaserBlast;

LaserBlast.prototype.update = function () {
	this.x += this.velocity.x * this.game.clockTick;
	this.y += this.velocity.y * this.game.clockTick;

	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
	if(speed > this.maxSpeed) {
		var ratio = this.maxSpeed / speed;
		this.velocity.x *= ratio;
		this.velocity.y *= ratio;
	  }


	  var ent = this.game.ship;
	  if(Collide(this, ent)) {
		  ent.health -= this.damage;
		  this.removeFromWorld = true;
	  }

	  this.lifetime -= 1;
	  if (this.lifetime < 0) {
		  this.removeFromWorld = true;
	  }

	  Entity.prototype.update.call(this);
  }

LaserBlast.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);

	if (SHOW_HITBOX) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = "Red";
		this.ctx.lineWidth = 1;
		this.ctx.arc(this.xMid, this.yMid, this.radius * this.scale, 0, Math.PI * 2, false);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// Scourge - Enemy
/* ========================================================================================================== */
function Scourge(game, spritesheet, xIn, yIn) {

	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = .5;
	this.animation = new Animation(spritesheet, this.pWidth, this.pHeight, 640, 0.1, 5, true, this.scale);
	this.angle = 0;
	this.name = "Enemy";
	this.speed = 7;
	this.x = xIn;
	this.y = yIn;
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
	this.radius = 41 * this.scale;
	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
	this.health = 20;
	this.damage = 20;
	//console.log("starting health: " + this.health);
	Entity.call(this, game, this.x, this.y);
}

Scourge.prototype = new Entity();
Scourge.prototype.constructor = Scourge;

Scourge.prototype.update = function () {
	// move the scourge
	var ent = this.game.ship;

	var delta = this.speed / (distance(this, ent));
	var dX = Math.abs(this.xMid - ent.xMid);
	var dY = Math.abs(this.yMid - ent.yMid);
	if(this.xMid > ent.xMid) {
		this.xMid = this.xMid - (Math.sqrt((delta * delta) * (dX * dX)));
	} else if(this.xMid < ent.xMid) {
		this.xMid = (Math.sqrt((delta * delta) * (dX * dX))) + this.xMid;
	}

	if(this.yMid > ent.yMid) {
		this.yMid = this.yMid - (Math.sqrt((delta * delta) * (dY * dY)));
	} else if(this.yMid < ent.yMid) {
		this.yMid = (Math.sqrt((delta * delta) * (dY * dY))) + this.yMid;
	}

	this.x = this.xMid - (this.pWidth * this.scale / 2);
	this.y = this.yMid - (this.pHeight * this.scale / 2);

	// for(var i = 0; i < this.game.enemies; i++){
	// 	var ent = this.game.enemies[i];
	// 	if(ent.name === this.name && ent != this) {
	// 		var dist = distance(this, ent);
	// 		if(dist < this.radius + ent.radius) {
	// 			var delta = (this.radius + ent.radius) / (distance(this, ent));
	// 			var dX = Math.abs(this.xMid - ent.xMid);
	// 			var dY = Math.abs(this.yMid - ent.yMid);

	// 			if(this.xMid > ent.xMid) {
	// 				this.xMid = this.xMid + (Math.sqrt((delta * delta) * (dX * dX)));
	// 				ent.xMid = ent.xMid - (Math.sqrt((delta * delta) * (dX * dX)));
	// 			} else if(this.xMid < ent.xMid) {
	// 				this.xMid = this.xMid - (Math.sqrt((delta * delta) * (dX * dX)));
	// 				ent.xMid = ent.xMid + (Math.sqrt((delta * delta) * (dX * dX)));
	// 			}

	// 			if(this.yMid > ent.yMid) {
	// 				this.yMid = this.yMid + (Math.sqrt((delta * delta) * (dY * dY)));
	// 				ent.YMid = ent.yMid - (Math.sqrt((delta * delta) * (dY * dY)));
	// 			} else if(this.yMid < ent.yMid) {
	// 				this.yMid = this.yMid - (Math.sqrt((delta * delta) * (dY * dY)));
	// 				ent.yMid = ent.yMid + (Math.sqrt((delta * delta) * (dY * dY)));
	// 			}
	// 			this.x = this.xMid - (this.pWidth * this.scale / 2);
	// 			this.y = this.yMid - (this.pHeight * this.scale / 2);
	// 			ent.x = ent.xMid - (this.pWidth * this.scale / 2);
	// 			ent.y = ent.yMid - (this.pHeight * this.scale / 2);
	// 		}
	// 	}
	// }

	// update angle
	var dx = this.game.ship.xMid - this.xMid;
	var dy = this.yMid - this.game.ship.yMid;
	this.angle = -Math.atan2(dy,dx);

	// check collision with player projectiles
	for (var i = 0; i < this.game.playerProjectiles.length; i++ ) {
		var ent = this.game.playerProjectiles[i];
		if (Collide(this, ent)) {
			this.health -= ent.damage;
			ent.removeFromWorld = true;
			if (this.health < 1) {
				break;
			}
		}
	}

	// check collision with ship
	if (Collide(this, this.game.ship)) {
		this.game.ship.health -= this.damage;
		this.removeFromWorld = true;
	}

	// check health
	if (this.health < 1) {
		if (Math.random() * 100 < 20) {
			var spreader = new Spreader(this.game);
			spreader.x = this.xMid - (spreader.pWidth * spreader.scale / 2);
			spreader.y = this.yMid - (spreader.pHeight * spreader.scale / 2);

			this.game.addEntity(spreader);
		}

		this.removeFromWorld = true;
	}

	if (this.removeFromWorld) {
		var explosion = new SpaceExplosion(this.game, this.xMid, this.yMid);
		this.game.addEntity(explosion);
	}

	Entity.prototype.update.call(this);
}

Scourge.prototype.draw = function () {
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);

  if (SHOW_HITBOX) {
	  this.ctx.beginPath();
	  this.ctx.strokeStyle = "Red";
	  this.ctx.lineWidth = 1;
	  this.ctx.arc(this.xMid, this.yMid, this.radius * this.scale, 0, Math.PI * 2, false);
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
	this.reticleAnimation = new Animation(AM.getAsset("./img/shipReticle.png"), this.pWidth, this.pHeight, 256, 0.5, 2, true, 0.25);

	this.name = "Player";
	this.health = 100;
	this.speed = 0.5;
	this.boosting = false;
	this.cancelBoost = false;
	this.rolling = false;
	this.rollCooldown = 0;
	this.x = 400 - (this.pWidth * this.scale / 2);
	this.y = 400 - (this.pHeight * this.scale / 2);
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
	this.radius = this.scale * 64;
	this.angle = 0;
	this.primaryCooldownMax = 20;
	this.primaryCooldown = 0;
	this.secondaryCooldownMax = 50;
	this.secondaryCooldown = 0;
	this.spreaderLevel = 0;
	this.spreader = 0;

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
	Entity.call(this, game, this.x, this.y);
}

TheShip.prototype = new Entity();
TheShip.prototype.constructor = TheShip;

TheShip.prototype.update = function () {
	if (!this.game.running) return;

	if(this.health < 1){
		this.removeFromWorld = true;
	}
	// movement
	var xMove = 0;
	var yMove = 0;
	if (this.game.moveUp) {
		if (this.yMid - this.radius > 0) {
			yMove -= 10 * this.speed;
		}
	}
	if (this.game.moveLeft) {
		if (this.xMid - this.radius > 0) {
			xMove -= 10 * this.speed;
		}
	}
	if (this.game.moveDown) {
		if (this.yMid + this.radius < 800) {
			yMove += 10 * this.speed;
		}
	}
	if (this.game.moveRight) {
		if (this.xMid + this.radius < 800) {
			xMove += 10 * this.speed;
		}
	}

	if (xMove === 0) {
		this.y += yMove;
	}
	else if (yMove === 0) {
		this.x += xMove;
	}
	else {
		this.x += xMove * 0.7;
		this.y += yMove * 0.7;
	}

	// update center hitbox
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	// update angle
	var dx = this.game.mouseX - this.xMid;
	var dy = this.yMid - this.game.mouseY;
	this.angle = -Math.atan2(dy,dx);

	// rolling
	if (this.game.roll && this.rollCooldown === 0) {
		this.rollCooldown = 100;
		this.rolling = true;
	}
	if (this.rollCooldown > 0) {
		this.rollCooldown -= 1;
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

	// shooting
	if (this.primaryCooldown > 0) {
		this.primaryCooldown -= 1;
	}
	if (this.secondaryCooldown > 0) {
		this.secondaryCooldown -= 1;
	}
	if (this.spreader > 0) {
		this.spreader -= 1;
	}
	if (this.spreader <= 0) {
		this.spreaderLevel = 0;
	}
	if (this.game.firePrimary && this.primaryCooldown === 0) {
		this.primaryCooldown = this.primaryCooldownMax;
		for (var i = 0; i < 2; i++) {
			var offset = (4 * Math.pow(-1, i));
			this.createProjectile("Primary", offset, 0);
		}
		if (this.spreaderLevel > 0) {
			for (var i = 0; i < 2; i++) {
				for (var j = 0; j < 2; j++) {
					var offset = (4 * Math.pow(-1, j));
					this.createProjectile("Primary", offset, ((Math.PI / 12) * Math.pow(-1, i)));
				}
				if (this.spreaderLevel > 1) {
					for (var j = 0; j < 2; j++) {
						var offset = (4 * Math.pow(-1, j));
						this.createProjectile("Primary", offset, ((Math.PI / 6) * Math.pow(-1, i)));
					}
				}
			}
		}
	}
	if (this.game.fireSecondary && this.secondaryCooldown === 0) {
		this.secondaryCooldown = this.secondaryCooldownMax;

		if (this.spreaderLevel > 1) {
			for (var i = 0; i < 2; i++) {
				this.createProjectile("Secondary", 0, ((Math.PI / 8) * Math.pow(-1, i)));
			}
		}

		this.createProjectile("Secondary", 0, 0);
	}

	Entity.prototype.update.call(this);
}

TheShip.prototype.createProjectile = function(type, offset, adjustAngle) {
	var dist = 1000 * distance({xMid: this.xMid, yMid: this.yMid},
							   {xMid: this.game.mouseX, yMid: this.game.mouseY});
	var angle = this.angle + adjustAngle;
	if (type === "Primary") {
		var projectile = new ShipPrimary(this.game);
	}
	if (type === "Secondary") {
		var projectile = new ShipSecondary(this.game);
	}
	var target = {x: Math.cos(angle) * dist + this.xMid,
				  y: Math.sin(angle) * dist + this.yMid};
	var dir = direction(target, this);

	projectile.x = this.xMid - (projectile.pWidth * projectile.scale / 2) +
				   ((projectile.pWidth * projectile.scale / 2) * Math.cos(angle + offset));
	projectile.y = this.yMid - (projectile.pHeight * projectile.scale / 2)  +
				   ((projectile.pHeight * projectile.scale / 2) * Math.sin(angle + offset));
	projectile.velocity.x = dir.x * projectile.maxSpeed;
	projectile.velocity.y = dir.y * projectile.maxSpeed;
	projectile.angle = angle;

	this.game.addEntity(projectile);
}

TheShip.prototype.draw = function () {
	if (!this.game.running) return;
	if (this.rolling) {
		if (this.boosting) {
			this.boostRollAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
		}
		else {
			this.rollAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
		}
	}
	else {
		if (this.boosting) {
			this.boostAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
		}
		else {
			this.idleAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
		}
	}

	if (SHOW_HITBOX) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = "Red";
		this.ctx.lineWidth = 1;
		this.ctx.arc(this.xMid, this.yMid, this.radius * this.scale, 0, Math.PI * 2, false);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// Ship Weapons
/* ========================================================================================================== */

function ShipPrimary(game) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.25;
	this.animation = new Animation(AM.getAsset("./img/shipPrimary1.png"), this.pWidth, this.pHeight, 384, 0.15, 3, true, this.scale);

	this.name = "PlayerProjectile";
	this.x = 0;
	this.y = 0;
	this.xMid = 0;
	this.yMid = 0;
	this.radius = 10;
	this.angle = 0;
	this.pierce = 0;
	this.lifetime = 500;
	this.damage = 4;
	this.maxSpeed = 1500;
	this.velocity = {x: 0, y: 0};

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

ShipPrimary.prototype = new Entity();
ShipPrimary.prototype.constructor = ShipPrimary;

ShipPrimary.prototype.update = function () {
	// remove offscreen projectile
	if (this.xMid < -50 || this.xMid > 850 || this.yMid < -50 || this.yMid > 850) {
		this.removeFromWorld = true;
	}

	this.x += this.velocity.x * this.game.clockTick;
	this.y += this.velocity.y * this.game.clockTick;

	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
	if (speed > this.maxSpeed) {
		var ratio = this.maxSpeed / speed;
		this.velocity.x *= ratio;
		this.velocity.y *= ratio;
	}

	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

ShipPrimary.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);

	if (SHOW_HITBOX) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = "Red";
		this.ctx.lineWidth = 1;
		this.ctx.arc(this.xMid, this.yMid, this.radius * this.scale, 0, Math.PI * 2, false);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	Entity.prototype.draw.call(this);
}

function ShipSecondary(game) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.5;
	this.animation = new Animation(AM.getAsset("./img/shipSecondary1.png"), this.pWidth, this.pHeight, 384, 0.15, 3, true, this.scale);

	this.name = "PlayerProjectile";
	this.x = 0;
	this.y = 0;
	this.xMid = 0;
	this.yMid = 0;
	this.radius = 10;
	this.angle = 0;
	this.pierce = 0;
	this.lifetime = 1500;
	this.damage = 15;
	this.maxSpeed = 500;
	this.velocity = {x: 0, y: 0};

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

ShipSecondary.prototype = new Entity();
ShipSecondary.prototype.constructor = ShipSecondary;

ShipSecondary.prototype.update = function () {
	// remove offscreen projectile
	if (this.xMid < -50 || this.xMid > 850 || this.yMid < -50 || this.yMid > 850) {
		this.removeFromWorld = true;
	}

	this.x += this.velocity.x * this.game.clockTick;
	this.y += this.velocity.y * this.game.clockTick;

	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
	if (speed > this.maxSpeed) {
		var ratio = this.maxSpeed / speed;
		this.velocity.x *= ratio;
		this.velocity.y *= ratio;
	}

	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

ShipSecondary.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);

	if (SHOW_HITBOX) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = "Red";
		this.ctx.lineWidth = 1;
		this.ctx.arc(this.xMid, this.yMid, this.radius * this.scale, 0, Math.PI * 2, false);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// Extras
/* ========================================================================================================== */

function Reticle(game) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.25;
	this.reticleAnimation = new Animation(AM.getAsset("./img/shipReticle.png"), this.pWidth, this.pHeight, 256, 0.5, 2, true, this.scale);

	this.name = "Extra";
	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

Reticle.prototype = new Entity();
Reticle.prototype.constructor = Reticle;

Reticle.prototype.update = function () {
	Entity.prototype.update.call(this);
}

Reticle.prototype.draw = function () {
	this.reticleAnimation.drawFrame(this.game.clockTick, this.ctx,
								   (this.game.mouseX - (this.pWidth * this.scale / 2) - 1),
								   (this.game.mouseY - (this.pHeight * this.scale / 2) - 1), 0);

	Entity.prototype.draw.call(this);
}

function Spreader(game) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.75;
	this.animation = new Animation(AM.getAsset("./img/spreader.png"), this.pWidth, this.pHeight, 256, 0.15, 2, true, this.scale);

	this.name = "Extra";
	this.x = 0;
	this.y = 0;
	this.xMid = 0;
	this.yMid = 0;
	this.radius = this.scale * 42;
	this.angle = 0;

	this.lifetime = 500;

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

Spreader.prototype = new Entity();
Spreader.prototype.constructor = Spreader;

Spreader.prototype.update = function () {
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	if (Collide(this, this.game.ship)) {
		this.game.ship.spreader = 1000;
		this.game.ship.spreaderLevel++;
		this.removeFromWorld = true;
	}

	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

Spreader.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);

	if (SHOW_HITBOX) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = "Red";
		this.ctx.lineWidth = 1;
		this.ctx.arc(this.xMid, this.yMid, this.radius * this.scale, 0, Math.PI * 2, false);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// Level Manager stuff
/* ========================================================================================================== */

function PlayGame(game) {
	this.name = "Level";
	this.bossTimer = 1000;
	this.spawnTimer = 0;
	this.spawnNum = 1;
	this.counter = 0;
	Entity.call(this, game);
}

PlayGame.prototype = new Entity();
PlayGame.prototype.constructor = PlayGame;

PlayGame.prototype.reset = function () {
	this.game.running = false;
	this.game.clicked = false;
	this.spawnNum = 1;
	this.counter = 0;

	for (var i = 0; i < this.game.extras.length; i++) {
		this.game.extras[i].removeFromWorld = true;
	}

	var ship = new TheShip(this.game);
	var reticle = new Reticle(this.game);
	this.game.addEntity(ship);
	this.game.addEntity(reticle);
	this.game.ship = ship;
}

PlayGame.prototype.update = function () {
	if (this.game.clicked) {
		this.game.running = true;
	}
	if (this.bossTimer > 0){
		this.bossTimer--;
	}
	if(this.game.running && this.bossTimer === 0){
		this.bossTimer = 1000;
		this.game.addEntity(new Boss1(this.game));
	}
	if (this.spawnTimer > 0) {
		this.spawnTimer--;
	}
	if (this.game.running && this.spawnTimer === 0) {
		this.spawnTimer = 100;

		for (var i = 0; i < this.spawnNum; i++) {
			var border = 0;
			var x = Math.random() * 800;
			var y = 0;

			border = Math.floor((Math.random() * 2));

			if (border === 0) {
				x = (Math.random() * 1000) - 100;
				y = (Math.random() * 100);

				if (y < 50) { // top
					y = -50 - y;
				}
				else { // bottom
					y = 800 + y;
				}
			}
			else {
				y = (Math.random() * 1000) - 100;
				x = (Math.random() * 100);

				if (x < 50) { // left
					x = -50 - x;
				}
				else { // right
					x = 800 + x;
				}
			}

			this.game.addEntity(new Scourge(this.game, AM.getAsset("./img/scourge.png"), x, y));

			this.counter++;
			if (this.counter % 10 === 0) {
				this.spawnNum++;
			}
		}
	}

	if (this.game.ship.health < 1) {
		this.reset();
	}
}

PlayGame.prototype.draw = function (ctx) {
	if (!this.game.running) {
		ctx.font = "24pt Impact";
		ctx.fillStyle = "Red";
		if (this.game.mouse) {
			ctx.fillStyle = "Pink";
		}

		ctx.textAlign = "center";
		ctx.fillText("WASD to move", 400, 340);
		ctx.fillText("LClick and RClick to shoot", 400, 370);
		ctx.fillText("LShift to boost", 400, 400);
		ctx.fillText("Space to perform a roll", 400, 430);
		ctx.fillText("Grab powerups to shoot more at once", 400, 460);
		ctx.fillText("Survive as long as you can!", 400, 490);
		ctx.fillText("Press Enter to start", 400, 520);
	}
}

/* ========================================================================================================== */
// Asset Manager aka Main
/* ========================================================================================================== */

var AM = new AssetManager();

AM.queueDownload("./img/space1-1.png");

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

AM.queueDownload("./img/SpaceExplosion.png");

AM.downloadAll(function () {
	console.log("starting up da sheild");
	var canvas = document.getElementById("gameWorld");
	var ctx = canvas.getContext("2d");

	var gameEngine = new GameEngine();

	gameEngine.init(ctx);
	gameEngine.start();

	gameEngine.running = false;

	var ship = new TheShip(gameEngine);
	var reticle = new Reticle(gameEngine);
	var background = new Background(gameEngine, AM.getAsset("./img/space1-1.png"));
	var pg = new PlayGame(gameEngine);

	gameEngine.addEntity(ship);
	gameEngine.addEntity(reticle);
	gameEngine.addEntity(background);
	gameEngine.addEntity(pg);

	gameEngine.ship = ship;



	console.log("All Done!");
});

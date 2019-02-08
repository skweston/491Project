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
  this.lifetime = 100;
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
	this.lifetime--;
	if (this.lifetime < 1){
		this.removeFromWorld = true;
	}
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
  this.lifetime = 100;
}

GroundExplosion.prototype.draw = function () {
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
  Entity.prototype.draw.call(this);
}

GroundExplosion.prototype.update = function () {
	this.lifetime--;
	if (this.lifetime < 1){
	this.removeFromWorld = true;
	}

}

function BloodSplatter(game, shipXMid, shipYMid) {
  this.pWidth = 32;
  this.pHeight = 32;
  this.scale = 2;
  //spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale
  this.animation = new Animation(AM.getAsset("./img/BloodSplatter.png"),
								 this.pWidth, this.pHeight,
								 7,  0.1, 7, false, this.scale);
  this.game = game;
  this.ctx = game.ctx;
  this.name = "Effect";
  this.xMid = shipXMid;
  this.yMid = shipYMid;
  this.lifetime = 100;
  //console.log("middle explosion: " + this.xMid + ", " + this.yMid);
  this.x = this.xMid - ((this.pWidth * this.scale) / 2);
  this.y = this.yMid - ((this.pHeight * this.scale) / 2);
  this.removeFromWorld = false; //need to remove from world when animation finishes.
}

BloodSplatter.prototype.draw = function () {
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
  //console.log("explosion: " + this.x + ", " + this.y);
  Entity.prototype.draw.call(this);
}

BloodSplatter.prototype.update = function () {
	this.lifetime--;
	if (this.lifetime < 1){
		this.removeFromWorld = true;
	}

}


function BossExplosion(game, xIn, yIn, chain, boss) {
  this.pWidth = 128;
  this.pHeight = 128;
  this.scale = 1;
  //spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale
  this.animation = new Animation(AM.getAsset("./img/BossExplosion.png"),
								 this.pWidth, this.pHeight,
								 24,  0.2, 24, false, this.scale);
  this.game = game;
  this.ctx = game.ctx;
  this.name = "Effect";
  this.x = xIn;
  this.y = yIn;
  this.boss = boss;
  this.speed = boss.speed;
  this.chain = chain - 1;
  this.lifetime = 150;

  this.removeFromWorld = false; //need to remove from world when animation finishes.

  this.xExplosionAdjust = 200-this.pWidth;
  this.yExplosionAdjust = 450-this.pHeight;
}

BossExplosion.prototype.draw = function () {
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
  //console.log("explosion: " + this.x + ", " + this.y);
  Entity.prototype.draw.call(this);
}

BossExplosion.prototype.update = function () {
	this.y -= this.game.clockTick * this.speed;
	this.lifetime--;
	if (this.lifetime < 1){
		this.removeFromWorld = true;
	}
	if (this.chain > 1){
		var chainedExplosion = new BossExplosion (this.game,
								this.boss.x + (Math.random() * this.xExplosionAdjust),
								this.boss.y+ (Math.random() * this.yExplosionAdjust),
								this.chain-1, this.boss);
		this.game.addEntity(chainedExplosion);
		this.chain--;
	}

}

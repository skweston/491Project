/* =========== General Effects ========= */
function SpaceExplosion(game, shipXMid, shipYMid, angle) {
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
  this.angle = angle;
  this.lifetime = 100;
  //console.log("middle explosion: " + this.xMid + ", " + this.yMid);
  this.x = this.xMid - ((this.pWidth * this.scale) / 2);
  this.y = this.yMid - ((this.pHeight * this.scale) / 2);
  this.removeFromWorld = false; //need to remove from world when animation finishes.
}

SpaceExplosion.prototype.draw = function () {
	if(onCamera(this)){
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}
  //console.log("explosion: " + this.x + ", " + this.y);
  Entity.prototype.draw.call(this);
}

SpaceExplosion.prototype.update = function () {
	if (this.animation.isDone()){
		this.removeFromWorld = true;
	}
	this.lifetime--;
	if (this.lifetime < 1){
		this.removeFromWorld = true;
	}
}

function GroundExplosion(game, spritesheet, shipX, shipY) {
	this.pWidth = 32;
	this.pHeight = 32;
	this.scale = 1;
	this.animation = new Animation(spritesheet, this.pWidth, this.pHeight, 2, 0.15, 6, true, this.scale);
	this.game = game;
	this.name = "Effect";
	this.ctx = game.ctx;
	this.x = shipX;
	this.y = shipY;
	this.angle = 0;
	this.xMid = 0; //this is a placeholver value.
	this.yMid = 0;
	this.lifetime = 100;
}

GroundExplosion.prototype.draw = function () {
	if(onCamera(this)){
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}
  Entity.prototype.draw.call(this);
}

GroundExplosion.prototype.update = function () {
	if (this.animation.isDone()){
		this.removeFromWorld = true;
	}
	this.lifetime--;
	if (this.lifetime < 1){
		this.removeFromWorld = true;
	}

}

function BloodSplatter(game, shipXMid, shipYMid, angle) {
  this.pWidth = 32;
  this.pHeight = 32;
  this.scale = 2;
  this.animation = new Animation(AM.getAsset("./img/BloodSplatter.png"), this.pWidth, this.pHeight, 7,  0.1, 7, false, this.scale);
  this.game = game;
  this.ctx = game.ctx;
  this.name = "Effect";
  this.xMid = shipXMid;
  this.yMid = shipYMid;
  this.angle = angle;
  this.lifetime = 100;
  this.x = this.xMid - ((this.pWidth * this.scale) / 2);
  this.y = this.yMid - ((this.pHeight * this.scale) / 2);
  this.lifetime = 100;

  this.removeFromWorld = false;
}

BloodSplatter.prototype.draw = function () {
	if(onCamera(this)){
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}

	Entity.prototype.draw.call(this);
}

BloodSplatter.prototype.update = function () {
	this.lifetime--;
	if (this.animation.isDone() || this.lifetime < 1) {
		this.removeFromWorld = true;
	}
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
  this.xMid =
  this.boss = boss;
  this.speed = boss.speed;
  this.chain = chain - 1;
  this.lifetime = 150;
  this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
  this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
  this.removeFromWorld = false; //need to remove from world when animation finishes.

  this.xExplosionAdjust = 200-this.pWidth;
  this.yExplosionAdjust = 450-this.pHeight;
}

BossExplosion.prototype.draw = function () {
	if(onCamera(this)){
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}
  //console.log("explosion: " + this.x + ", " + this.y);
  Entity.prototype.draw.call(this);
}

BossExplosion.prototype.update = function () {
	this.y -= this.game.clockTick * this.speed;
	if (this.animation.isDone()){
		this.removeFromWorld = true;
	}
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

function ScourgeDeath(game, xMid, yMid, angle) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 1.3;
	this.animation = new Animation(AM.getAsset("./img/enemyScourgeDeath.png"), this.pWidth, this.pHeight, 1152,  0.1, 9, false, this.scale);

	this.game = game;
	this.ctx = game.ctx;
	this.name = "Effect";
	this.xMid = xMid;
	this.yMid = yMid;
	this.angle = angle;
	this.x = this.xMid - ((this.pWidth * this.scale) / 2);
	this.y = this.yMid - ((this.pHeight * this.scale) / 2);
	this.lifetime = 100;
	this.removeFromWorld = false;
}

ScourgeDeath.prototype.update = function () {
	if (this.animation.isDone()){
		this.removeFromWorld = true;
	}
	this.lifetime--;
	if (this.lifetime < 1){
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

ScourgeDeath.prototype.draw = function () {
	if (onCamera(this)) {
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}

	Entity.prototype.draw.call(this);
}

function GuardianDeath(game, xMid, yMid, angle) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 1.2;
	this.animation = new Animation(AM.getAsset("./img/enemyGuardianDeath.png"), this.pWidth, this.pHeight, 1152,  0.1, 9, false, this.scale);

	this.game = game;
	this.ctx = game.ctx;
	this.name = "Effect";
	this.xMid = xMid;
	this.yMid = yMid;
	this.angle = angle;
	this.x = this.xMid - ((this.pWidth * this.scale) / 2);
	this.y = this.yMid - ((this.pHeight * this.scale) / 2);
	this.lifetime = 100;
	this.removeFromWorld = false;
}

GuardianDeath.prototype.update = function () {
	if (this.animation.isDone()){
		this.removeFromWorld = true;
	}
	this.lifetime--;
	if (this.lifetime < 1){
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

GuardianDeath.prototype.draw = function () {
	if (onCamera(this)) {
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}

	Entity.prototype.draw.call(this);
}

function QueenDeath(game, xMid, yMid, angle) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 2;
	this.animation = new Animation(AM.getAsset("./img/enemyQueenDeath.png"), this.pWidth, this.pHeight, 1152,  0.1, 9, false, this.scale);

	this.game = game;
	this.ctx = game.ctx;
	this.name = "Effect";
	this.xMid = xMid;
	this.yMid = yMid;
	this.angle = angle;
	this.x = this.xMid - ((this.pWidth * this.scale) / 2);
	this.y = this.yMid - ((this.pHeight * this.scale) / 2);
	this.lifetime = 100;
	this.removeFromWorld = false;
}

QueenDeath.prototype.update = function () {
	if (this.animation.isDone()){
		this.removeFromWorld = true;
	}
	this.lifetime--;
	if (this.lifetime < 1){
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

QueenDeath.prototype.draw = function () {
	if (onCamera(this)) {
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}

	Entity.prototype.draw.call(this);
}

function SpitHit(game, xMid, yMid, angle, adjustScale) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 2 * adjustScale;
	this.animation = new Animation(AM.getAsset("./img/enemySpitProjectileHit.png"), this.pWidth, this.pHeight, 1536,  0.1, 12, false, this.scale);

	this.game = game;
	this.ctx = game.ctx;
	this.name = "Effect";
	this.xMid = xMid;
	this.yMid = yMid;
	this.angle = angle;
	this.x = this.xMid - ((this.pWidth * this.scale) / 2);
	this.y = this.yMid - ((this.pHeight * this.scale) / 2);
	this.lifetime = 100;
	this.removeFromWorld = false;
}

SpitHit.prototype.update = function () {
	if (this.animation.isDone()){
		this.removeFromWorld = true;
	}
	this.lifetime--;
	if (this.lifetime < 1){
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

SpitHit.prototype.draw = function () {
	if (onCamera(this)) {
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}

	Entity.prototype.draw.call(this);
}

function BloodyMess(game, x, y, angle, chain, creature) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 1;
	this.animation = new Animation(AM.getAsset("./img/enemyQueenDeath.png"), this.pWidth, this.pHeight, 1152,  0.15, 9, false, this.scale);

	this.game = game;
	this.ctx = game.ctx;
	this.name = "Effect";

	this.x = x;
	this.y = y;
	this.angle = angle;
	this.creature = creature;
	this.chain = chain;
	this.xMid = (this.x + (this.pWidth * this.scale / 2));
	this.yMid = (this.y + (this.pHeight * this.scale / 2));
	this.lifetime = 100;
	this.removeFromWorld = false;
}

BloodyMess.prototype.draw = function () {
	if(onCamera(this)) {
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}

	Entity.prototype.draw.call(this);
}

BloodyMess.prototype.update = function () {
	if (this.animation.isDone() && this.chain < 0) {
		this.removeFromWorld = true;
	}
	this.lifetime--;
	if (this.lifetime < 1){
		this.removeFromWorld = true;
	}
	if (this.chain > 0) {
		var explosion = new BloodyMess(this.game,
									   this.creature.x + (Math.random() * this.creature.pWidth),
									   this.creature.y + (Math.random() * this.creature.pHeight),
									   (Math.random * 360) * Math.PI / 180,
									   this.chain - 1,
									   this.creature);
		this.game.addEntity(explosion);

		this.chain--;
	}

	Entity.prototype.update.call(this);
}

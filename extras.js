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

/* ========================================================================================================== */
// drops
/* ========================================================================================================== */

//SPREADER

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
	if(onCamera(this)){
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
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


//REPAIR

function RepairDrop(game) {
	this.pWidth = 256;
	this.pHeight = 256;
	this.scale = .25;
	this.animation = new Animation(AM.getAsset("./img/RepairDrop.png"), this.pWidth, this.pHeight, 1536, 0.15, 6, true, this.scale);

	this.name = "Extra";
	this.x = 0;
	this.y = 0;
	this.xMid = 0;
	this.yMid = 0;
	this.radius = this.scale * 128;
	this.angle = 0;

	this.lifetime = 500;

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

RepairDrop.prototype = new Entity();
RepairDrop.prototype.constructor = RepairDrop;

RepairDrop.prototype.update = function () {
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	if (Collide(this, this.game.ship)) {
		if(this.game.ship.health <= 90){
			this.game.ship.health += 10;
		}else {
			this.game.ship.health = 100;
		}
		this.removeFromWorld = true;
	}

	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

RepairDrop.prototype.draw = function () {
	if(onCamera(this)){
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
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

//SCRAP

function Scrap(game) {
	this.pWidth = 96;
	this.pHeight = 106;
	this.scale = .5;
	this.animation = new Animation(AM.getAsset("./img/scrap.png"), this.pWidth, this.pHeight, 288, 0.15, 3, true, this.scale);

	this.name = "Resource";
	this.x = 0;
	this.y = 0;
	this.xMid = 0;
	this.yMid = 0;
	this.radius = this.scale * 42;
	this.angle = Math.random() * Math.PI * 2;
	this.value = 10;
	this.speed = 1;

	this.isTargettedAlly = false;
	this.alliedTargeter = null

	this.isTargettedEnemy = false;
	this.enemyTargeter = null;

	this.lifetime = 1000;

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

Scrap.prototype = new Entity();
Scrap.prototype.constructor = Scrap;

Scrap.prototype.update = function () {

	//if its still moving, move it
	if (this.speed > 0){
		this.x += Math.cos(this.angle) * 10 * this.speed;
		this.y += Math.sin(this.angle) * 10 * this.speed;
		this.speed -= .0325;
		//update hitbox
		this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
		this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	}




	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

Scrap.prototype.draw = function () {
	if(onCamera(this)){
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
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

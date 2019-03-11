/* ========================================================================================================== */
// Extras
/* ========================================================================================================== */

function Reticle(game) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.25;
	this.reticleAnimation = new Animation(AM.getAsset("./img/shipReticle.png"), this.pWidth, this.pHeight, 256, 0.5, 2, true, this.scale);

	this.name = "Reticle";
	this.x = 0;
	this.y = 0;
	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

Reticle.prototype = new Entity();
Reticle.prototype.constructor = Reticle;

Reticle.prototype.update = function () {
	this.x = this.game.mouseX - (this.pWidth * this.scale / 2);
	this.y = this.game.mouseY - (this.pHeight * this.scale / 2);

	Entity.prototype.update.call(this);
}

Reticle.prototype.draw = function () {
	this.reticleAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0);

	Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// Drops
/* ========================================================================================================== */

/* Multishot ================================================================================================ */

function Multishot(game) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.75;
	this.animation = new Animation(AM.getAsset("./img/multishot.png"), this.pWidth, this.pHeight, 256, 0.15, 2, true, this.scale);

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

Multishot.prototype = new Entity();
Multishot.prototype.constructor = Multishot;

Multishot.prototype.update = function () {
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	if (Collide(this, this.game.ship)) {
		SCORE += 3;
		this.game.ship.multishotTimer = 1000;
		if (this.game.ship.multishotLevel < 2) {
			this.game.ship.multishotLevel++;
		}
		this.removeFromWorld = true;
	}

	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

Multishot.prototype.draw = function () {
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

/* Speed Up ================================================================================================= */

function SpeedUp(game) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.75;
	this.animation = new Animation(AM.getAsset("./img/speedUp.png"), this.pWidth, this.pHeight, 256, 0.15, 2, true, this.scale);

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

SpeedUp.prototype = new Entity();
SpeedUp.prototype.constructor = SpeedUp;

SpeedUp.prototype.update = function () {
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	if (Collide(this, this.game.ship)) {
		SCORE += 3;
		this.game.ship.speedTimer = 1000;
		if (this.game.ship.speedLevel < 2) {
			this.game.ship.speedLevel++;
		}
		this.removeFromWorld = true;
	}

	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

SpeedUp.prototype.draw = function () {
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

/* Damage Up ================================================================================================ */

function DamageUp(game) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.75;
	this.animation = new Animation(AM.getAsset("./img/damageUp.png"), this.pWidth, this.pHeight, 256, 0.15, 2, true, this.scale);

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

DamageUp.prototype = new Entity();
DamageUp.prototype.constructor = DamageUp;

DamageUp.prototype.update = function () {
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	if (Collide(this, this.game.ship)) {
		SCORE += 3;
		this.game.ship.damageTimer = 1000;
		if (this.game.ship.damageLevel < 2) {
			this.game.ship.damageLevel++;
		}
		this.removeFromWorld = true;
	}

	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

DamageUp.prototype.draw = function () {
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

/* Health Refill ============================================================================================ */

function HealthRefill(game) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.75;
	this.animation = new Animation(AM.getAsset("./img/healthRefill.png"), this.pWidth, this.pHeight, 512, 0.25, 4, true, this.scale);

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

HealthRefill.prototype = new Entity();
HealthRefill.prototype.constructor = HealthRefill;

HealthRefill.prototype.update = function () {
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	if (Collide(this, this.game.ship)) {
		SCORE += 3;
		if(this.game.ship.health <= this.game.ship.healthMax - 10){
			this.game.ship.health += 10;
		}else {
			this.game.ship.health = this.game.ship.healthMax;
		}
		this.removeFromWorld = true;
	}

	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

HealthRefill.prototype.draw = function () {
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

/* Boost Refill ============================================================================================= */


/* Scrap ==================================================================================================== */

function Scrap(game, value) {
	this.pWidth = 96;
	this.pHeight = 106;
	this.scale = .5 * (value/10);
	this.animation = new Animation(AM.getAsset("./img/scrap.png"), this.pWidth, this.pHeight, 288, 0.15, 3, true, this.scale);

	this.name = "Resource";
	this.x = 0;
	this.y = 0;
	this.xMid = 0;
	this.yMid = 0;
	this.radius = this.scale * 42;
	this.angle = Math.random() * Math.PI * 2;
	this.value = value;
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

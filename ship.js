/* ========================================================================================================== */
// The Ship
/* ========================================================================================================== */

function TheShip(game) {
	this.game = game;
	this.ctx = game.ctx;
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.5;
	this.idleAnimation = new Animation(AM.getAsset("./img/shipIdle.png"), this.pWidth, this.pHeight, 256, 0.03, 2, true, this.scale);
	this.boostAnimation = new Animation(AM.getAsset("./img/shipBoost.png"), this.pWidth, this.pHeight, 256, 0.03, 2, true, this.scale);
	this.rollAnimation = new Animation(AM.getAsset("./img/shipRoll.png"), this.pWidth, this.pHeight, 256, 0.03, 22, false, this.scale);
	this.boostRollAnimation = new Animation(AM.getAsset("./img/shipBoostRoll.png"), this.pWidth, this.pHeight, 256, 0.03, 22, false, this.scale);
	this.reticleAnimation = new Animation(AM.getAsset("./img/shipReticle.png"), this.pWidth, this.pHeight, 256, 0.5, 2, true, 0.25);

	this.invincible = false;
	this.name = "Player";
	this.health = 100;
	this.boostMax = 1000;
	this.boost = this.boostMax;
	this.speed = 0.5;
	this.boosting = false;
	this.cancelBoost = false;
	this.rolling = false;
	this.rollCooldown = 0;
	this.x = this.game.cameraCtx.canvas.width/2 - (this.pWidth * this.scale / 2);
	this.y = this.game.cameraCtx.canvas.height/2 - (this.pHeight * this.scale / 2);
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
	this.boostGainRate = 1;
	this.boostConsumeRate = 2;


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
	// boosting
	this.speed = 0.5;
	this.boosting = false;

	if (this.game.boost && !this.rolling && this.boost > 1) {
		this.cancelBoost = false;
		this.boosting = true;
		this.speed = 1;
		this.boost -= this.boostConsumeRate;
	}
	if (!this.game.boost && !this.rolling) {
		this.boosting = false;
		this.speed = 0.5;
		if (this.boost < this.boostMax){
			this.boost += this.boostGainRate;
		}
	}

	// boost input buffer during rolls
	if (this.game.boost && this.rolling) {
		this.boosting = true;
		this.speed = 1;
		this.cancelBoost = false;
	}
	if (!this.game.boost && this.rolling) {
		this.cancelBoost = true;
	}

	// movement
	var xMove = 0;
	var yMove = 0;
	if (this.game.moveUp) {
		if (this.yMid - this.radius > 0){
		yMove -= 10 * this.speed;
	}
	}
	if (this.game.moveLeft) {
		if (this.xMid - this.radius > 0) {
			xMove -= 10 * this.speed;
		}
	}
	if (this.game.moveDown) {
		if (this.yMid + this.radius < this.game.ctx.canvas.height) {
			yMove += 10 * this.speed;
		}
	}
	if (this.game.moveRight) {
		if (this.xMid + this.radius < this.game.ctx.canvas.width) {
			xMove += 10 * this.speed;
		}
	}

	if (xMove === 0) {
		this.y += yMove;
		if(this.game.camera.isScrolling){
			this.game.mouseY += yMove;
		}
	}
	else if (yMove === 0) {
		this.x += xMove;
		if(this.game.camera.isScrolling){
			this.game.mouseX += xMove;
		}
	}
	else {
		this.x += xMove * 0.7;
		this.y += yMove * 0.7;
		if(this.game.camera.isScrolling){
			this.game.mouseX += xMove * 0.7;
	 		this.game.mouseY += yMove * 0.7;
		}
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
	this.lifetime = 300;
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
	// if (this.xMid < -50 || this.xMid > 850 || this.yMid < -50 || this.yMid > 850) {
	// 	this.removeFromWorld = true;
	// }

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
	if(onCamera){
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
	this.lifetime = 300;
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
	// if (this.xMid < -50 || this.xMid > 850 || this.yMid < -50 || this.yMid > 850) {
	// 	this.removeFromWorld = true;
	// }

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
	if(onCamera){
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
	this.reticleAnimation.drawFrame(this.game.clockTick, this.game.ctx,
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
	// this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1; changed the way they spawn so it doesn't need to do this math constantly
	// this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

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

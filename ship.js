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
	this.chargeAnimation = new Animation(AM.getAsset("./img/shipSecondary2Charging.png"), this.pWidth, this.pHeight, 768, 0.05, 6, true, 1);
	this.orbiterAnimation = new Animation(AM.getAsset("./img/shipSecondary3.png"), this.pWidth, this.pHeight, 768, 0.15, 6, true, 0.3);

	if (DEBUG) {
		this.invincible = true;
	}
	else {
		this.invincible = false;
	}

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
	this.radius = 32 * this.scale;
	this.angle = 0;

	// weapons
	this.primaryType = 0;
	this.primaryTimer = 0;
	this.secondaryType = 0;
	this.secondaryTimer = 0;
	this.charging = true;
	this.charge = 0.5;
	this.orbiterAngle = 0;
	this.orbiter1 = {x: 0, y: 0};
	this.orbiter2 = {x: 0, y: 0};
	this.bombType = 0;
	this.bombTimer = 0;

	// power ups
	this.boostLevel = 0;
	this.boostTimer = 0;
	this.powerLevel = 0;
	this.powerTimer = 0;
	this.spreaderLevel = 0;
	this.spreaderTimer = 0;

	// miscellaneous
	this.boostGainRate = 1;
	this.boostConsumeRate = 2;
	this.bombAmmo = 0;

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
	if (this.primaryTimer > 0) {
		this.primaryTimer -= 1;
	}
	if (this.secondaryTimer > 0) {
		this.secondaryTimer -= 1;
	}
	if (this.bombTimer > 0) {
		this.bombTimer -= 1;
	}
	if (this.spreader > 0) {
		this.spreader -= 1;
	}
	if (this.spreader <= 0) {
		this.spreaderLevel = 0;
	}

	// primary weapons
	this.orbiterAngle += 0.1;
	if (this.orbiterAngle >= 360) {
		this.orbiterAngle = 0;
	}
	this.orbiter1.x = this.xMid + 100 * Math.cos(this.orbiterAngle / Math.PI);
	this.orbiter1.y = this.yMid + 100 * Math.sin(this.orbiterAngle / Math.PI);
	this.orbiter2.x = this.xMid - 100 * Math.cos(this.orbiterAngle / Math.PI);
	this.orbiter2.y = this.yMid - 100 * Math.sin(this.orbiterAngle / Math.PI);

	if (this.game.firePrimary && this.primaryTimer === 0) {
		if (this.primaryType === 0) { // laser
			this.primaryTimer = 10;

			for (var i = 0; i < 2; i++) {
				var offset = (0.5 * Math.pow(-1, i));
				this.createProjectile("P0", offset, 0);
			}
			if (this.spreaderLevel > 0) {
				for (var i = 0; i < 2; i++) {
					for (var j = 0; j < 2; j++) {
						var offset = (0.5 * Math.pow(-1, j));
						this.createProjectile("P0", offset, ((Math.PI / 12) * Math.pow(-1, i)));
					}
					if (this.spreaderLevel > 1) {
						for (var j = 0; j < 2; j++) {
							var offset = (0.5 * Math.pow(-1, j));
							this.createProjectile("P0", offset, ((Math.PI / 6) * Math.pow(-1, i)));
						}
					}
				}
			}
			if (this.secondaryType === 3) { // orbiters
				if (this.spreaderLevel === 0) {
					this.createOrbiterProjectile("P0", 0, 0);
				}
				else if (this.spreaderLevel === 1) {
					for (var i = 0; i < 2; i++) {
						this.createOrbiterProjectile("P0", 0, ((Math.PI / 24) * Math.pow(-1, i)));
					}
				}
				else {
					this.createOrbiterProjectile("P0", 0, 0);
					for (var i = 0; i < 2; i++) {
						this.createOrbiterProjectile("P0", 0, ((Math.PI / 24) * Math.pow(-1, i)));
					}
				}
			}
		}
		if (this.primaryType === 1) { // wave
			this.primaryTimer = 20;

			if (this.spreaderLevel === 0) {
				this.createProjectile("P1", 0, 0);
			}
			else if (this.spreaderLevel === 1) {
				for (var i = 0; i < 2; i++) {
					this.createProjectile("P1", 0, ((Math.PI / 30) * Math.pow(-1, i)));
				}
			}
			else {
				this.createProjectile("P1", 0, 0);
				for (var i = 0; i < 2; i++) {
					this.createProjectile("P1", 0, ((Math.PI / 20) * Math.pow(-1, i)));
				}
			}
			if (this.secondaryType === 3) { // orbiters
				if (this.spreaderLevel === 0) {
					this.createOrbiterProjectile("P1", 0, 0);
				}
				else if (this.spreaderLevel === 1) {
					for (var i = 0; i < 2; i++) {
						this.createOrbiterProjectile("P1", 0, ((Math.PI / 30) * Math.pow(-1, i)));
					}
				}
				else {
					this.createOrbiterProjectile("P1", 0, 0);
					for (var i = 0; i < 2; i++) {
						this.createOrbiterProjectile("P1", 0, ((Math.PI / 20) * Math.pow(-1, i)));
					}
				}
			}
		}
		if (this.primaryType === 2) { // bullets
			this.primaryTimer = 5;

			this.createProjectile("P2", 0, 0);
			if (this.spreaderLevel > 0) {
				for (var i = 0; i < 2; i++) {
					this.createProjectile("P2", 0, ((Math.PI / 24) * Math.pow(-1, i)));
					if (this.spreaderLevel > 1) {
						this.createProjectile("P2", 0, ((Math.PI / 12) * Math.pow(-1, i)));
					}
				}
			}
			if (this.secondaryType === 3) { // orbiters
				if (this.spreaderLevel === 0) {
					this.createOrbiterProjectile("P2", 0, 0);
				}
				else if (this.spreaderLevel === 1) {
					for (var i = 0; i < 2; i++) {
						this.createOrbiterProjectile("P2", 0, ((Math.PI / 24) * Math.pow(-1, i)));
					}
				}
				else {
					this.createOrbiterProjectile("P2", 0, 0);
					for (var i = 0; i < 2; i++) {
						this.createOrbiterProjectile("P2", 0, ((Math.PI / 24) * Math.pow(-1, i)));
					}
				}
			}
		}
		if (this.primaryType === 3) { // burst
			this.primaryTimer = 50;

			if (this.spreaderLevel === 0) {
				this.createProjectile("P3", 0, 0);
			}
			else if (this.spreaderLevel === 1) {
				for (var i = 0; i < 2; i++) {
					this.createProjectile("P3", 0, ((Math.PI / 16) * Math.pow(-1, i)));
				}
			}
			else {
				this.createProjectile("P3", 0, 0);
				for (var i = 0; i < 2; i++) {
					this.createProjectile("P3", 0, ((Math.PI / 8) * Math.pow(-1, i)));
				}
			}
			if (this.secondaryType === 3) { // orbiters
				if (this.spreaderLevel === 0) {
					this.createOrbiterProjectile("P3", 0, 0);
				}
				else if (this.spreaderLevel === 1) {
					for (var i = 0; i < 2; i++) {
						this.createOrbiterProjectile("P3", 0, ((Math.PI / 16) * Math.pow(-1, i)));
					}
				}
				else {
					this.createOrbiterProjectile("P3", 0, 0);
					for (var i = 0; i < 2; i++) {
						this.createOrbiterProjectile("P3", 0, ((Math.PI / 8) * Math.pow(-1, i)));
					}
				}
			}
		}
	}

	// secondary weapons
	if (this.game.fireSecondary && this.secondaryTimer === 0) {
		if (this.secondaryType === 0) { // rockets
			this.secondaryTimer = 50;

			this.createProjectile("S0", 0, 0);
			if (this.spreaderLevel > 0) {
				for (var i = 0; i < 2; i++) {
					this.createProjectile("S0", 0, ((Math.PI / 20) * Math.pow(-1, i)));
					if (this.spreaderLevel > 1) {
						this.createProjectile("S0", 0, ((Math.PI / 10) * Math.pow(-1, i)));
					}
				}
			}
		}
		if (this.secondaryType === 1) { // homing missile
			this.secondaryTimer = 70;

			if (this.spreaderLevel === 0) {
				this.createProjectile("S1", 0, 0);
			}
			else if (this.spreaderLevel === 1) {
				for (var i = 0; i < 2; i++) {
					this.createProjectile("S1", 0, ((Math.PI / 8) * Math.pow(-1, i)));
				}
			}
			else {
				this.createProjectile("S1", 0, 0);
				for (var i = 0; i < 2; i++) {
					this.createProjectile("S1", 0, ((Math.PI / 8) * Math.pow(-1, i)));
				}
			}
		}
		if (this.secondaryType === 2 && this.charge < 3) { // charge shot
			this.charging = true;
			this.charge += 0.01;
		}
	}
	if (!this.game.fireSecondary && this.secondaryType === 2 && this.charge > 0.5) {
		if (this.charge > 1) {
			if (this.primaryType === 0) {	// laser
				for (var i = 0; i < 10; i++) {
					this.createChargeShot("P0", Math.random() * Math.pow(-1, i) / 4, 0, 0);
				}
				if (this.spreaderLevel > 0) {
					for (var i = 0; i < 10; i++) {
						this.createChargeShot("P0", Math.random() * Math.pow(-1, i) / 4, 0, 0);
					}
				}
				if (this.spreaderLevel > 1) {
					for (var i = 0; i < 10; i++) {
						this.createChargeShot("P0", Math.random() * Math.pow(-1, i) / 4, 0, 0);
					}
				}
			}
			if (this.primaryType === 1) {	// wave
				if (this.charge > 1.5) {
					this.charge = 1.5;
				}
				if (this.spreaderLevel === 0) {
					this.createChargeShot("P1", 0, 0, 0);
					this.createChargeShot("P1", 0, 0, 1);
					this.createChargeShot("P1", 0, 0, 2);
				}
				else if (this.spreaderLevel === 1) {
					for (var i = 0; i < 2; i++) {
						this.createChargeShot("P1", 0, ((Math.PI / 30) * Math.pow(-1, i)), 0);
						this.createChargeShot("P1", 0, ((Math.PI / 30) * Math.pow(-1, i)), 1);
						this.createChargeShot("P1", 0, ((Math.PI / 30) * Math.pow(-1, i)), 2);
					}
				}
				else {
					this.createChargeShot("P1", 0, 0, 0);
					this.createChargeShot("P1", 0, 0, 1);
					this.createChargeShot("P1", 0, 0, 2);
					for (var i = 0; i < 2; i++) {
						this.createChargeShot("P1", 0, ((Math.PI / 20) * Math.pow(-1, i)), 0);
						this.createChargeShot("P1", 0, ((Math.PI / 20) * Math.pow(-1, i)), 1);
						this.createChargeShot("P1", 0, ((Math.PI / 20) * Math.pow(-1, i)), 2);
					}
				}
			}
			if (this.primaryType === 2) {	// bullet
				if (this.charge > 2) {
					this.charge = 2;
				}
				for (var i = 0; i < 15; i++) {
					this.createChargeShot("P2", 0, (Math.random() - 0.5) / 2, 0);
				}
				if (this.spreaderLevel > 0) {
					for (var i = 0; i < 15; i++) {
						this.createChargeShot("P2", 0, (Math.random() - 0.5) / 2, 0);
					}
				}
				if (this.spreaderLevel > 1) {
					for (var i = 0; i < 15; i++) {
						this.createChargeShot("P2", 0, (Math.random() - 0.5) / 2, 0);
					}
				}
			}
			if (this.primaryType === 3) {	// burst
				this.createChargeShot("P3", 0, 0, 0);
				if (this.spreaderLevel > 0) {
					this.createChargeShot("P3", 0, 0, 1);
				}
				if (this.spreaderLevel > 1) {
					this.createChargeShot("P3", 0, 0, 2);
				}
			}
		}
		this.charging = false;
		this.charge = 0.5;
	}
	if (!(this.secondaryType === 2)) {
		this.charging = false;
		this.charge = 0.5;
	}
	if (this.game.fireBomb && this.bombTimer === 0 && this.bombAmmo > 0) {
		if (this.bombType === 0) { // neutron bomb

		}
		if (this.bombType === 1) { // scatter mines

		}
		if (this.bombType === 2) { // bubble shield

		}
		if (this.bombType === 3) { // singularity

		}
	}
	if (this.game.swapPrimary) {
		this.primaryType++;
		if (this.primaryType > 3) {
			this.primaryType = 0;
		}
	}
	if (this.game.swapSecondary) {
		this.secondaryType++;
		if (this.secondaryType > 3) {
			this.secondaryType = 0;
		}
	}

	Entity.prototype.update.call(this);
}

TheShip.prototype.createProjectile = function(type, offset, adjustAngle) {
	var dist = 1000 * distance({xMid: this.xMid, yMid: this.yMid},
							   {xMid: this.game.mouseX, yMid: this.game.mouseY});
	var angle = this.angle + adjustAngle;
	if (type === "P0") {
		var projectile = new ShipPrimary0(this.game, 1);
	}
	if (type === "P1") {
		var projectile = new ShipPrimary1(this.game, 1);
	}
	if (type === "P2") {
		var projectile = new ShipPrimary2(this.game, 1);
	}
	if (type === "P3") {
		var projectile = new ShipPrimary3(this.game, 1);
	}
	if (type === "S0") {
		var projectile = new ShipSecondary0(this.game);
	}
	if (type === "S1") {
		var projectile = new ShipSecondary1(this.game);
	}
	var target = {x: Math.cos(angle) * dist + this.xMid,
				  y: Math.sin(angle) * dist + this.yMid};
	var dir = direction(target, {x: this.xMid, y: this.yMid});
	projectile.damage = projectile.damage + (projectile.damage * this.powerLevel / 2);
	projectile.x = this.xMid - (projectile.pWidth * projectile.scale / 2) +
				   ((projectile.pWidth * projectile.scale / 2) * Math.cos(angle + offset)) + this.radius / 2 * Math.cos(angle);
	projectile.y = this.yMid - (projectile.pHeight * projectile.scale / 2) +
				   ((projectile.pHeight * projectile.scale / 2) * Math.sin(angle + offset)) + this.radius / 2 *  Math.sin(angle);
	projectile.velocity.x = dir.x * projectile.maxSpeed;
	projectile.velocity.y = dir.y * projectile.maxSpeed;
	projectile.angle = angle;

	this.game.addEntity(projectile);
}

TheShip.prototype.createChargeShot = function(type, offset, adjustAngle, spreadNum) {
	var dist = 1000 * distance({xMid: this.xMid, yMid: this.yMid},
							   {xMid: this.game.mouseX, yMid: this.game.mouseY});
	var angle = this.angle + adjustAngle;
	if (type === "P0") {
		var projectile = new ShipPrimary0(this.game, 1 * this.charge);
		projectile.maxSpeed *= (0.7 + Math.random());
	}
	if (type === "P1") {
		if (spreadNum === 1) {
			var projectile = new ShipPrimary1(this.game, 1 * this.charge * 0.75);
			projectile.damage *= 0.75 * 0.5;
		}
		else if (spreadNum === 2) {
			var projectile = new ShipPrimary1(this.game, 1 * this.charge * 0.75 * 0.75);
			projectile.damage *=  0.75 * 0.75 * 0.5;
		}
		else {
			var projectile = new ShipPrimary1(this.game, 1 * this.charge);
			projectile.damage *= 0.5;
		}
	}
	if (type === "P2") {
		var projectile = new ShipPrimary2(this.game, 1 * this.charge);
		projectile.maxSpeed *= Math.random();
	}
	if (type === "P3") {
		var projectile = new ShipPrimary3(this.game, 1 * this.charge);
		if (spreadNum === 1) {
			projectile.maxSpeed *= 0.5;
			projectile.lifetime *= 0.5;
		}
		if (spreadNum === 2) {
			projectile.maxSpeed *= 0.15;
			projectile.lifetime *= 0.15;
		}
	}
	var target = {x: Math.cos(angle) * dist + this.xMid,
				  y: Math.sin(angle) * dist + this.yMid};
	var dir = direction(target, {x: this.xMid, y: this.yMid});
	projectile.damage = (projectile.damage + (projectile.damage * this.powerLevel / 2)) * this.charge * this.charge;
	projectile.x = this.xMid - (projectile.pWidth * projectile.scale / 2) +
				   ((projectile.pWidth * projectile.scale / 2) * Math.cos(angle + offset)) + this.radius / 2 * Math.cos(angle);
	projectile.y = this.yMid - (projectile.pHeight * projectile.scale / 2) +
				   ((projectile.pHeight * projectile.scale / 2) * Math.sin(angle + offset)) + this.radius / 2 *  Math.sin(angle);
	projectile.velocity.x = dir.x * projectile.maxSpeed;
	projectile.velocity.y = dir.y * projectile.maxSpeed;
	projectile.angle = angle;

	this.game.addEntity(projectile);
}

TheShip.prototype.createOrbiterProjectile = function(type, offset, adjustAngle) {
	var dist = 1000 * distance({xMid: this.xMid, yMid: this.yMid},
							   {xMid: this.game.mouseX, yMid: this.game.mouseY});
	var angle = this.angle + adjustAngle;
	if (type === "P0") {
		var projectile1 = new ShipPrimary0(this.game, 0.6);
		var projectile2 = new ShipPrimary0(this.game, 0.6);
	}
	if (type === "P1") {
		var projectile1 = new ShipPrimary1(this.game, 0.3);
		var projectile2 = new ShipPrimary1(this.game, 0.3);
	}
	if (type === "P2") {
		var projectile1 = new ShipPrimary2(this.game, 0.8);
		var projectile2 = new ShipPrimary2(this.game, 0.8);
	}
	if (type === "P3") {
		var projectile1 = new ShipPrimary3(this.game, 0.5);
		var projectile2 = new ShipPrimary3(this.game, 0.5);
	}
	var target1 = {x: Math.cos(angle) * dist + this.orbiter1.x,
				   y: Math.sin(angle) * dist + this.orbiter1.y};
	var target2 = {x: Math.cos(angle) * dist + this.orbiter2.x,
				   y: Math.sin(angle) * dist + this.orbiter2.y};
	var dir = direction(target1, this.orbiter1);

	projectile1.damage = (projectile1.damage + (projectile1.damage * this.powerLevel / 2)) * 0.6;
	projectile2.damage = (projectile2.damage + (projectile2.damage * this.powerLevel / 2)) * 0.6;

	projectile1.x = this.orbiter1.x - (projectile1.pWidth * projectile1.scale / 2);
	projectile1.y = this.orbiter1.y - (projectile1.pHeight * projectile1.scale / 2);
	projectile2.x = this.orbiter2.x - (projectile2.pWidth * projectile2.scale / 2);
	projectile2.y = this.orbiter2.y - (projectile2.pHeight * projectile2.scale / 2);

	projectile1.velocity.x = dir.x * projectile1.maxSpeed;
	projectile1.velocity.y = dir.y * projectile1.maxSpeed;
	projectile2.velocity.x = dir.x * projectile1.maxSpeed;
	projectile2.velocity.y = dir.y * projectile2.maxSpeed;

	projectile1.angle = angle;
	projectile2.angle = angle;

	this.game.addEntity(projectile1);
	this.game.addEntity(projectile2);
}

TheShip.prototype.draw = function () {
	if (!this.game.running) return;
	if (this.charging) {
		this.chargeAnimation.drawFrame(this.game.clockTick, this.ctx, this.x - (this.pWidth * 0.5 / 2), this.y - (this.pHeight * 0.5 / 2), this.angle);
	}
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

	if (this.secondaryType === 3) {
		this.orbiterAnimation.drawFrame(this.game.clockTick, this.ctx,
										this.orbiter1.x - (this.pWidth * 0.3 / 2),
										this.orbiter1.y - (this.pHeight * 0.3 / 2),
										this.angle);
		this.orbiterAnimation.drawFrame(this.game.clockTick, this.ctx,
										this.orbiter2.x - (this.pWidth * 0.3 / 2),
										this.orbiter2.y - (this.pHeight * 0.3 / 2),
										this.angle);
	}

	if (SHOW_HITBOX) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = "Red";
		this.ctx.lineWidth = 1;
		this.ctx.arc(this.xMid, this.yMid, this.radius, 0, Math.PI * 2, false);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// Ship Primary Weapons
/* ========================================================================================================== */

function ShipPrimary0(game, adjustScale) {	// laser
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.5 * adjustScale;
	this.animation = new Animation(AM.getAsset("./img/shipPrimary0.png"), this.pWidth, this.pHeight, 256, 0.15, 2, true, this.scale);

	this.name = "PlayerProjectile";
	this.x = 0;
	this.y = 0;
	this.xMid = 0;
	this.yMid = 0;
	this.radius = 10 * this.scale;
	this.pierce = false;
	this.angle = 0;
	this.lifetime = 300;
	this.damage = 4;
	this.maxSpeed = 1500;
	this.velocity = {x: 0, y: 0};

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

ShipPrimary0.prototype = new Entity();
ShipPrimary0.prototype.constructor = ShipPrimary0;

ShipPrimary0.prototype.update = function () {
	this.x += this.velocity.x * this.game.clockTick;
	this.y += this.velocity.y * this.game.clockTick;
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

ShipPrimary0.prototype.draw = function () {
	if (onCamera(this)) {
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}

	if (SHOW_HITBOX) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = "Red";
		this.ctx.lineWidth = 1;
		this.ctx.arc(this.xMid, this.yMid, this.radius, 0, Math.PI * 2, false);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	Entity.prototype.draw.call(this);
}

function ShipPrimary1(game, adjustScale) {	// wave
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.65 * adjustScale;
	this.animation = new Animation(AM.getAsset("./img/shipPrimary1.png"), this.pWidth, this.pHeight, 384, 0.1, 3, true, this.scale);
	this.name = "PlayerProjectile";
	this.x = 0;
	this.y = 0;
	this.xMid = 0;
	this.yMid = 0;
	this.radius = 64 * this.scale;
	this.angle = 0;
	this.pierce = true;
	this.lifetime = 100;
	this.damage = 0.75;
	this.maxSpeed = 500;
	this.velocity = {x: 0, y: 0};

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

ShipPrimary1.prototype = new Entity();
ShipPrimary1.prototype.constructor = ShipPrimary1;

ShipPrimary1.prototype.update = function () {
	this.x += this.velocity.x * this.game.clockTick;
	this.y += this.velocity.y * this.game.clockTick;
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

ShipPrimary1.prototype.draw = function () {
	if (onCamera(this)) {
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}

	if (SHOW_HITBOX) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = "Red";
		this.ctx.lineWidth = 1;
		this.ctx.arc(this.xMid, this.yMid, this.radius, 0, Math.PI * 2, false);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	Entity.prototype.draw.call(this);
}

function ShipPrimary2(game, adjustScale) {	// bullet
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.25 * adjustScale;
	this.animation = new Animation(AM.getAsset("./img/shipPrimary2.png"), this.pWidth, this.pHeight, 256, 0.15, 2, true, this.scale);

	this.name = "PlayerProjectile";
	this.x = 0;
	this.y = 0;
	this.xMid = 0;
	this.yMid = 0;
	this.radius = 12 * this.scale;
	this.pierce = false;
	this.angle = 0;
	this.lifetime = 100;
	this.damage = 2;
	this.maxSpeed = 700;
	this.velocity = {x: 0, y: 0};

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

ShipPrimary2.prototype = new Entity();
ShipPrimary2.prototype.constructor = ShipPrimary2;

ShipPrimary2.prototype.update = function () {
	this.x += this.velocity.x * this.game.clockTick;
	this.y += this.velocity.y * this.game.clockTick;
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

ShipPrimary2.prototype.draw = function () {
	if (onCamera(this)) {
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}

	if (SHOW_HITBOX) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = "Red";
		this.ctx.lineWidth = 1;
		this.ctx.arc(this.xMid, this.yMid, this.radius, 0, Math.PI * 2, false);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	Entity.prototype.draw.call(this);
}

function ShipPrimary3(game, adjustScale) {	// burst shot
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 1 * adjustScale;
	this.animation = new Animation(AM.getAsset("./img/shipPrimary3Idle.png"), this.pWidth, this.pHeight, 768, 0.05, 6, true, this.scale);

	this.name = "PlayerProjectile";
	this.x = 0;
	this.y = 0;
	this.xMid = 0;
	this.yMid = 0;
	this.radius = 14 * this.scale;
	this.pierce = false;
	this.angle = 0;
	this.lifetime = 25;
	this.damage = 10;
	this.maxSpeed = 200;
	this.velocity = {x: 0, y: 0};

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

ShipPrimary3.prototype = new Entity();
ShipPrimary3.prototype.constructor = ShipPrimary3;

ShipPrimary3.prototype.update = function () {
	this.x += this.velocity.x * this.game.clockTick;
	this.y += this.velocity.y * this.game.clockTick;
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;

		var projectile = new ShipPrimary3Blast(this.game, this.scale);
		projectile.damage = projectile.damage * this.damage;
		projectile.angle = this.angle;
		projectile.x = this.xMid - (projectile.pWidth * projectile.scale / 2) +
					   ((projectile.pWidth * projectile.scale / 2) * Math.cos(this.angle)) + this.radius / 2 * Math.cos(this.angle);
		projectile.y = this.yMid - (projectile.pHeight * projectile.scale / 2) +
					   ((projectile.pHeight * projectile.scale / 2) * Math.sin(this.angle)) + this.radius / 2 *  Math.sin(this.angle);

		this.game.addEntity(projectile);
	}

	Entity.prototype.update.call(this);
}

ShipPrimary3.prototype.draw = function () {
	if (onCamera(this)) {
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}

	if (SHOW_HITBOX) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = "Red";
		this.ctx.lineWidth = 1;
		this.ctx.arc(this.xMid, this.yMid, this.radius, 0, Math.PI * 2, false);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	Entity.prototype.draw.call(this);
}

function ShipPrimary3Blast(game, adjustScale) {	// burst blast
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 1 * adjustScale;
	this.animation = new Animation(AM.getAsset("./img/shipPrimary3Burst.png"), this.pWidth, this.pHeight, 640, 0.05, 5, true, this.scale);

	this.name = "PlayerProjectile";
	this.x = 0;
	this.y = 0;
	this.xMid = 0;
	this.yMid = 0;
	this.radius = 65 * this.scale;
	this.pierce = true;
	this.angle = 0;
	this.lifetime = 16;
	this.damage = 0.35;
	this.maxSpeed = 0;
	this.velocity = {x: 0, y: 0};

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

ShipPrimary3Blast.prototype = new Entity();
ShipPrimary3Blast.prototype.constructor = ShipPrimary3Blast;

ShipPrimary3Blast.prototype.update = function () {
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

ShipPrimary3Blast.prototype.draw = function () {
	if (onCamera(this)) {
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}

	if (SHOW_HITBOX) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = "Red";
		this.ctx.lineWidth = 1;
		this.ctx.arc(this.xMid, this.yMid, this.radius, 0, Math.PI * 2, false);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// Ship Secondary Weapons
/* ========================================================================================================== */

function ShipSecondary0(game) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.5;
	this.animation = new Animation(AM.getAsset("./img/shipSecondary0.png"), this.pWidth, this.pHeight, 384, 0.15, 3, true, this.scale);

	this.name = "PlayerProjectile";
	this.x = 0;
	this.y = 0;
	this.xMid = 0;
	this.yMid = 0;
	this.radius = 20 * this.scale;
	this.angle = 0;
	this.pierce = false;
	this.lifetime = 300;
	this.damage = 15;
	this.maxSpeed = 500;
	this.velocity = {x: 0, y: 0};

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

ShipSecondary0.prototype = new Entity();
ShipSecondary0.prototype.constructor = ShipSecondary0;

ShipSecondary0.prototype.update = function () {
	this.x += this.velocity.x * this.game.clockTick;
	this.y += this.velocity.y * this.game.clockTick;
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

ShipSecondary0.prototype.draw = function () {
	if (onCamera(this)) {
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}

	if (SHOW_HITBOX) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = "Red";
		this.ctx.lineWidth = 1;
		this.ctx.arc(this.xMid, this.yMid, this.radius, 0, Math.PI * 2, false);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	Entity.prototype.draw.call(this);
}

function ShipSecondary1(game) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.5;
	this.idleAnimation = new Animation(AM.getAsset("./img/shipSecondary1Idle.png"), this.pWidth, this.pHeight, 512, 0.15, 4, true, this.scale);
	this.homingAnimation = new Animation(AM.getAsset("./img/shipSecondary1Homing.png"), this.pWidth, this.pHeight, 512, 0.15, 4, true, this.scale);

	this.name = "PlayerProjectile";
	this.x = 0;
	this.y = 0;
	this.xMid = 0;
	this.yMid = 0;
	this.radius = 20 * this.scale;
	this.angle = 0;
	this.pierce = false;
	this.lifetime = 100;
	this.damage = 20;
	this.maxSpeed = 350;
	this.velocity = {x: 0, y: 0};
	this.homing = false;
	this.detectRadius = 200;

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

ShipSecondary1.prototype = new Entity();
ShipSecondary1.prototype.constructor = ShipSecondary1;

ShipSecondary1.prototype.update = function () {
	var found = false;
	var acceleration = 1000000;
	var ent;
	for (var i = 0; i < this.game.enemies.length; i++) {
		ent = this.game.enemies[i];
		if (Collide({xMid: this.xMid, yMid: this.yMid, radius: this.detectRadius}, ent)) {
			var dist = distance(this, ent);
			var difX = (ent.xMid - this.xMid) / dist;
			var difY = (ent.yMid - this.yMid) / dist;
			this.velocity.x += difX * acceleration / (dist * dist);
			this.velocity.y += difY * acceleration / (dist * dist);
			found = true;
			break;
		}
	}
	if (found) {
		this.homing = true;
		this.maxSpeed = 700;
	}
	else {
		this.homing = false;
		this.maxSpeed = 350;
	}

	var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
	if (speed > this.maxSpeed) {
		var ratio = this.maxSpeed / speed;
		this.velocity.x *= ratio;
		this.velocity.y *= ratio;
	}

	// update angle
	var dx = (this.xMid + this.velocity.x) - this.xMid;
	var dy = this.yMid - (this.yMid + this.velocity.y);
	this.angle = -Math.atan2(-this.velocity.y,this.velocity.x);

	this.x += this.velocity.x * this.game.clockTick;
	this.y += this.velocity.y * this.game.clockTick;
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;
	}

	Entity.prototype.update.call(this);
}

ShipSecondary1.prototype.draw = function () {
	if (onCamera(this)) {
		if (this.homing) {
			this.homingAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
		}
		else {
			this.idleAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
		}
	}

	if (SHOW_HITBOX) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = "Red";
		this.ctx.lineWidth = 1;
		this.ctx.arc(this.xMid, this.yMid, this.radius, 0, Math.PI * 2, false);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	Entity.prototype.draw.call(this);
}
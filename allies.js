function PurpleChroma(game) {

	this.pWidth = 32;
	this.pHeight = 32;
	this.scale = 2;
	this.animation = new Animation(AM.getAsset("./img/PurpleChroma.png"), this.pWidth, this.pHeight, 64, 0.2, 2, true, this.scale);
	this.angle = 0;
	this.name = "Ally";
	this.speed = 0.65;
	this.x = 0;
	this.y = 0;
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
	this.radius = 41 * this.scale;
	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
	this.health = 75;
	this.damage = 20;
	//console.log("starting health: " + this.health);
	Entity.call(this, game, this.x, this.y);
}

PurpleChroma.prototype = new Entity();
PurpleChroma.prototype.constructor = PurpleChroma;

PurpleChroma.prototype.update = function () {
	// update angle
	var dx = this.game.ship.xMid - this.xMid;
	var dy = this.yMid - this.game.ship.yMid;
	this.angle = -Math.atan2(dy,dx);

	// move the scourge
	this.x += Math.cos(this.angle) * 10 * this.speed;
	this.y += Math.sin(this.angle) * 10 * this.speed;

	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	// check collision with player projectiles
	for (var i = 0; i < this.game.playerProjectiles.length; i++ ) {
		var ent = this.game.playerProjectiles[i];
		if (Collide(this, ent)) {
			this.takeDamage(ent.damage);
			ent.removeFromWorld = true;
			var splatter = new BloodSplatter(this.game, this.xMid, this.yMid);
			splatter.angle = this.angle;
			this.game.addEntity (splatter);
			if (this.health < 1) {
				break;
			}
		}
	}

	// check collision with ship
	if (!this.game.ship.rolling && Collide(this, this.game.ship)) {
		this.game.ship.takeDamage(this.damage);
		this.removeFromWorld = true;
	}

	// check health
	if (this.health < 1) {
		SCORE++;

		if (Math.random() * 100 < 20) {
			var spreader = new Spreader(this.game);
			spreader.x = this.xMid - (spreader.pWidth * spreader.scale / 2);
			spreader.y = this.yMid - (spreader.pHeight * spreader.scale / 2);
			spreader.xMid = this.xMid;
			spreader.yMid = this.yMid;

			this.game.addEntity(spreader);
		}
		for(var i = 0; i< 5; i++){
			var scrap = new Scrap(this.game);
			scrap.x = this.xMid - (scrap.pWidth*scrap.scale /2);
			scrap.y = this.yMid - (scrap.pHeight*scrap.scale /2);
			scrap.xMid = this.xMid;
			scrap.yMid = this.yMid;
			this.game.addEntity(scrap);
		}
		this.removeFromWorld = true;
	}

	if (this.removeFromWorld) {
		var explosion = new SpaceExplosion(this.game, this.xMid, this.yMid);
		this.game.addEntity(explosion);
	}

	Entity.prototype.update.call(this);
}

PurpleChroma.prototype.draw = function () {
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

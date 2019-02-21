/* ========================================================================================================== */
// asteroid
/* ========================================================================================================== */
/*
function Asteroid(game) {
	this.pWidth = 520;
	this.pHeight = 520;
	this.scale = 1.0;

	this.animation = new Animation(AM.getAsset("./img/Asteroid.png"),
								 this.pWidth, this.pHeight,
								 520, 1, 1,
								 true, this.scale);
	this.game = game;
	this.ctx = game.ctx;
	this.name = "Terrain";
	this.x = 0;
	this.y = 0;
	this.removeFromWorld = false; //there needs to be SOME way to make this true;

//this is for collision
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
	this.radius = 520 * this.scale;

}
Asteroid.prototype.draw = function () {
	if(onCamera(this)){
  		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
  	}
	Entity.prototype.draw.call(this);
}
Asteroid.prototype.update = function () {

	this.angle += 0.0125;

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
			var spreader = new Spreader(this.game);
			spreader.x = this.xMid - (spreader.pWidth * spreader.scale / 2);
			spreader.y = this.yMid - (spreader.pHeight * spreader.scale / 2);
			spreader.xMid = this.xMid;
			spreader.yMid = this.yMid;
			this.game.addEntity(spreader);
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

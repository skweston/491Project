/* ========================================================================================================== */
// asteroid
/* ========================================================================================================== */

function Asteroid(game, x, y) {
	this.pWidth = 520;
	this.pHeight = 520;
	this.scale = 0.5;

	this.animation = new Animation(AM.getAsset("./img/Asteroid.png"),
								 this.pWidth, this.pHeight,
								 520, 1, 1,
								 true, this.scale);
	this.game = game;
	this.ctx = game.ctx;
	this.name = "Terrain";
	this.x = x;
	this.y = y;
	this.scrapPerTick = 1;
	this.maxScrapCooldown = 120;
	this.scrapCooldown = this.maxScrapCooldown;
	this.hasbase = false;
	this.base = null;
	this.removeFromWorld = false; //there needs to be SOME way to make this true;
	this.angle = 0;
	



//this is for collision
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
	this.radius = 350 * this.scale;

}
Asteroid.prototype = new Entity();
Asteroid.prototype.constructor = Asteroid;
Asteroid.prototype.draw = function () {
	if(onCamera(this)){
  		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
  	}
	Entity.prototype.draw.call(this);
}
Asteroid.prototype.update = function () {

	this.angle += 0.000125;
	if (this.hasbase){
		this.scrapCooldown--;
		if (this.scrapCooldown < 1){
			for(var i = 0; i < this.scrapPerTick; i++){
				var scrap = new Scrap(this.game);
				scrap.x = this.base.xMid - (scrap.pWidth*scrap.scale /2);
				scrap.y = this.base.yMid - (scrap.pHeight*scrap.scale /2);
				scrap.xMid = this.xMid;
				scrap.yMid = this.yMid;
				this.game.addEntity(scrap);
				this.scrapCooldown = this.maxScrapCooldown;
			}
		}
	}



	//does it blow up when it dies?
	if (this.removeFromWorld) {
		var explosion = new SpaceExplosion(this.game, this.xMid, this.yMid, this.angle);
		this.game.addEntity(explosion);
	}
	Entity.prototype.update.call(this);
}

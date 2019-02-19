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
/* ========================================================================================================== */
// Spawner - allied space station
/* ========================================================================================================== */
function SpaceStation(game) {
    //Specific to spawners:
    this.timerReset = 500;
    this.generateGatherer = this.timerReset;
    this.maxSpawn = 5; // maybe make this a difficulty variable.

    this.pWidth = 512;
    this.pHeight = 512;
    this.scale = .5;
	this.animation = new Animation(AM.getAsset("./img/SpaceStation.png"), this.pWidth, this.pHeight, 1024, 0.25, 2, true, this.scale);
    this.name = "Ally";
    this.x = 500;
    this.y = 500;
    this.xMid = this.x + (this.pWidth * this.scale) / 2;
    this.yMid = this.y + (this.pHeight * this.scale) / 2;
    this.radius = 475 * this.scale;
    this.speed = 0;
    this.angle = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.removeFromWorld = false;
    this.health = 5000;


	//the spawns that the spawner 'owns'
	this.spawns = [
                            new PurpleChroma(this.game);

                            //new Scourge(game, AM.getAsset("./img/scourge.png"), x + 30, y + 30),
                            //new Scourge(game, AM.getAsset("./img/scourge.png"), x + 40, y + 40),
                            //new Scourge(game, AM.getAsset("./img/scourge.png"), x + 50, y + 50),
    ];
}
SpaceStation.prototype = new Entity();
SpaceStation.prototype.constructor = SpaceStation;

SpaceStation.prototype.update = function () {

    if(this.health < 1){
      this.removeFromWorld = true;
	}
	this.health += 0.5;
/* Dont need this as the spawner should remain stationary
    //this.x += this.game.clockTick * this.speed;
    //if (this.x > 800) this.x = -230;
    var dx = this.game.mouseX - this.xMid-1;
    var dy = (this.yMid - this.game.mouseY)-1;
    // this should be the angle in radians
    this.angle = -Math.atan2(dy,dx);
    //if we want it in degrees
    //this.angle *= 180 / Math.PI;
*/
	//timer reaches 0 Enter
	if(this.generateGatherer <1){
		var ent = new MechanicalResourceGatherer(this.game);
		ent.x =
	}
    if (this.game.playerResources > 100 ){
		//checks all spawns if they are alive, once one is found that isn't it tips flag and inserts it to game
        for (let i = 0, flag = true; i < this.maxSpawn && flag; i++) {

            if (this.spawns[i].removeFromWorld === false) {
                flag = false;
                this.game.addEntity(this.spawns[i], this.x, this.y);
            }
        }
		//set the timer back, even if nothing is released because of max being reached.
        this.generateEnemy = this.timerReset;
    }

	this.angle += 0.05;
    Entity.prototype.update.call(this);
}

SpaceStation.prototype.draw = function () {
	if(onCamera(this)){
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}
    //Entity.prototype.draw.call(this);
}


/* ========================================================================================================== */
// Resource Gatherer Enemy
/* ========================================================================================================== */
function MechanicalResourceGatherer(game) {


	this.pWidth = 54;
	this.pHeight = 51;
	this.scale = 1;

  	// Stuff gets passed into an animation object in this order:
  	// spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale

	this.animation = new Animation(AM.getAsset("./img/MechanicalResourceGatherer.png"),
								 this.pWidth, this.pHeight,
								 324, .125, 2, true, this.scale);
	this.game = game;
	this.ctx = game.ctx;
	this.name = "Ally";
	this.x = 50;
	this.y = 50;
	this.angle = 0;
	this.removeFromWorld = false; //there needs to be SOME way to make this true;
///////////Above this is MANDATORY for all entities////////////////////////
//If it's killable
	this.health = 55;

//this is for collision
	this.xMid = this.x + (this.pWidth * this.scale) / 2;
	this.yMid = this.y + (this.pHeight * this.scale) / 2;
	this.radius = 40 * this.scale;

//this is for movement
	this.speed = .35;

//this is for if it needs to decay off the lists, like an explostion
	//this.lifetime = 100; //when this reaches 0, it is removed from world

//Add other variables to objects for whatever added functionality you need
	//this.sampleValue = sample Magic Number;

	this.target = null;


}

MechanicalResourceGatherer.prototype = new Entity();
MechanicalResourceGatherer.prototype.constructor = MechanicalResourceGatherer;

MechanicalResourceGatherer.prototype.draw = function () {
	if(onCamera(this)){
  		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
  	}
	Entity.prototype.draw.call(this);
}

MechanicalResourceGatherer.prototype.update = function () {

	//something likethis for an Effect
	//this.lifetime--;
	if (this.health < 1){
		this.removeFromWorld = true;
		return;
	}

	//if it hasn't found its target yet, or its target has become undefined
	if (!this.target){
		var closest = 100000000;

		//find the closest resource node to gather from
		for (var i = 0; i<this.game.resources.length; i++){
			var ent = this.game.resources[i];
			var d = distance(this, ent);
			if(d < closest){
				closest = d;
				this.target = ent;

			}
		}
	}
	if (this.target && Collide(this, this.target)){
		this.target.removeFromWorld = true;
		this.game.playerResources += this.target.value;
		this.target = null;
	}

	// update angle
	if(this.target){
		var dx = this.target.xMid - this.xMid;
		var dy = this.yMid - this.target.yMid;
		this.angle = -Math.atan2(dy,dx);
	}

	// move the thing
	this.x += Math.cos(this.angle) * 10 * this.speed;
	this.y += Math.sin(this.angle) * 10 * this.speed;

	//update its hitbox
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;


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




	// check health
	if (this.health < 1) {
		SCORE++; //how many points is it worth

		//does it drop a powerup?
		// if (Math.random() * 100 < 20) { //the 20 here is the % chance it drops
		// 	var spreader = new Spreader(this.game);
		// 	spreader.x = this.xMid - (spreader.pWidth * spreader.scale / 2);
		// 	spreader.y = this.yMid - (spreader.pHeight * spreader.scale / 2);
		// 	spreader.xMid = this.xMid;
		// 	spreader.yMid = this.yMid;
		//
		// 	this.game.addEntity(spreader);
		// }

		this.removeFromWorld = true;
	}

	//does it blow up when it dies?
	if (this.removeFromWorld) {
		var explosion = new SpaceExplosion(this.game, this.xMid, this.yMid, this.angle);
		this.game.addEntity(explosion);
	}

	Entity.prototype.update.call(this);


}

function PurpleChroma(game, spawner) {

	this.pWidth = 32;
	this.pHeight = 32;
	this.scale = 2;
	this.animation = new Animation(AM.getAsset("./img/PurpleChroma.png"), this.pWidth, this.pHeight, 64, 0.2, 2, true, this.scale);
	this.angle = 0;
	this.spawner = spawner;
	this.name = "Ally";
	this.weaponType = "P2";
	this.maxSpeed = 0.5;
	this.speed = this.maxSpeed;
	this.x = 0;
	this.y = 0;
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
	this.radius = 5.4 * this.scale;
	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
	this.health = 75;
	this.damage = 20;
	this.target = null;
	this.fullShootCooldown = 35;
	this.shootCooldown = this.fullShootCooldown;
	this.powerLevel = 0;
	//console.log("starting health: " + this.health);
	Entity.call(this, game, this.x, this.y);
}

PurpleChroma.prototype = new Entity();
PurpleChroma.prototype.constructor = PurpleChroma;
PurpleChroma.prototype.createProjectile = function(type, offset, adjustAngle) {
	var dist = 1000 * distance({xMid: this.xMid, yMid: this.yMid},
							   {xMid: this.target.xMid, yMid: this.target.yMid});
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
PurpleChroma.prototype.update = function () {

	this.shootCooldown--;

	//if it hasn't found its target yet, or its target has become undefined
	if (true){
		var closest = 100000000;

		//find the closest resource node to gather from
		for (var i = 0; i<this.game.enemies.length; i++){
			var ent = this.game.enemies[i];
			var d = distance(this, ent);
			if(d < closest){
				closest = d;
				this.target = ent;
				}
		}
	}

	// update angle
	if(this.target){
		var dx = this.target.xMid - this.xMid;
		var dy = this.yMid - this.target.yMid;
		this.angle = -Math.atan2(dy,dx);
	}
	if (this.target && 500 > distance(this, this.target) && this.shootCooldown < 1){
		this.createProjectile(this.weaponType, 0, 0);
		this.shootCooldown = this.fullShootCooldown;
	}
	if(this.target && 300 > distance(this,this.target)){
		this.speed = -this.maxSpeed * .5;
	}else if (this.target && 500 < distance(this, this.target)){
		this.speed = this.maxSpeed;
	}
	this.x += Math.cos(this.angle) * 10 * this.speed;
	this.y += Math.sin(this.angle) * 10 * this.speed;

	//update its hitbox
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	// check collision with player projectiles
	for (var i = 0; i < this.game.enemyProjectiles.length; i++ ) {
		var ent = this.game.enemyProjectiles[i];
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


		// check health
	if (this.health < 1) {
		//SCORE++; //how many points is it worth
		for(var i = 0; i < 1; i++){
			var scrap = new Scrap(this.game);
			scrap.x = this.xMid - (scrap.pWidth*scrap.scale /2);
			scrap.y = this.yMid - (scrap.pHeight*scrap.scale /2);
			scrap.xMid = this.xMid;
			scrap.yMid = this.yMid;
			this.game.addEntity(scrap);
		}
		this.removeFromWorld = true;

	}
		//does it blow up when it dies?
	if (this.removeFromWorld) {
		var explosion = new SpaceExplosion(this.game, this.xMid, this.yMid, this.angle);
		this.game.addEntity(explosion);
		this.spawner.spawns--;
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
function SpaceStation(game, x, y, rock) {
    //Specific to spawners:
    this.timerReset = 500;
    this.generateGatherer = this.timerReset;
    this.maxSpawn = 3; // maybe make this a difficulty variable.

    this.pWidth = 512;
    this.pHeight = 512;
    this.scale = .5;
	this.animation = new Animation(AM.getAsset("./img/SpaceStation.png"), this.pWidth, this.pHeight, 1024, 0.25, 2, true, this.scale);
    this.name = "Ally";
    this.x = x;
    this.y = y;
	this.asteroid = rock;
    this.xMid = this.x + (this.pWidth * this.scale) / 2;
    this.yMid = this.y + (this.pHeight * this.scale) / 2;
    this.radius = 362 * this.scale;
    this.speed = 0;
    this.angle = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.removeFromWorld = false;
    this.health = 1000;


	//the spawns that the spawner 'owns'
	this.spawns = 0;
	this.maxGatherers = 5;
	this.gatherers = 0;
	this.maxBuilders = 1;
	this.builders = 0;
}
SpaceStation.prototype = new Entity();
SpaceStation.prototype.constructor = SpaceStation;

SpaceStation.prototype.update = function () {

    if(this.health < 1){
      this.removeFromWorld = true;
	  this.asteroid.hasbase = false;
	  this.asteroid.base = null;
	}
	if(this.health < 5000){
		this.health += 0.05;
	}

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
	if(this.gatherers < this.maxGatherers && this.generateGatherer <1){
		var ent = new MechanicalResourceGatherer(this.game, this);

		ent.x = this.x + (this.pWidth * this.scale) / 2;
		ent.y = this.y + (this.pHeight * this.scale) / 2;
		this.game.addEntity(ent);
		this.generateGatherer = this.timerReset;
		this.gatherers++;
	}
    if (this.spawns < this.maxSpawn && this.game.playerResources > 100 ){
		var ent = new PurpleChroma(this.game, this);
		ent.x = this.x + (this.pWidth * this.scale) / 2;
		ent.y = this.y + (this.pHeight * this.scale) / 2;
		this.game.addEntity(ent);
		this.spawns++;
		this.game.playerResources -=100;

    }
	var asteroidfree = false;
	for (var i = 0; i < this.game.terrain.length; i++){
		if(!this.game.terrain[i].hasbase){
			asteroidfree = true;
		}
	}
	if (asteroidfree && this.builders < this.maxBuilders && this.game.playerResources > 500){
		var ent = new PlayerBuilder(this.game, this);
		console.log("I spawned a Builder");
		ent.x = this.x + (this.pWidth * this.scale) / 2;
		ent.y = this.y + (this.pHeight * this.scale) / 2;
		this.game.addEntity(ent);
		this.builders++;
		this.game.playerResources -=500;

	}

	this.generateGatherer -= 1;
	this.angle += 0.01;
    Entity.prototype.update.call(this);
}

SpaceStation.prototype.draw = function () {
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
    //Entity.prototype.draw.call(this);
}


/* ========================================================================================================== */
// Resource Gatherer Ally
/* ========================================================================================================== */
function MechanicalResourceGatherer(game, spawner) {


	this.pWidth = 40;
	this.pHeight = 40;
	this.scale = 1;

  	// Stuff gets passed into an animation object in this order:
  	// spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale

	this.animation = new Animation(AM.getAsset("./img/MechanicalResourceGatherer.png"),
								 this.pWidth, this.pHeight,
								 80, .125, 2, true, this.scale);
	this.game = game;
	this.ctx = game.ctx;
	this.name = "Ally";
	this.spawner = spawner;
	this.x = 50;
	this.y = 50;
	this.angle = 0;
	this.removeFromWorld = false; //there needs to be SOME way to make this true;
///////////Above this is MANDATORY for all entities////////////////////////
//If it's killable
	this.health = 25;

//this is for collision
	this.xMid = this.x + (this.pWidth * this.scale) / 2;
	this.yMid = this.y + (this.pHeight * this.scale) / 2;
	this.radius = 18 * this.scale;

//this is for movement
	this.speed = .35;

//this is for if it needs to decay off the lists, like an explostion
	//this.lifetime = 100; //when this reaches 0, it is removed from world

//Add other variables to objects for whatever added functionality you need
	//this.sampleValue = sample Magic Number;

	this.target = null;
	this.targetDistance = 100000000;


}

MechanicalResourceGatherer.prototype = new Entity();
MechanicalResourceGatherer.prototype.constructor = MechanicalResourceGatherer;

MechanicalResourceGatherer.prototype.draw = function () {
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

MechanicalResourceGatherer.prototype.update = function () {

	//something likethis for an Effect


	//if it hasn't found its target yet, or its target has become undefined
	if (true){
		this.angle += 0.0125;
		var closest = 100000000;

		//find the closest resource node to gather from
		for (var i = 0; i < this.game.resources.length; i++){
			var ent = this.game.resources[i];
			var d = distance(this, ent);

			if(!ent.isTargettedAlly && d < closest){
				closest = d;
				if(this.target){
					this.target.isTargettedAlly = false;
				}
				this.target = ent;
				this.target.isTargettedAlly = true;
			}
		}
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

	if (this.target && Collide(this, this.target)){
		this.target.removeFromWorld = true;
		this.game.playerResources += this.target.value;
		this.target = null;
	}

	// check collision with enemy projectiles
	for (var i = 0; i < this.game.enemyProjectiles.length; i++ ) {
		var ent = this.game.enemyProjectiles[i];
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
		//SCORE++; //how many points is it worth
		if(this.target){
			this.target.isTargettedAlly = false;
		}
		for(var i = 0; i< 3; i++){
			var scrap = new Scrap(this.game);
			scrap.x = this.xMid - (scrap.pWidth*scrap.scale /2);
			scrap.y = this.yMid - (scrap.pHeight*scrap.scale /2);
			scrap.xMid = this.xMid;
			scrap.yMid = this.yMid;

			this.game.addEntity(scrap);
		}
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
		this.spawner.gatherers--;
	}

	Entity.prototype.update.call(this);


}

/* ========================================================================================================== */
// Base PlayerBuilder
/* ========================================================================================================== */
function PlayerBuilder(game, spawner) {


	this.pWidth = 250;
	this.pHeight = 268;
	this.scale = .5;

  	// Stuff gets passed into an animation object in this order:
  	// spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale

	this.animation = new Animation(AM.getAsset("./img/PlayerBuilder.png"),
								 this.pWidth, this.pHeight,
								 1500, .125, 6, true, this.scale);
	this.game = game;
	this.ctx = game.ctx;
	this.name = "Ally";
	this.spawner = spawner;
	this.x = 50;
	this.y = 50;
	this.angle = 0;
	this.removeFromWorld = false; //there needs to be SOME way to make this true;
///////////Above this is MANDATORY for all entities////////////////////////
//If it's killable
	this.health = 100;

//this is for collision
	this.xMid = this.x + (this.pWidth * this.scale) / 2;
	this.yMid = this.y + (this.pHeight * this.scale) / 2;
	this.radius = 180 * this.scale;

//this is for movement
	this.speed = .135;


	this.target = null;


}

PlayerBuilder.prototype = new Entity();
PlayerBuilder.prototype.constructor = PlayerBuilder;

PlayerBuilder.prototype.draw = function () {
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

PlayerBuilder.prototype.update = function () {



	if (this.target && this.target.hasbase){
		this.target = null;
	}
	//if it hasn't found its target yet, or its target has become undefined
	if (!this.target){
		this.angle += 0.0125;
		var closest = 100000000;

		//find the closest resource node to gather from
		for (var i = 0; i < this.game.terrain.length; i++){
			var ent = this.game.terrain[i];
			var d = distance(this, ent);

			if(!ent.hasbase && d < closest){
				closest = d;
				this.target = ent;

			}
		}
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

	if (this.target && Collide(this, this.target) && !this.target.hasbase){
		this.target.hasbase = true;
		var base = new SpaceStation(this.game, this.target.x, this.target.y, this.target);
		this.target.base = base;
		this.game.addEntity(base);

		this.removeFromWorld = true;

	}

	// check collision with enemy projectiles
	for (var i = 0; i < this.game.enemyProjectiles.length; i++ ) {
		var ent = this.game.enemyProjectiles[i];
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
		//SCORE++; //how many points is it worth

		for(var i = 0; i< 3; i++){
			var scrap = new Scrap(this.game);
			scrap.x = this.xMid - (scrap.pWidth*scrap.scale /2);
			scrap.y = this.yMid - (scrap.pHeight*scrap.scale /2);
			scrap.xMid = this.xMid;
			scrap.yMid = this.yMid;
			this.game.addEntity(scrap);
		}

		this.removeFromWorld = true;
	}

	//does it blow up when it dies?
	if (this.removeFromWorld) {
		var explosion = new SpaceExplosion(this.game, this.xMid, this.yMid, this.angle);
		this.game.addEntity(explosion);
		this.spawner.builders--;
	}

	Entity.prototype.update.call(this);


}

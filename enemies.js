/* ========================================================================================================== */
// Spawner - alien space station
/* ========================================================================================================== */
function AlienSpaceStation(game, x, y, rock) {
	console.log("new enemy station");

    this.pWidth = 256;
    this.pHeight = 256;
    this.scale = 1;
	this.animation = new Animation(AM.getAsset("./img/enemyBase.png"), this.pWidth, this.pHeight, 2048, 0.175, 8, true, this.scale);
    this.name = "Enemy";
    this.x = x;
    this.y = y;
	this.asteroid = rock;
    this.xMid = this.x + (this.pWidth * this.scale) / 2;
    this.yMid = this.y + (this.pHeight * this.scale) / 2;
    this.radius = 85 * this.scale;
    this.speed = 0;
    this.angle = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.removeFromWorld = false;
	this.maxHealth = 1000;
	this.health = this.maxHealth;
	this.hasBeenDestroyed = false;

	this.shootCooldownReset = 25;
	this.shootCooldown = this.shootCooldownReset;
	this.shootAngle = 0;
	this.target = null;


	//Specific to spawners:
	this.gathererTimerReset = 200;
	this.generateGatherer = this.gathererTimerReset;
	this.scourgeTimerReset = 75;
	this.leechTimerReset = 100;
	this.stalkerTimerReset = 125;
	this.scourgeTimer = 0;
	this.leechTimer = 0;
	this.stalkerTimer = 0;


	//the spawns that the spawner 'owns'
	this.maxSpawn = 25; // maybe make this a difficulty variable.
	this.spawns = 0;
	this.maxGatherers = 5;
	this.gatherers = 0;
	this.maxBuilders = 1;
	this.builders = 0;
}
AlienSpaceStation.prototype = new Entity();
AlienSpaceStation.prototype.constructor = AlienSpaceStation;

AlienSpaceStation.prototype.update = function () {
	// this.game.enemyResources++;
    if(this.health < 1){
      console.log("destroyed");
      this.removeFromWorld = true;
	  this.asteroid.hasbase = false;
	  this.asteroid.base = null;
	  this.generateItem(25);
	  this.generateScrap(15, 13);
	  this.hasBeenDestroyed = true;
	}
	if(!this.removeFromWorld && this.health < this.maxHealth){
		this.health += 0.5;
	}
	//shooting
	var closest = 100000000;
	if (true){



	//find the player allied ship
		for (var i = 0; i < this.game.allies.length; i++){
			var ent = this.game.allies[i];
			var d = distance(this, ent);
			if(d < closest){
				closest = d;
				this.target = ent;

			}
		}
	}

	if(distance(this, this.game.ship) < closest){
		this.target = this.game.ship;
	}

	// update shootingangle
	if(this.target){
		var dx = this.target.xMid - this.xMid;
		var dy = this.yMid - this.target.yMid;
		this.shootAngle = -Math.atan2(dy,dx);
	}

	if (this.target && 900 > distance(this, this.target) && this.shootCooldown < 1){
		this.createProjectile("LaserBlast", 0, -Math.PI/2);
		this.shootCooldown = this.shootCooldownReset;
	}
	this.shootCooldown--;




	//spawning
	if(this.gatherers < this.maxGatherers && this.generateGatherer <1){
		var ent = new BiologicalResourceGatherer(this.game, this);

		ent.x = this.x + (this.pWidth * this.scale) / 2;
		ent.y = this.y + (this.pHeight * this.scale) / 2;
		this.game.addEntity(ent);
		this.generateGatherer = this.gathererTimerReset;
		this.gatherers++;
	}

	if(this.spawns < this.maxSpawn && this.scourgeTimer < 1 && this.game.enemyResources >= 10){
		var ent = new Scourge(this.game, this.xMid, this.yMid, this);
		ent.x = this.x + (this.pWidth * this.scale) / 2;
		ent.y = this.y + (this.pHeight * this.scale) / 2;
		this.game.addEntity(ent);
		this.spawns++;
		this.game.enemyResources -=10;
		this.scourgeTimer = this.scourgeTimerReset;
	}
	if (this.spawns < this.maxSpawn && this.leechTimer < 1 && this.game.enemyResources >= 20){
		var ent = new Leech(this.game, this.xMid, this.yMid, this);

		ent.x = this.x + (this.pWidth * this.scale) / 2;
		ent.y = this.y + (this.pHeight * this.scale) / 2;
		this.game.addEntity(ent);
		this.spawns++;
		this.game.enemyResources -=20;
		this.leechTimer = this.leechTimerReset;
	}
    if (this.spawns < this.maxSpawn && this.stalkerTimer < 0 && this.game.enemyResources >= 50 ){
		var ent = new Stalker(this.game, this.xMid, this.yMid, this);

		ent.x = this.x + (this.pWidth * this.scale) / 2;
		ent.y = this.y + (this.pHeight * this.scale) / 2;
		this.game.addEntity(ent);
		this.spawns++;
		this.game.enemyResources -=50;
		this.stalkerTimer = this.stalkerTimerReset;


    }
	if (this.game.enemyResources > 750){
		var ent = new Boss1(this.game);
		this.game.addEntity(ent);
		this.game.enemyResources -= 700;
	}
	var asteroidfree = false;
	for (var i = 0; i < this.game.terrain.length; i++){
		if(!this.game.terrain[i].hasbase){
			asteroidfree = true;

		}
	}
	if (asteroidfree && this.builders < this.maxBuilders && this.game.enemyResources > 500){
		var ent = new AlienBuilder(this.game, this);
		ent.x = this.x + (this.pWidth * this.scale) / 2;
		ent.y = this.y + (this.pHeight * this.scale) / 2;
		this.game.addEntity(ent);
		this.builders++;
		this.game.enemyResources -=500;

	}

	if(this.game.enemyResources > 700){
		var ent = new Boss1(this.game);
		ent.x = this.x;
		this.game.addEntity(ent);
		this.game.enemyResources -=700;
	}
	this.generateGatherer -= 1;
	this.scourgeTimer--;
	this.leechTimer--;
	this.stalkerTimer--;
	this.angle += 0.000125;

	for (var i = 0; i<this.game.playerProjectiles.length; i++){
		var ent = this.game.playerProjectiles[i];
		if(Collide(this, ent)){
			this.takeDamage(ent.damage);
			if (!ent.pierce) {
				ent.removeFromWorld = true;
			}
		}
	}
	if (this.removeFromWorld) {
		var explosion = new SpaceExplosion(this.game, this.xMid, this.yMid, this.angle);
		this.game.addEntity(explosion);
	}

    Entity.prototype.update.call(this);
}
AlienSpaceStation.prototype.createProjectile = function(type, offset, adjustAngle) {
	var dist = 1000 * distance({xMid: this.xMid, yMid: this.yMid},
							   {xMid: this.target.xMid, yMid: this.target.yMid});
	var angle = this.shootAngle + adjustAngle;
	if (type === "LaserBlast") {
		var projectile = new LaserBlast(this.game, angle);
	}
	var target = {x: Math.cos(angle) * dist + this.xMid,
				  y: Math.sin(angle) * dist + this.yMid};
	var dir = direction(target, {x: this.xMid, y: this.yMid});

	projectile.x = this.xMid;
	projectile.y = this.yMid;
	projectile.velocity.x = dir.x * projectile.maxSpeed;
	projectile.velocity.y = dir.y * projectile.maxSpeed;
	projectile.angle = angle;

	this.game.addEntity(projectile);
}

AlienSpaceStation.prototype.draw = function () {
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
// Resource Gatherer Enemy
/* ========================================================================================================== */
function BiologicalResourceGatherer(game, spawner) {


	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.65;

  	// Stuff gets passed into an animation object in this order:
  	// spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale

	this.animation = new Animation(AM.getAsset("./img/enemyDrone.png"), this.pWidth, this.pHeight, 768, 0.125, 6, true, this.scale);
	this.game = game;
	this.ctx = game.ctx;
	this.name = "Enemy";
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


}

BiologicalResourceGatherer.prototype = new Entity();
BiologicalResourceGatherer.prototype.constructor = BiologicalResourceGatherer;

BiologicalResourceGatherer.prototype.draw = function () {
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

BiologicalResourceGatherer.prototype.update = function () {

	//something likethis for an Effect
	//this.lifetime--;
	if (this.health < 1){
		this.removeFromWorld = true;
		return;
	}

	//if it hasn't found its target yet, or its target has become undefined
	if (!this.target){
		this.angle += 0.0125;
		var closest = 100000000;

		//find the closest resource node to gather from
		for (var i = 0; i < this.game.resources.length; i++){
			var ent = this.game.resources[i];
			var d = distance(this, ent);
			if(!ent.isTargettedEnemy && d < closest){
				closest = d;
				if(this.target){
					this.target.isTargettedEnemy = false;
				}
				this.target = ent;
				this.target.isTargettedEnemy = true;
			}
		}
	}
	if (this.target && Collide(this, this.target)){
		this.target.removeFromWorld = true;
		this.game.enemyResources += this.target.value;
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
			this.takeDamage(ent.damage);
			if (!ent.pierce) {
				ent.removeFromWorld = true;
				var splatter = new BloodSplatter(this.game, this.xMid, this.yMid);
				splatter.angle = this.angle;
				this.game.addEntity (splatter);
			}
			if (this.health < 1) {
				break;
			}
		}
	}




	// check health
	if (this.health < 1) {
		SCORE++; //how many points is it worth
		if(this.target){
			this.target.isTargettedEnemy = false;
		}

  	  	this.generateScrap(3, 3);

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
// AlienBase Builder
/* ========================================================================================================== */
function AlienBuilder(game, spawner) {


	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 1;

  	// Stuff gets passed into an animation object in this order:
  	// spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale

	this.animation = new Animation(AM.getAsset("./img/enemyQueen.png"), this.pWidth, this.pHeight, 1408, 0.08, 11, true, this.scale);
	this.game = game;
	this.ctx = game.ctx;
	this.name = "Enemy";
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

AlienBuilder.prototype = new Entity();
AlienBuilder.prototype.constructor = AlienBuilder;

AlienBuilder.prototype.draw = function () {
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

AlienBuilder.prototype.update = function () {



	if (this.target && this.target.hasbase){
		this.target = null;
	}
	//if it hasn't found its target yet, or its target has become undefined
	if (true){
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
		var base = new AlienSpaceStation(this.game, this.target.x, this.target.y, this.target);
		this.target.base = base;
		this.game.addEntity(base);

		this.removeFromWorld = true;

	}

	// check collision with player projectiles
	for (var i = 0; i < this.game.playerProjectiles.length; i++ ) {
		var ent = this.game.playerProjectiles[i];
		if (Collide(this, ent)) {
			this.takeDamage(ent.damage);
			if (!ent.pierce) {
				ent.removeFromWorld = true;
				var splatter = new BloodSplatter(this.game, this.xMid, this.yMid);
				splatter.angle = this.angle;
				this.game.addEntity (splatter);
			}

			if (this.health < 1) {
				break;
			}
		}
	}



	// check health
	if (this.health < 1) {
		//SCORE++; //how many points is it worth
		this.generateItem(0);
		this.generateScrap(5, 7);

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



/* ========================================================================================================== */
// Boss 1
/* ========================================================================================================== */
function Boss1(game){
	this.pWidth = 200;
	this.pHeight = 450;
	this.scale = 1;
    this.game = game;
    this.ctx = game.ctx;
    this.animation = new Animation(AM.getAsset("./img/Boss1.png"), 200, 450, 1200, 0.175, 6, true, 1);
    this.name = "Enemy";
    this.x = Math.random() * (this.ctx.canvas.width-200);
    this.y = this.ctx.canvas.height + 500;
	this.xMid = this.x + (this.pWidth * this.scale) / 2;
	this.yMid = this.y + (this.pHeight * this.scale) / 2;
    this.angle = 0;
    this.speed = 100;
	this.deathTimer = 150;
	this.dying = false;
    this.removeFromWorld = false;
	this.turret1 = new BossTurret(this.game, this, 70, 125);
	this.turret2 = new BossTurret(this.game, this, 70, 195);
	this.turret3 = new BossTurret(this.game, this, 10, 330);
	this.turret4 = new BossTurret(this.game, this, 135, 330);
	game.addEntity(this.turret1);
	game.addEntity(this.turret2);
	game.addEntity(this.turret3);
	game.addEntity(this.turret4);

	this.turretsRemaining = 4;

}
Boss1.prototype = new Entity();
Boss1.prototype.constructor = Boss1;

Boss1.prototype.update = function () {
	//console.log("boss is updating");
	this.y -= this.game.clockTick * this.speed;

	this.xMid = this.x + (this.pWidth * this.scale) / 2;
	this.yMid = this.y + (this.pHeight * this.scale) / 2;

	if (this.turretsRemaining === 0) {

		this.deathTimer--;
		if (!this.dying){
			var explosion = new BossExplosion(this.game, this.x, this.y, 7, this);
			this.game.addEntity(explosion);
			SCORE += 5;

		}
		if (this.deathTimer < 1) {
			this.removeFromWorld = true;

			this.generateItem(0);
			this.generateScrap(10, 11);
		}
		this.dying = true;
	}

	if(!this.game.running || this.y === -500) {
		this.turret1.removeFromWorld = true;
		this.turret2.removeFromWorld = true;
		this.turret3.removeFromWorld = true;
		this.turret4.removeFromWorld = true;
		this.removeFromWorld = true;
	}


	Entity.prototype.update.call(this);
}

Boss1.prototype.draw = function () {
	if(onCamera(this)){
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}
	if(!this.turret1.removeFromWorld){
		if(onCamera(this.turret1)){
			this.turret1.animation.drawFrame(this.game.clockTick, this.ctx, this.turret1.x, this.turret1.y, this.turret1.angle);
		}
	}
	if(!this.turret2.removeFromWorld){
		if(onCamera(this.turret2)){
			this.turret2.animation.drawFrame(this.game.clockTick, this.ctx, this.turret2.x, this.turret2.y, this.turret2.angle);
		}
	}
	if(!this.turret3.removeFromWorld){
		if(onCamera(this.turret3)){
			this.turret3.animation.drawFrame(this.game.clockTick, this.ctx, this.turret3.x, this.turret3.y, this.turret3.angle);
		}
	}
	if(!this.turret4.removeFromWorld){
		if(onCamera(this.turret4)){
			this.turret4.animation.drawFrame(this.game.clockTick, this.ctx, this.turret4.x, this.turret4.y, this.turret4.angle);
		}
	}
	Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// Boss turret
/* ========================================================================================================== */

function BossTurret(game, boss, xOffset, yOffset){
    this.pWidth = 32;
    this.pHeight = 32;
    this.scale = 2.0;
    this.animation = new Animation(AM.getAsset("./img/BossTurret.png"), this.pWidth, this.pHeight, 675, 0.2, 21, true, this.scale);
    this.name = "Enemy";
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	this.x = boss.x + xOffset;
    this.y = boss.y + yOffset;
    this.xMid = this.x + (this.pWidth * this.scale) / 2;
    this.yMid = this.y + (this.pHeight * this.scale) / 2;
    this.radius = 8 * this.scale;
    this.speed = 0;
    this.angle = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.removeFromWorld = false;
    this.health = 150;
	this.shootCooldown = 30;
	this.missleCooldown = 1500;
	this.shotCount = 0;
	this.boss = boss;
	this.target = null;


}
BossTurret.prototype = new Entity();
BossTurret.prototype.constructor = Boss1;

BossTurret.prototype.update = function () {

	this.x = this.boss.x + this.xOffset;
	this.y = this.boss.y + this.yOffset;

	this.xMid = this.x + (this.pWidth * this.scale) / 2;
	this.yMid = this.y + (this.pHeight * this.scale) / 2;

	this.shootCooldown--;

	if(this.health < 1) {
		SCORE += 3;

		this.boss.turretsRemaining--;
		var explosion = new BossExplosion(this.game, this.x - this.pWidth, this.y, 0, this.boss);
		this.game.addEntity(explosion);

		this.generateItem(0);
	  	this.generateScrap(2, 7);

        this.removeFromWorld = true;
    }
	for (var i = 0; i<this.game.playerProjectiles.length; i++){

		var ent = this.game.playerProjectiles[i];
		if(Collide(this, ent)){

			this.takeDamage(ent.damage);
			if (!ent.pierce) {
				ent.removeFromWorld = true;
			}
		}
	}
	var closest = 100000000;
	if (true){



		//find the player allied ship
		for (var i = 0; i < this.game.allies.length; i++){
			var ent = this.game.allies[i];
			var d = distance(this, ent);
			if(d < closest){
				closest = d;
				this.target = ent;

			}
		}
	}

	if(distance(this, this.game.ship) < closest){
		this.target = this.game.ship;
	}

    var dx = this.target.xMid - this.xMid-1;
    var dy = (this.yMid - this.target.yMid)-1;
    // this should be the angle in radians
    this.angle = -Math.atan2(dy,dx);

	if (this.shootCooldown < 1){
		if (this.shotCount >= 2){
			this.shootCooldown = 150;
			this.createProjectile("LaserBlast", 0, -Math.PI/2)
			this.shotCount = 0;
		}else{
			this.shootCooldown = 75;
			this.createProjectile("LaserBlast", 0, -Math.PI/2)
			this.shotCount++;
		}
        // this.createProjectile("LaserBlast", 0, -Math.PI/2);
	}


	Entity.prototype.update.call(this);
}
BossTurret.prototype.createProjectile = function(type, offset, adjustAngle) {
	var dist = 1000 * distance({xMid: this.xMid, yMid: this.yMid},
							   {xMid: this.target.xMid, yMid: this.target.YMid});
	var angle = this.angle + adjustAngle;
	if (type === "LaserBlast") {
		var projectile = new LaserBlast(this.game, this.angle);
	}
	if (type === "BossMissle") {
		var projectile = new BossMissle(this.game, this.angle);
	}
	var target = {x: Math.cos(angle) * dist + this.xMid,
				  y: Math.sin(angle) * dist + this.yMid};
	var dir = direction(this.target, this);

	projectile.x = this.xMid;
	projectile.y = this.yMid;
	projectile.velocity.x = dir.x * projectile.maxSpeed;
	projectile.velocity.y = dir.y * projectile.maxSpeed;
	projectile.angle = angle;

	this.game.addEntity(projectile);
}
BossTurret.prototype.draw = function () {
	//this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);

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
// Leech - Enemy
/* ========================================================================================================== */
function Leech(game, xIn, yIn, spawner) {

	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.4;
	this.animation = new Animation(AM.getAsset("./img/enemyDefiler.png"), this.pWidth, this.pHeight, 1024, 0.08, 8, true, this.scale);
	this.angle = 0;
	this.spawner = spawner;
	this.name = "Enemy";
	this.speed = 0.1;
	this.maxSpeed = 0.1; // For resetting after ship rolls
	this.x = xIn;
	this.y = yIn;
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
	this.radius = 20 * this.scale;
	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
	this.health = 50;
	this.damage = 5;
	this.target = null;
	this.scrapValue =

	this.maxDamageCooldown = 50;
	this.damageCooldown = 0;
	//console.log("starting health: " + this.health);
	Entity.call(this, game, this.x, this.y);
}

Leech.prototype = new Entity();
Leech.prototype.constructor = Leech;

Leech.prototype.update = function () {


	//if it hasn't found its target yet, or its target has become undefined
	var closest = 100000000;
	if (true){
		this.angle += 0.0125;


		//find the player allied ship
		for (var i = 0; i < this.game.allies.length; i++){
			var ent = this.game.allies[i];
			var d = distance(this, ent);
			if(d < closest){
				closest = d;
				this.target = ent;

			}
		}
	}

	if(distance(this, this.game.ship) < closest){
		this.target = this.game.ship;
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
			this.takeDamage(ent.damage);
			if (!ent.pierce) {
				ent.removeFromWorld = true;
				var splatter = new BloodSplatter(this.game, this.xMid, this.yMid);
				splatter.angle = this.angle;
				this.game.addEntity (splatter);
			}

			if (this.health < 1) {
				break;
			}
		}
	}


	// check collision with ship
	if (!this.game.ship.rolling && Collide(this, this.game.ship)) {
		this.damageCooldown--;
		this.speed = this.game.ship.speed;
		if(this.damageCooldown < 0) {
			this.damageCooldown = this.maxDamageCooldown;
			this.game.ship.takeDamage(this.damage);
		}
	} else if (this.game.ship.rolling && Collide(this, this.game.ship)) {
		//if 4 then stay attached this frame 80% to
		var stayStuck = Math.floor(Math.random() * 100);
		this.damageCooldown = this.maxDamageCooldown;
		if (stayStuck > 93) {
			this.speed = this.maxSpeed;
			if ((this.game.moveDown || this.game.moveUp) && !this.game.moveRight) {
				this.x++;
			} else {
				this.x--;
			}
			if ((this.game.moveLeft || this.game.moveRight) && !this.game.moveDown)  {
				this.y++;
			} else {
				this.y--;
			}
		}
	}
	if(this.target !== this.game.ship && Collide(this, this.target)){
		this.damageCooldown--;
		this.speed = this.target.speed;
		if(this.damageCooldown < 0) {
			this.damageCooldown = this.maxDamageCooldown;
			this.target.health -= this.damage;
		}
	}


	// check health
	if (this.health < 1) {
		SCORE++;

		this.generateItem(0);
  	  	this.generateScrap(2, 6);

		this.removeFromWorld = true;
	}

	if (this.removeFromWorld) {
		var explosion = new SpaceExplosion(this.game, this.xMid, this.yMid);
		this.game.addEntity(explosion);
		this.spawner.spawns--;
	}

	Entity.prototype.update.call(this);
}

Leech.prototype.draw = function () {
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
// Scourge - Enemy
/* ========================================================================================================== */
function Scourge(game, xIn, yIn, spawner) {

	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.35;
	this.animation = new Animation(AM.getAsset("./img/enemyScourge.png"), this.pWidth, this.pHeight, 640, 0.1, 5, true, this.scale);
	this.angle = 0;
	this.spawner = spawner;
	this.name = "Enemy";
	this.speed = 0.55;
	this.x = xIn;
	this.y = yIn;
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
	this.radius = 41 * this.scale;
	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
	this.health = 20;
	this.damage = 20;
	this.target = null;
	//console.log("starting health: " + this.health);
	Entity.call(this, game, this.x, this.y);
}

Scourge.prototype = new Entity();
Scourge.prototype.constructor = Scourge;

Scourge.prototype.update = function () {


		//if it hasn't found its target yet, or its target has become undefined
		var closest = 100000000;
		if (true){
		//find the player allied ship
			for (var i = 0; i < this.game.allies.length; i++){
				var ent = this.game.allies[i];
				var d = distance(this, ent);
				if(d < closest){
					closest = d;
					this.target = ent;

				}
			}
		}

		if(distance(this, this.game.ship) < closest){
			this.target = this.game.ship;
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
			this.takeDamage(ent.damage);
			if (!ent.pierce) {
				ent.removeFromWorld = true;
				var splatter = new BloodSplatter(this.game, this.xMid, this.yMid);
				splatter.angle = this.angle;
				this.game.addEntity (splatter);
			}
			if (this.health < 1) {
				break;
			}
		}
	}
	if(Collide(this, this.target)){
		this.target.health -= this.damage;
		this.removeFromWorld = true;

	}
	// check collision with ship
	if (!this.game.ship.rolling && Collide(this, this.game.ship)) {
		this.game.ship.takeDamage(this.damage);
		this.removeFromWorld = true;
	}

	// check health
	if (this.health < 1) {
		SCORE++;

		this.generateItem(0);
		this.generateScrap(1, 7);

		this.removeFromWorld = true;
	}

	if (this.removeFromWorld) {
		var explosion = new SpaceExplosion(this.game, this.xMid, this.yMid);
		this.game.addEntity(explosion);
		this.spawner.spawns--;
	}

	Entity.prototype.update.call(this);
}

Scourge.prototype.draw = function () {
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
// Spawner - Enemy
/* ========================================================================================================== */
function Spawner(game) {
    //Specific to spawners:
    this.timerReset = 500;
    this.generateEnemy = this.timerReset;
    this.maxSpawn = 2; // maybe make this a difficulty variable.

    this.pWidth = 32;
    this.pHeight = 32;
    this.scale = 4;
	this.openingAnimation = new Animation(AM.getAsset("./img/SpawnDoor.png"), this.pWidth, this.pHeight,  640, 0.1, 4, true, this.scale);
	this.animation = new Animation(AM.getAsset("./img/SpawnDoor.png"), this.pWidth, this.pHeight, 640, 0.1, 1, true, this.scale);
    this.name = "Enemy";
    this.x = 0;
    this.y = 0;
    this.xMid = this.x + (this.pWidth * this.scale) / 2;
    this.yMid = this.y + (this.pHeight * this.scale) / 2;
    this.radius = 16;
    this.speed = 0;
    this.angle = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.removeFromWorld = false;
    this.health = 50;

	//the spawns that the spawner 'owns'
	this.spawns = [
                            new Scourge(this.game, AM.getAsset("./img/scourge.png"), this.x+this.pWidth, this.y+this.pHeight),
                            new Scourge(this.game, AM.getAsset("./img/scourge.png"), this.x+this.pWidth, this.y+this.pHeight)
                            //new Scourge(game, AM.getAsset("./img/scourge.png"), x + 30, y + 30),
                            //new Scourge(game, AM.getAsset("./img/scourge.png"), x + 40, y + 40),
                            //new Scourge(game, AM.getAsset("./img/scourge.png"), x + 50, y + 50),
    ];
}
Spawner.prototype = new Entity();
Spawner.prototype.constructor = Spawner;

Spawner.prototype.update = function () {
    this.generateEnemy--;
    if(this.health < 1){
      this.removeFromWorld = true;
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
    if (this.generateEnemy === 0 ){
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


    Entity.prototype.update.call(this);
}

Spawner.prototype.draw = function () {
	if(onCamera(this)){
		if(this.generateEnemy < 25) {
    		this.openingAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
		}
		else {
			this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
		}
	}
    //Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// Stalker
/* ========================================================================================================== */

function Stalker(game, xIn, yIn, spawner){

		this.pWidth = 128;
		this.pHeight = 128;
		this.scale = 1;
		this.animation = new Animation(AM.getAsset("./img/enemyGuardian.png"), this.pWidth, this.pHeight, 896, 0.08, 7, true, this.scale);
										/*swap these two for HD sprite*/
										//976, 0.1, 5, true, this.scale);
		this.angle = 0;
		this.name = "Enemy";
		this.speed = 0.5;
		this.x = xIn;
		this.y = yIn;
        this.spawner = spawner;
		this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
		this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
		this.radius = 41 * this.scale;
		this.game = game;
		this.ctx = game.ctx;
		this.removeFromWorld = false;
		this.health = 100;
		this.damage = 3;
		this.shootCooldownReset = 40;
		this.shootCooldown = this.shootCooldownReset;

		//console.log("starting health: " + this.health);
		Entity.call(this, game, this.x, this.y);


}

Stalker.prototype = new Entity();
Stalker.prototype.constructor = Stalker;

Stalker.prototype.update = function () {



	//if it hasn't found its target yet, or its target has become undefined
	var closest = 100000000;
	if (true){
		this.angle += 0.0125;

		//find the player allied ship
		for (var i = 0; i < this.game.allies.length; i++){
			var ent = this.game.allies[i];
			var d = distance(this, ent);
			if(d < closest){
				closest = d;
				this.target = ent;
			}
		}
	}
		if(distance(this, this.game.ship) < closest){
		this.target = this.game.ship;
	}
	// update angle
	if(this.target){
		var dx = this.target.xMid - this.xMid;
		var dy = this.yMid - this.target.yMid;
		this.angle = -Math.atan2(dy,dx);
	} else{
		this.angle += 0.055;
	}


///////////////////////////////////

	if(this.target && 300 < distance(this, this.target)){
		// move the thing normally
		this.x += Math.cos(this.angle) * 10 * this.speed;
		this.y += Math.sin(this.angle) * 10 * this.speed;
	}

	//update its hitbox
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
	// check collision with player projectiles
	for (var i = 0; i < this.game.playerProjectiles.length; i++ ) {
		var ent = this.game.playerProjectiles[i];
		if (Collide(this, ent)) {
			this.takeDamage(ent.damage);
			if (!ent.pierce) {
				ent.removeFromWorld = true;
				var splatter = new BloodSplatter(this.game, this.xMid, this.yMid);
				splatter.angle = this.angle;
				this.game.addEntity (splatter);
			}
					if (this.health < 1) {
				break;
			}
		}
	}
	//gun stuff below
	this.shootCooldown--;

	if(this.health < 1) {
		SCORE += 3;
		this.generateItem(0);
		this.generateScrap(3, 7.5);

		this.removeFromWorld = true;
    }

    // this should be the angle in radians


	if (this.shootCooldown < 1){
			this.shootCooldown = this.shootCooldownReset;
			this.createProjectile("LaserBlast", 0, -Math.PI/2);
	}

	if (this.removeFromWorld) {
		var explosion = new SpaceExplosion(this.game, this.xMid, this.yMid);
		this.game.addEntity(explosion);
		this.spawner.spawns--;
	}

	Entity.prototype.update.call(this);
}

Stalker.prototype.createProjectile = function(type, offset, adjustAngle) {
	var dist = 1000 * distance({xMid: this.xMid, yMid: this.yMid},
							   {xMid: this.target.xMid, yMid: this.target.yMid});
	var angle = this.angle + adjustAngle;
	if (type === "LaserBlast") {
		var projectile = new LaserBlast(this.game, this.angle);
	}
	var target = {x: Math.cos(angle) * dist + this.xMid,
				  y: Math.sin(angle) * dist + this.yMid};
	var dir = direction(this.target, this);

	projectile.x = this.xMid;
	projectile.y = this.yMid;
	projectile.velocity.x = dir.x * projectile.maxSpeed;
	projectile.velocity.y = dir.y * projectile.maxSpeed;
	projectile.angle = angle;

	this.game.addEntity(projectile);
}

Stalker.prototype.draw = function () {
	//this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
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

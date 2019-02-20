/* ========================================================================================================== */
// Spawner - alien space station
/* ========================================================================================================== */
function AlienSpaceStation(game, x, y) {
    //Specific to spawners:
    this.timerReset = 100;
    this.generateGatherer = this.timerReset;
    this.maxSpawn = 15; // maybe make this a difficulty variable.

    this.pWidth = 260;
    this.pHeight = 260;
    this.scale = 1.5;
	this.animation = new Animation(AM.getAsset("./img/AlienSpaceStation.png"), this.pWidth, this.pHeight, 780, 0.175, 3, true, this.scale);
    this.name = "Enemy";
    this.x = x;
    this.y = y;
    this.xMid = this.x + (this.pWidth * this.scale) / 2;
    this.yMid = this.y + (this.pHeight * this.scale) / 2;
    this.radius = 260 * this.scale;
    this.speed = 0;
    this.angle = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.removeFromWorld = false;
    this.health = 5000;


	//the spawns that the spawner 'owns'
	this.spawns = 0;
	this.maxGatherers = 10;
	this.gatherers = 0;
}
AlienSpaceStation.prototype = new Entity();
AlienSpaceStation.prototype.constructor = AlienSpaceStation;

AlienSpaceStation.prototype.update = function () {

    if(this.health < 1){
      this.removeFromWorld = true;
	  return;
	}
	if(this.health < 5000){
		this.health += 0.5;
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
		var ent = new BiologicalResourceGatherer(this.game, this);

		ent.x = this.x + (this.pWidth * this.scale) / 2;
		ent.y = this.y + (this.pHeight * this.scale) / 2;
		this.game.addEntity(ent);
		this.generateGatherer = this.timerReset;
		this.gatherers++;
	}
    if (this.spawns < this.maxSpawn && this.game.enemyResources > 10 ){
		var dice = Math.random()*100;
		if(dice > 50){
			var ent = new Scourge(this.game, this.xMid, this.yMid, this);
		} else{
			var ent = new Leech(this.game, this.xMid, this.yMid, this);
		}
		ent.x = this.x + (this.pWidth * this.scale) / 2;
		ent.y = this.y + (this.pHeight * this.scale) / 2;
		this.game.addEntity(ent);
		this.spawns++;
		this.game.enemyResources -=10;

    }
	this.generateGatherer -= 1;
	this.angle += 0.0075;
    Entity.prototype.update.call(this);
}

AlienSpaceStation.prototype.draw = function () {
	if(onCamera(this)){
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
	}
    //Entity.prototype.draw.call(this);
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
		if (this.deathTimer < 1){
			for(var i = 0; i < 10; i++){
				var scrap = new Scrap(this.game);
				scrap.x = this.xMid - (scrap.pWidth*scrap.scale /2);
				scrap.y = this.yMid - (scrap.pHeight*scrap.scale /2);
				scrap.xMid = this.xMid;
				scrap.yMid = this.yMid;

				this.game.addEntity(scrap);
			}
			this.removeFromWorld = true;
			var dice = Math.random()*100;
			if (dice < 100) { //the boss always drops something

				if(dice < 85){
					var repair = new RepairDrop(this.game);
					repair.x = this.xMid - (repair.pWidth * repair.scale / 2);
					repair.y = this.yMid - (repair.pHeight * repair.scale / 2);
					repair.xMid = this.xMid;
					repair.yMid = this.yMid;
					this.game.addEntity(repair);

				}else{
					var spreader = new Spreader(this.game);
					spreader.x = this.xMid - (spreader.pWidth * spreader.scale / 2);
					spreader.y = this.yMid - (spreader.pHeight * spreader.scale / 2);
					spreader.xMid = this.xMid;
					spreader.yMid = this.yMid;

					this.game.addEntity(spreader);
				}
			}



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
    this.scale = 1.5;
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
    this.health = 5;
	this.shootCooldown = 30;
	this.missleCooldown = 1500;
	this.shotCount = 0;
	this.boss = boss;


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
		var dice = Math.random()*100;
		if (true) {
			for(var i = 0; i< 2; i++){
				var scrap = new Scrap(this.game);
				scrap.x = this.xMid - (scrap.pWidth*scrap.scale /2);
				scrap.y = this.yMid - (scrap.pHeight*scrap.scale /2);
				scrap.xMid = this.xMid;
				scrap.yMid = this.yMid;

				this.game.addEntity(scrap);
			}
			if(dice < 50){
				var repair = new RepairDrop(this.game);
				repair.x = this.xMid - (repair.pWidth * repair.scale / 2);
				repair.y = this.yMid - (repair.pHeight * repair.scale / 2);
				repair.xMid = this.xMid;
				repair.yMid = this.yMid;
				this.game.addEntity(repair);

			}else{
				var spreader = new Spreader(this.game);
				spreader.x = this.xMid - (spreader.pWidth * spreader.scale / 2);
				spreader.y = this.yMid - (spreader.pHeight * spreader.scale / 2);
				spreader.xMid = this.xMid;
				spreader.yMid = this.yMid;

				this.game.addEntity(spreader);
			}
		}
        this.removeFromWorld = true;
    }
	for (var i = 0; i<this.game.playerProjectiles.length; i++){

		var ent = this.game.playerProjectiles[i];
		if(Collide(this, ent)){

			this.takeDamage(ent.damage);
			ent.removeFromWorld = true;
		}
	}
    var dx = this.game.ship.xMid - this.xMid-1;
    var dy = (this.yMid - this.game.ship.yMid)-1;
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
							   {xMid: this.game.ship.xMid, yMid: this.game.ship.YMid});
	var angle = this.angle + adjustAngle;
	if (type === "LaserBlast") {
		var projectile = new LaserBlast(this.game, this.angle);
	}
	if (type === "BossMissle") {
		var projectile = new BossMissle(this.game, this.angle);
	}
	var target = {x: Math.cos(angle) * dist + this.xMid,
				  y: Math.sin(angle) * dist + this.yMid};
	var dir = direction(this.game.ship, this);

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
		this.ctx.arc(this.xMid, this.yMid, this.radius * this.scale, 0, Math.PI * 2, false);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// BossTurret LaserBlaste
/* ========================================================================================================== */


function LaserBlast(game, angle){
	this.pWidth = 32;
	this.pHeight = 32;
	this.scale = 1;
	this.animation = new Animation(AM.getAsset("./img/LaserBlast.png"), this.pWidth, this.pHeight, 128, 0.15, 4, true, this.scale);
	this.name = "EnemyProjectile";

	this.x = 0;
	this.y = 0;
	this.xMid = -100;
	this.yMid = -100;
	this.radius = 4 * this.scale;
	this.angle = angle;

	this.lifetime = 500;
	this.damage = 7;
	this.maxSpeed = 300;
	this.velocity = {x: 10, y: 10};

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
  }

LaserBlast.prototype = new Entity();
LaserBlast.prototype.constructor = LaserBlast;

LaserBlast.prototype.update = function () {
	this.x += this.velocity.x * this.game.clockTick;
	this.y += this.velocity.y * this.game.clockTick;

	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
	if(speed > this.maxSpeed) {
		var ratio = this.maxSpeed / speed;
		this.velocity.x *= ratio;
		this.velocity.y *= ratio;
	  }


	  var ent = this.game.ship;
	  if(!ent.rolling && Collide(this, ent)) {
		  ent.takeDamage(this.damage);
		  this.removeFromWorld = true;
	  }

	  this.lifetime -= 1;
	  if (this.lifetime < 0) {
		  this.removeFromWorld = true;
	  }

	  Entity.prototype.update.call(this);
  }

LaserBlast.prototype.draw = function () {
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
// Leech - Enemy
/* ========================================================================================================== */
function Leech(game, xIn, yIn, spawner) {

	this.pWidth = 32;
	this.pHeight = 32;
	this.scale = 1;
	this.animation = new Animation(AM.getAsset("./img/Leech.png"), this.pWidth, this.pHeight,448, 0.1, 14, true, this.scale);
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

	this.maxDamageCooldown = 50;
	this.damageCooldown = 0;
	//console.log("starting health: " + this.health);
	Entity.call(this, game, this.x, this.y);
}

Leech.prototype = new Entity();
Leech.prototype.constructor = Leech;

Leech.prototype.update = function () {
	// update angle
	var dx = this.game.ship.xMid - this.xMid;
	var dy = this.yMid - this.game.ship.yMid;
	this.angle = -Math.atan2(dy,dx);

	// moves like Scourge
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
		if (stayStuck > 96) {
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

	// check health
	if (this.health < 1) {
		SCORE++;
		for(var i = 0; i< 2; i++){
			var scrap = new Scrap(this.game);
			scrap.x = this.xMid - (scrap.pWidth*scrap.scale /2);
			scrap.y = this.yMid - (scrap.pHeight*scrap.scale /2);
			scrap.xMid = this.xMid;
			scrap.yMid = this.yMid;

			this.game.addEntity(scrap);
		}
		var dice = Math.random()*100;
		if (dice < 35) {
			if(dice < 25){
				var repair = new RepairDrop(this.game);
				repair.x = this.xMid - (repair.pWidth * repair.scale / 2);
				repair.y = this.yMid - (repair.pHeight * repair.scale / 2);
				repair.xMid = this.xMid;
				repair.yMid = this.yMid;
				this.game.addEntity(repair);

			}else{
				var spreader = new Spreader(this.game);
				spreader.x = this.xMid - (spreader.pWidth * spreader.scale / 2);
				spreader.y = this.yMid - (spreader.pHeight * spreader.scale / 2);
				spreader.xMid = this.xMid;
				spreader.yMid = this.yMid;

				this.game.addEntity(spreader);
			}
		}

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
function Scourge(game, spritesheet, xIn, yIn, spawner) {

	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = .5;
	this.animation = new Animation(AM.getAsset("./img/scourge.png"), this.pWidth, this.pHeight, 640, 0.1, 5, true, this.scale);
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
	//console.log("starting health: " + this.health);
	Entity.call(this, game, this.x, this.y);
}

Scourge.prototype = new Entity();
Scourge.prototype.constructor = Scourge;

Scourge.prototype.update = function () {
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

	if (this.removeFromWorld) {
		var explosion = new SpaceExplosion(this.game, this.xMid, this.yMid);
		this.game.addEntity(explosion);
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
// Resource Gatherer Enemy
/* ========================================================================================================== */
function BiologicalResourceGatherer(game, spawner) {


	this.pWidth = 54;
	this.pHeight = 51;
	this.scale = 1;

  	// Stuff gets passed into an animation object in this order:
  	// spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale

	this.animation = new Animation(AM.getAsset("./img/BiologicalResourceGatherer.png"),
								 this.pWidth, this.pHeight,
								 324, .125, 6, true, this.scale);
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

BiologicalResourceGatherer.prototype = new Entity();
BiologicalResourceGatherer.prototype.constructor = BiologicalResourceGatherer;

BiologicalResourceGatherer.prototype.draw = function () {
	if(onCamera(this)){
  		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
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
		var closest = 100000000;
		this.angle += 0.0125;
		//find the closest resource node to gather from
		for (var i = 0; i < this.game.resources.length; i++){
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

		for(var i = 0; i < 1; i++){
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

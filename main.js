// useful global things here
var SHOW_HITBOX = false;

/*
function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}*/

//collision - objects must have xMid, yMid and a radius defined.
function distance(a, b) {
    var dx = a.xMid - b.xMid;
    var dy = a.yMid - b.yMid;
    //console.log("a: " + a.xMid + ", " + a.yMid);
    //console.log("b: " + b.xMid + ", " + b.yMid);
    //console.log("distance: " + (dx * dx + dy * dy));
    return Math.sqrt(dx * dx + dy * dy);
}

function direction(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if(dist > 0) return { x: dx / dist, y: dy / dist }; else return {x:0,y:0};
}

function Collide(a, b) {
    //console.log("checking collision");
    return distance(a, b) < a.radius + b.radius;
}
/* ========================================================================================================== */
// Entity Template
/* ========================================================================================================== */
/*

Every entity must have the following variables:
this.pWidth
this.pHeight
this.scale
this.animation

this.name = "EntityType";
this.x = 0;
this.y = 0;
this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
this.speed = 0;
this.angle = 0;
this.radius
this.weaponCooldown

a list of powerups, things like multishot and such

*/

/* ========================================================================================================== */
// Animation
/* ========================================================================================================== */

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, angle) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(this.frameWidth * this.scale, this.frameHeight * this.scale);
    var xOffset = 0;
    var yOffset = 0;

    if ((this.frameWidth * this.scale) > (this.frameHeight * this.scale)){
      yOffset = (this.frameWidth * this.scale) - (this.frameHeight * this.scale);
    } else if ((this.frameWidth*this.scale) < (this.frameHeight * this.scale)) {
      xOffset = (this.frameHeight * this.scale) - (this.frameWidth * this.scale);
    }

    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');

    var thirdCanvas = document.createElement('canvas');
    thirdCanvas.width = size;
    thirdCanvas.height = size;
    var thirdCtx = thirdCanvas.getContext('2d');

    thirdCtx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 0, 0,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(thirdCanvas, -(this.frameWidth*this.scale / 2), -(this.frameHeight*this.scale / 2));
    offscreenCtx.restore();
    thirdCtx.clearRect(0,0, size, size);
    ctx.drawImage(offscreenCanvas, x-(xOffset/2), y- (yOffset/2));


}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

/* ========================================================================================================== */
// Background
/* ========================================================================================================== */
function Background(game, spritesheet) {

    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;

    // Where the frame starts for the background. Divide image in half then subract the half the canvas,
    // for both sx and sy. (i.e: 5600 / 2 - 800 / 2 = 2400) Allowing ship to fit to the exact middle.
    this.sx = spritesheet.naturalWidth / 2 - this.ctx.canvas.width / 2;
    this.sy = spritesheet.naturalHeight / 2 - this.ctx.canvas.height / 2;

    // This is the location to draw the background
    this.dx = 0;
    this.dy = 0;

    // This is the current canvas snapshot of the level
    this.frameWidth = this.ctx.canvas.width;
    this.frameHeight = this.ctx.canvas.height;

    if (spritesheet.width - this.sx < this.frameWidth) {
	this.frameWidth = this.spritesheet.width - this.sx;
    }
    if (spritesheet.height - this.sy < this.frameHeight) {
	this.frameHeight = this.spritesheet.height - this.sy;
    }

    this.dWidth = this.frameWidth;
    this.dHeight = this.frameHeight;


};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
	    	   this.sx, this.sy,
	    	   this.frameWidth, this.frameHeight,
                   this.dx, this.dy,
    		   this.dWidth, this.dHeight);
};

Background.prototype.update = function () {



};

/* =========== General Effects ========= */
function SpaceExplosion(game, shipXMid, shipYMid) {
  this.pWidth = 324;
  this.pHeight = 169;
  this.scale = 1;
  //this.animation = new Animation(AM.getAsset("./img/SpaceExplosion.png"), 324, 169, 2,  0.15, 6, true, this.scale);
  this.animation = new Animation(AM.getAsset("./img/SpaceExplosion.png"),
                                 this.pWidth, this.pHeight,
                                 2,  0.15, 6, false, this.scale);
  this.game = game;
  this.ctx = game.ctx;
  this.xMid = shipXMid;
  this.yMid = shipYMid;
  //console.log("middle explosion: " + this.xMid + ", " + this.yMid);
  this.x = this.xMid - ((this.pWidth * this.scale) / 2);
  this.y = this.yMid - ((this.pHeight * this.scale) / 2);
  this.removeFromWorld = false; //need to remove from world when animation finishes.
}

SpaceExplosion.prototype.draw = function () {
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
  //console.log("explosion: " + this.x + ", " + this.y);
  Entity.prototype.draw.call(this);
}

SpaceExplosion.prototype.update = function () {
  /*if (this.animation.elapsedTime < this.animation.totalTime)
    this.x += this.game.clockTick * this.speed;
  if (this.x > 800) this.x = -230;*/
}

function GroundExplosion(game, spritesheet, shipX, shipY) {
  this.animation = new Animation(spritesheet, 32, 32, 2, 0.15, 6, true, 1);
  this.game = game;
  this.ctx = game.ctx;
  this.x = shipX;
  this.y = shipY;
}

GroundExplosion.prototype.draw = function () {
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
  Entity.prototype.draw.call(this);
}

GroundExplosion.prototype.update = function () {

}



/* ========================================================================================================== */
// Boss 1
/* ========================================================================================================== */
function Boss1(game, spritesheet){
  this.animation = new Animation(spritesheet, 200, 450, 1200, 0.175, 6, true, 1);
  this.name = "Enemy";
  this.x = 300;
  this.y = 175;
  this.angle = 0;
  this.speed = 0;
  this.angle = 0;
  this.game = game;
  this.ctx = game.ctx;
  this.removeFromWorld = false;
}
Boss1.prototype = new Entity();
Boss1.prototype.constructor = Boss1;

Boss1.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;


    Entity.prototype.update.call(this);
}

Boss1.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
    Entity.prototype.draw.call(this);
}

function BossTurret(game, spritesheet, x, y){
  this.pWidth = 32;
  this.pHeight = 32;
  this.scale = 1.5;

  this.animation = new Animation(spritesheet, this.pWidth, this.pHeight, 675, 0.2, 21, true, this.scale);
  this.name = "Enemy";
  this.x = x;
  this.y = y;
  this.xMid = this.x + (this.pWidth * this.scale) / 2;
  this.yMid = this.y + (this.pHeight * this.scale) / 2;
  this.radius = 16;
  this.speed = 0;
  this.angle = 0;
  this.game = game;
  this.ctx = game.ctx;
  this.removeFromWorld = false;
  this.health = 20;
}
BossTurret.prototype = new Entity();
BossTurret.prototype.constructor = Boss1;

BossTurret.prototype.update = function () {

    if(this.health < 1){
      this.removeFromWorld = true;
    }

    //this.x += this.game.clockTick * this.speed;
    //if (this.x > 800) this.x = -230;
    var dx = this.game.mouseX - this.xMid-1;
    var dy = (this.yMid - this.game.mouseY)-1;
    // this should be the angle in radians
    this.angle = -Math.atan2(dy,dx);
    //if we want it in degrees
    //this.angle *= 180 / Math.PI;


    if (this.game.wasclicked){
    //  console.log("the x of the turret: " + this.x  + " and the y: " + this.y);
      this.game.addEntity(new LaserBlast(this.game, AM.getAsset("./img/LaserBlast.png"),
                          this.xMid-(this.pWidth/2), this.yMid- (this.pHeight)/2, dx, dy, this.angle - Math.PI/2));

    }


    Entity.prototype.update.call(this);
}

BossTurret.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);

    //Entity.prototype.draw.call(this);
}
function LaserBlast(game, spritesheet, xIn, yIn, dx, dy, angle){
  this.animation = new Animation(spritesheet, 32, 32, 128, 0.15, 4, true, 1);
  this.name = "EnemyProjectile";
  this.angle = angle;

  this.game = game;
  this.speedX = 1;
  this.speedY = 1;
  this.dx = dx/this.speedX;
  this.dy = -dy/this.speedY;
  this.ctx = game.ctx;
  this.x = xIn; //this.game.mouseX - 22;
  this.y = yIn; //this.game.mouseY;
  this.lifetime = 600;
  this.removeFromWorld = false;
}
LaserBlast.prototype = new Entity();
LaserBlast.prototype.constructor = LaserBlast;

LaserBlast.prototype.update = function () {
    this.x += this.game.clockTick * this.dx;
    this.y += this.game.clockTick * this.dy;
    this.lifetime = this.lifetime - 1;

    if (this.lifetime < 0){
      this.removeFromWorld = true;
    }

    Entity.prototype.update.call(this);
}

LaserBlast.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
    Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// Scourge - Enemy
/* ========================================================================================================== */
function Scourge(game, spritesheet) {

	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = .5;
	this.animation = new Animation(spritesheet, this.pWidth, this.pHeight, 640, 0.1, 5, true, this.scale);
	this.angle = 0;
	this.name = "Enemy";
	this.speed = 0;
	this.x = 350;
	this.y = 350;
  this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
  this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
  this.radius = 41 * this.scale;
  this.game = game;
  this.ctx = game.ctx;
  this.removeFromWorld = false;
  this.health = 1;
  console.log("starting health: " + this.health);
  Entity.call(this, game, this.x, this.y);
}

Scourge.prototype = new Entity();
Scourge.prototype.constructor = Scourge;

//function SpaceExplosion(game, spritesheet, shipX, shipY) {
Scourge.prototype.update = function () {
  //console.log("Scourge: " + this.xMid + ", " + this.yMid);
  Entity.prototype.update.call(this);

    // update angle
    var dx = this.game.player[0].xMid - this.xMid;
    var dy = this.yMid - this.game.player[0].yMid;
    this.angle = -Math.atan2(dy,dx);

  for(var i = 0; i < this.game.entities.length; i++) {
    var ent = this.game.entities[i];
    ent.victims = [];
    var found = false;
    if(ent.name === "ShipProjectile") {
      //console.log("Projectile");
      if(Collide(this, ent)) {
        for(var j = 0; j < ent.victims.length; j++) {
          if(this === ent.victims[j]) {
            found = true;
          }
        }

        if(!found) {
        	// we need to reference the damage value of the projectile here, not do --
          console.log("I've been hit!");
          this.health--;
          console.log("new health: " + this.health);
          ent.victims.push(this);
          //should be an if statement to check for persistent weapon
          if(!ent.persistent) {
            ent.removeFromWorld = true;
          }

        }

        if(this.health < 1) {
          this.removeFromWorld = true;

          var explosion = new SpaceExplosion(this.game, this.xMid, this.yMid);
          this.game.addEntity(explosion);

          // drop a powerup!, this will change to Math.random type thing later, maybe 5% chance?
          var spreader = new Spreader(this.game);
          spreader.x = this.xMid - (spreader.pWidth * spreader.scale / 2);
          spreader.y = this.yMid - (spreader.pHeight * spreader.scale / 2);
          this.game.addEntity(spreader);
        }
      }
    }
  }
}

Scourge.prototype.draw = function () {
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);

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
// The Ship
/* ========================================================================================================== */
function TheShip(game) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.5;
    this.idleAnimation = new Animation(AM.getAsset("./img/shipIdle.png"), this.pWidth, this.pHeight, 256, 0.03, 2, true, this.scale);
    this.boostAnimation = new Animation(AM.getAsset("./img/shipBoost.png"), this.pWidth, this.pHeight, 256, 0.03, 2, true, this.scale);
    this.rollAnimation = new Animation(AM.getAsset("./img/shipRoll.png"), this.pWidth, this.pHeight, 256, 0.03, 22, false, this.scale);
    this.boostRollAnimation = new Animation(AM.getAsset("./img/shipBoostRoll.png"), this.pWidth, this.pHeight, 256, 0.03, 22, false, this.scale);
    this.reticleAnimation = new Animation(AM.getAsset("./img/shipReticle.png"), this.pWidth, this.pHeight, 256, 0.5, 2, true, 0.25);

    this.name = "Player";
    this.speed = 0.5;
    this.boosting = false;
    this.cancelBoost = false;
    this.rolling = false;
    this.rollCooldown = 0;
    this.x = 100;
    this.y = 100;
    this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
    this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
    this.radius = this.scale * 64;
    this.angle = 0;
    this.primaryCooldownMax = 20;
    this.primaryCooldown = 0;
    this.secondaryCooldownMax = 50;
    this.secondaryCooldown = 0;
    this.spreader = 0;

    this.game = game;
    this.ctx = game.ctx;
    this.removeFromWorld = false;
    Entity.call(this, game, this.x, this.y);
}

TheShip.prototype = new Entity();
TheShip.prototype.constructor = TheShip;

TheShip.prototype.update = function () {
	// movement
	if (this.game.moveUp) {
		if (this.yMid - this.radius > 0) {
			this.y -= 10 * this.speed;
		}
	}
	if (this.game.moveLeft) {
		if (this.xMid - this.radius > 0) {
			this.x -= 10 * this.speed;
		}
	}
	if (this.game.moveDown) {
		if (this.yMid + this.radius < 700) {
			this.y += 10 * this.speed;
		}
	}
	if (this.game.moveRight) {
		if (this.xMid + this.radius < 800) {
			this.x += 10 * this.speed;
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

	// boosting
	if (this.game.boost && !this.rolling) {
		this.cancelBoost = false;
		this.boosting = true;
		this.speed = 1;
	}
	if (!this.game.boost && !this.rolling) {
		this.boosting = false;
		this.speed = 0.5;
	}

	// boost input buffer during rolls
	if (this.game.boost && this.rolling) {
		this.cancelBoost = false;
	}
	if (!this.game.boost && this.rolling) {
		this.cancelBoost = true;
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
	if (this.game.firePrimary && this.primaryCooldown === 0) {
		this.primaryCooldown = this.primaryCooldownMax;
		for (var i = 0; i < 2; i++) {
			var offset = (Math.PI / 24 * Math.pow(-1, i));
			this.createProjectile("Primary", offset, 0);
        }
        if (this.spreader > 0) {
        	for (var i = 0; i < 2; i++) {
        		this.createProjectile("Primary", 0, ((Math.PI / 6) * Math.pow(-1, i)));
        	}
        }
	}
	if (this.game.fireSecondary && this.secondaryCooldown === 0) {
		this.secondaryCooldown = this.secondaryCooldownMax;
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
       			   ((this.radius + projectile.pWidth * projectile.scale / 2) *
       			   Math.cos(angle + offset));
    projectile.y = this.yMid - (projectile.pHeight * projectile.scale / 2)  +
       			   ((this.radius + projectile.pHeight * projectile.scale / 2) *
       			   Math.sin(angle + offset));
    projectile.velocity.x = dir.x * projectile.maxSpeed;
    projectile.velocity.y = dir.y * projectile.maxSpeed;
    projectile.angle = angle;

	this.game.addEntity(projectile);
}

TheShip.prototype.draw = function () {
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

    this.reticleAnimation.drawFrame(this.game.clockTick, this.ctx,
    							   (this.game.mouseX - (this.pWidth * 0.25 / 2) - 1),
    							   (this.game.mouseY - (this.pHeight * 0.25 / 2) - 1), 0); // - (this.pHeight * 0.25 / 2));

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

	this.name = "ShipProjectile";
	this.x = 0;
	this.y = 0;
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
	this.radius = 10;
	this.angle = 0;

	this.lifetime = 500;
	this.damage = 2;
	this.maxSpeed = 1500;
	this.velocity = {x: 0, y: 0};

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

ShipPrimary.prototype = new Entity();
ShipPrimary.prototype.constructor = ShipPrimary;

ShipPrimary.prototype.update = function () {
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
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);

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

	this.name = "ShipProjectile";
	this.x = 0;
	this.y = 0;
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
	this.radius = 10;
	this.angle = 0;

	this.lifetime = 1500;
	this.damage = 10;
	this.maxSpeed = 500;
	this.velocity = {x: 0, y: 0};

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

ShipSecondary.prototype = new Entity();
ShipSecondary.prototype.constructor = ShipSecondary;

ShipSecondary.prototype.update = function () {
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
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);

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
// Power Ups
/* ========================================================================================================== */

function Spreader(game) {
	this.pWidth = 128;
	this.pHeight = 128;
	this.scale = 0.75;
	this.animation = new Animation(AM.getAsset("./img/spreader.png"), this.pWidth, this.pHeight, 256, 0.15, 2, true, this.scale);

	this.name = "PowerUp";
	this.x = 0;
	this.y = 0;
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;
	this.radius = this.scale * 42;
	this.angle = 0;

	this.lifetime = 1500;

	this.game = game;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
}

Spreader.prototype = new Entity();
Spreader.prototype.constructor = Spreader;

Spreader.prototype.update = function () {
	this.xMid = (this.x + (this.pWidth * this.scale / 2)) - 1;
	this.yMid = (this.y + (this.pHeight * this.scale / 2)) - 1;

	if (Collide(this, this.game.player[0])) {
		this.game.player[0].spreader = 1000;
		this.removeFromWorld = true;
	}

	this.lifetime -= 1;
	if (this.lifetime < 0) {
		this.removeFromWorld = true;
	}

    Entity.prototype.update.call(this);
}

Spreader.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.angle);

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
// Asset Manager aka Main
/* ========================================================================================================== */
var AM = new AssetManager();
AM.queueDownload("./img/smartBomb.png");
AM.queueDownload("./img/space1-1.png");

AM.queueDownload("./img/shipIdle.png");
AM.queueDownload("./img/shipBoost.png");
AM.queueDownload("./img/shipRoll.png");
AM.queueDownload("./img/shipBoostRoll.png");
AM.queueDownload("./img/shipReticle.png");
AM.queueDownload("./img/shipPrimary1.png");
AM.queueDownload("./img/shipSecondary1.png");

AM.queueDownload("./img/spreader.png");

AM.queueDownload("./img/Boss1.png");
AM.queueDownload("./img/BossTurret.png");
AM.queueDownload("./img/LaserBlast.png");
AM.queueDownload("./img/scourge.png");


AM.queueDownload("./img/SpaceExplosion.png");
AM.queueDownload("./img/Explosion1.png");

AM.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    // always load background first
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/space1-1.png")));

    // load the environment assets next
    // gameEngine.addEntity(new Boss1(gameEngine, AM.getAsset("./img/Boss1.png")));
    // gameEngine.addEntity(new BossTurret(gameEngine, AM.getAsset("./img/BossTurret.png"), 375, 380));
    // gameEngine.addEntity(new BossTurret(gameEngine, AM.getAsset("./img/BossTurret.png"), 310, 520));
    // gameEngine.addEntity(new BossTurret(gameEngine, AM.getAsset("./img/BossTurret.png"), 375, 325));
    // gameEngine.addEntity(new BossTurret(gameEngine, AM.getAsset("./img/BossTurret.png"), 435, 520));
    gameEngine.addEntity(new Scourge(gameEngine, AM.getAsset("./img/scourge.png")));

    // the ship is always loaded last
    gameEngine.addEntity(new TheShip(gameEngine));

    console.log("All Done!");
});

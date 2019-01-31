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


Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                  xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  x, y,
                  this.frameWidth * this.scale,
                  this.frameHeight * this.scale);
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
    this.x = 0;
    this.y = 0;
    this.xMax = this.spritesheet.naturalWidth;
    this.yMax = this.spritesheet.naturalHeight;
    
};

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet, this.x - this.game.camera.x, this.y - this.game.camera.y);	
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, 100, 20);
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(`B ${Math.floor(this.x)}=x \n ${Math.floor(this.y)}=y`, 10, 10);
    Entity.prototype.draw.call(this);
};

Background.prototype.update = function () {
    
    Entity.prototype.update.call(this);

};

function Camera(game) {
    this.game = game;
    this.ctx = game.ctx;
    this.ship = game.ship;
    this.x = this.ship.x - this.ctx.canvas.width  / 2;
    this.y = this.ship.y - this.ctx.canvas.height / 2;    
   
}

Camera.prototype = new Entity();
Camera.prototype.constructor = Camera;

Camera.prototype.draw = function () {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, 100, 100);
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(`C ${Math.floor(this.x)}=x \n ${Math.floor(this.y)} = y`, 10, 20); 

    Entity.prototype.draw.call(this);    
};

Camera.prototype.update = function () {
    this.x = this.ship.x - this.ctx.canvas.width  / 2;
    this.y = this.ship.y - this.ctx.canvas.height / 2;
    
    Entity.prototype.update.call(this);
};


/* ========================================================================================================== */
// Boss 1
/* ========================================================================================================== */
function Boss1(game, spritesheet, x, y){
  this.animation = new Animation(spritesheet, 200, 450, 1200, 0.175, 6, true, 1);
  
  this.x = x;
  this.y = y;
  
  this.speed = 30;
  this.angle = 0;
  this.game = game; 
  this.ctx = game.ctx;
  this.removeFromWorld = false;
}

Boss1.prototype = new Entity();
Boss1.prototype.constructor = Boss1;

Boss1.prototype.update = function () {
    /*this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    this.angle += 5;

    Entity.prototype.update.call(this);
*/}

Boss1.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, 
	    		     this.ctx, 
	    		     this.x + (this.x - this.game.camera.x), 
	                     this.y + (this.y - this.game.camera.y));
    Entity.prototype.draw.call(this);
}

function BossTurret(game, spritesheet, x, y) {
  this.animation = new Animation(spritesheet, 32, 32, 672, 0.2, 21, true, 1.5);
  this.x = x;
  this.y = y;
  this.hitcenterX = this.x + 16;
  this.hitcenterY = this.y + 16;
  this.hitRadius = 16;
  this.speed = 0;
  this.angle = 0;
  this.game = game;
  this.ctx = game.ctx;
  this.removeFromWorld = false;
}
BossTurret.prototype = new Entity();
BossTurret.prototype.constructor = Boss1;

BossTurret.prototype.update = function () {

    //this.x += this.game.clockTick * this.speed;
    //if (this.x > 800) this.x = -230;
    var dx = this.game.mousex - this.x;
    var dy = this.y - this.game.mousey;
    // this should be the angle in radians
    this.angle = Math.atan2(dy,dx);
    //if we want it in degrees
    //this.angle *= 180 / Math.PI;


    if (this.game.wasclicked){
      console.log("the x of the turret: " + this.x  + " and the y: " + this.y);
      this.game.addEntity(new LaserBlast(this.game, AM.getAsset("./img/LaserBlast.png"), this.x, this.y, dx, dy));

    }


    Entity.prototype.update.call(this);
}

BossTurret.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, 
	    		     this.ctx, 
	    		     this.x + (this.x - this.game.camera.x), 
	                     this.y + (this.y - this.game.camera.y));


    Entity.prototype.draw.call(this);
}

function LaserBlast(game, spritesheet, xIn, yIn, dx, dy){
  this.animation = new Animation(spritesheet, 32, 32, 128, 0.15, 4, true, 1);
  this.game = game;
  this.speedX = 1;
  this.speedY = 1;
  this.dx = dx/this.speedX;
  this.dy = -dy/this.speedY;
  this.ctx = game.ctx;
  this.x = xIn; //this.game.mousex - 22;
  this.y = yIn; //this.game.mousey;
  this.lifetime = 600;
  this.removeFromWorld = false;
}

LaserBlast.prototype = new Entity();
LaserBlast.prototype.constructor = LaserBlast;

LaserBlast.prototype.update = function () {
    this.x += this.game.clockTick * this.dx;
    this.y += this.game.clockTick * this.dy;

    if (this.x > 800) this.x = -230;
    if (this.y > 800) this.y = -230;
    this.lifetime = this.lifetime - 1;
    if (this.lifetime < 0){
      this.removeFromWorld = true;
    }

    Entity.prototype.update.call(this);
}

LaserBlast.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// The Ship
/* ========================================================================================================== */
function TheShip(game, spritesheet) {
    this.animation = new Animation(spritesheet, 128, 128, 256, 0.03, 2, true, 1);
    this.removeFromWorld = false;
    this.game = game;
    this.ctx = game.ctx;
    this.camera;
    this.x = this.game.background.xMax / 2 + this.ctx.canvas.width  / 2;
    this.y = this.game.background.yMax / 2 + this.ctx.canvas.height / 2;
    this.speed = 0;

    Entity.call(this, game, this.x, this.y);
}

TheShip.prototype = new Entity();
TheShip.prototype.constructor = TheShip;

TheShip.prototype.update = function () {
	
	var speed = 500; //debug

	if (this.game.moveUp) {

		this.y  -= this.game.clockTick * speed; //'* speed' is placeholder for speed implementation later
	}

	if (this.game.moveLeft) {
	
		this.x  -= this.game.clockTick * speed;
	}

	if (this.game.moveDown) {

		this.y  += this.game.clockTick * speed;
	}

	if (this.game.moveRight) {

		this.x  += this.game.clockTick * speed;
	}
	Entity.prototype.update.call(this);

}

TheShip.prototype.draw = function () {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 20, 100, 20);
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(`S ${Math.floor(this.x)}=x ${Math.floor(this.y)}=y`, 10, 30);

	this.animation.drawFrame(this.game.clockTick, this.ctx, 
       	    		     	 this.x - this.game.camera.x,
		    		 this.y - this.game.camera.y);
    Entity.prototype.draw.call(this);
}

/* ========================================================================================================== */
// Asset Manager
/* ========================================================================================================== */
var AM = new AssetManager();
AM.queueDownload("./img/smartBomb.png");
AM.queueDownload("./img/space1-1.png");
AM.queueDownload("./img/shipIdle.png");
AM.queueDownload("./img/Boss1.png");
AM.queueDownload("./img/BossTurret.png");
AM.queueDownload("./img/LaserBlast.png");

AM.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();

    gameEngine.init(ctx); 
    
    // Camera, ship and background need to be privileged for map config and boundary settings.
    var background = new Background(gameEngine, AM.getAsset("./img/space1-1.png"));
    gameEngine.background = background;
    var ship   = new TheShip(gameEngine, AM.getAsset("./img/shipIdle.png"));
    gameEngine.ship = ship; //3 Privilege
    var camera = new Camera(gameEngine);//4           
    gameEngine.camera = camera; //6 Privilege    
    gameEngine.addEntity(background);

 
    gameEngine.addEntity(new Boss1(gameEngine, AM.getAsset("./img/Boss1.png"), 300, 175));
    gameEngine.addEntity(new Boss1(gameEngine, AM.getAsset("./img/Boss1.png"), 500, 175));
    gameEngine.addEntity(new BossTurret(gameEngine, AM.getAsset("./img/BossTurret.png"), 370, 345));
    gameEngine.addEntity(new BossTurret(gameEngine, AM.getAsset("./img/BossTurret.png"), 310, 345));
    gameEngine.addEntity(new BossTurret(gameEngine, AM.getAsset("./img/BossTurret.png"), 340, 245));
    gameEngine.addEntity(new BossTurret(gameEngine, AM.getAsset("./img/BossTurret.png"), 340, 275));
    gameEngine.addEntity(ship);//2
    gameEngine.addEntity(camera);//5
    
    gameEngine.start();
	
    console.log("All Done!");
});



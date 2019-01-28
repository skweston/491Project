var AM = new AssetManager();

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

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};
//function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
function Boss1(game, spritesheet){
  this.animation = new Animation(spritesheet, 200, 450, 1200, 0.175, 6, true, 1);
  this.x = 300;
  this.y = 175;
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
    this.angle += 5;

    Entity.prototype.update.call(this);
}

Boss1.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function BossTurret(game, spritesheet, x, y){
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
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);

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

//spriteSheet, frameWidth, frameHeight, sheetWidth,  frameDuration, frames, loop, scale
function SpaceExplosion(game, spritesheet, shipX, shipY) {
  this.animation = new Animation(spritesheet, 324, 169, 2,  0.15, 6, true, 1);
  this.game = game;
  this.ctx = game.ctx;
  this.x = shipX;
  this.y = shipY;
}

SpaceExplosion.prototype.draw = function () {
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
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

AM.queueDownload("./img/Boss1.png");
AM.queueDownload("./img/LaserBlast.png");
AM.queueDownload("./img/BossTurret.png");
AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/SpaceExplosion.png");
AM.queueDownload("./img/Explosion1.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    // gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    // gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
    // gameEngine.addEntity(new Cheetah(gameEngine, AM.getAsset("./img/runningcat.png")));
    // gameEngine.addEntity(new Guy(gameEngine, AM.getAsset("./img/guy.jpg")));
    gameEngine.addEntity(new Boss1(gameEngine, AM.getAsset("./img/Boss1.png")));
    gameEngine.addEntity(new BossTurret(gameEngine, AM.getAsset("./img/BossTurret.png"), 375, 380));
    gameEngine.addEntity(new BossTurret(gameEngine, AM.getAsset("./img/BossTurret.png"), 310, 520));
    gameEngine.addEntity(new BossTurret(gameEngine, AM.getAsset("./img/BossTurret.png"), 375, 325));
    gameEngine.addEntity(new BossTurret(gameEngine, AM.getAsset("./img/BossTurret.png"), 435, 520));
    //gameEngine.addEntity(new LaserBlast(gameEngine, AM.getAsset("./img/LaserBlast.png")));

    gameEngine.addEntity(new SpaceExplosion(gameEngine, AM.getAsset("./img/SpaceExplosion.png"), 0, 0));
   gameEngine.addEntity(new GroundExplosion(gameEngine, AM.getAsset("./img/Explosion1.png"), 100, 100));

    console.log("All Done!");
});

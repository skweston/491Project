window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function GameEngine() {
    this.entities = [];
    this.player = [];
    this.enemies = [];
    this.enemyProjectiles = [];
    this.playerProjectiles = [];

    // player input
    this.wasclicked = false;
    this.mousex = 0;
    this.mousey = 0;
    this.moveUp = false;
    this.moveLeft = false;
    this.moveDown = false;
    this.moveRight = false;
    this.boost = false;
    this.roll = false;

    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.startInput();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        return { x: x, y: y };
    }

    var that = this;

    // event listeners are added here

    this.ctx.canvas.addEventListener("click", function (e) {
        that.click = getXandY(e);
        that.wasclicked = true;
        console.log(e);
        console.log("Left Click Event - X,Y " + e.clientX + ", " + e.clientY);
    }, false);

    this.ctx.canvas.addEventListener("contextmenu", function (e) {
        that.click = getXandY(e);
        console.log(e);
        console.log("Right Click Event - X,Y " + e.clientX + ", " + e.clientY);
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("mousedown", function (e) {
        that.click = getXandY(e);
        console.log(e);
        if (e.which === 1) {
            console.log("Left Mouse Down - X,Y " + e.clientX + ", " + e.clientY);
        }
        if (e.which === 3) {
            console.log("Right Mouse Down - X,Y " + e.clientX + ", " + e.clientY);
        }
    }, false);

    this.ctx.canvas.addEventListener("mouseup", function (e) {
        that.click = getXandY(e);
        console.log(e);
        if (e.which === 1) {
            console.log("Left Mouse Up - X,Y " + e.clientX + ", " + e.clientY);
        }
        if (e.which === 3) {
            console.log("Right Mouse Up - X,Y " + e.clientX + ", " + e.clientY);
        }
    }, false);

    this.ctx.canvas.addEventListener("mousemove", function (e) {
        //console.log(e);
        that.mouse = getXandY(e);
        that.mousex = e.x;
        that.mousey = e.y;
        //console.log("Current mouse x: " + that.mousex + " current mouse y: " + that.mousey );
    }, false);

    this.ctx.canvas.addEventListener("mousewheel", function (e) {
        console.log(e);
        that.wheel = e;
        console.log("Click Event - X,Y " + e.clientX + ", " + e.clientY + " Delta " + e.deltaY);
    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        e.preventDefault();
        if (e.code === "KeyW") {
            that.moveUp = true;
        }

        if (e.code === "KeyA") {
            that.moveLeft = true;
        }

        if (e.code === "KeyS") {
            that.moveDown = true;
        }

        if (e.code === "KeyD") {
            that.moveRight = true;
        }

        if (e.code === "ShiftLeft") {
            that.boost = true;
        }
        if (e.code === "Space") {
            that.roll = true;
        }
    }, false);

    this.ctx.canvas.addEventListener("keypress", function (e) {
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        e.preventDefault();
        if (e.code === "KeyW") {
            that.moveUp = false;
        }

        if (e.code === "KeyA") {
            that.moveLeft = false;
        }

        if (e.code === "KeyS") {
            that.moveDown = false;
        }

        if (e.code === "KeyD") {
            that.moveRight = false;
        }

        if (e.code === "ShiftLeft") {
            that.boost = false;
        }
    }, false);

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}
GameEngine.prototype.addPlayerProjectile = function (entity) {
    console.log('added projectile');
    this.projectiles.push(entity);
}
GameEngine.prototype.addEnemyProjectile = function (entity) {
    console.log('added enemy projectile');
    this.enemyProjectiles.push(entity);
}
GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        if(entity.removeFromWorld){
            this.entities.splice(i,1);
            entitiesCount--;
            i--;
      } else {
        entity.update();
      }
    }
    this.wasclicked = false;
    this.roll = false;
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}

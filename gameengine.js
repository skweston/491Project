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
	// this.entities = [];
	this.levels = [];
	this.background = [];
	this.player = [];
	this.enemies = [];
	this.playerProjectiles = [];
	this.enemyProjectiles = [];
	this.extras = [];
	this.effects = [];

	// start the game
	this.mouse = false;
	this.clicked = false;

	// player input
	this.mouseX = 0;
	this.mouseY = 0;
	this.firePrimary = false;
	this.fireSecondary = false;
	this.bomb = false;
	this.moveUp = false;
	this.moveLeft = false;
	this.moveDown = false;
	this.moveRight = false;
	this.boost = false;
	this.roll = false;

	this.ctx = null;
	this.camera = null;
	this.cameraCtx = null;
	this.surfaceWidth = null;
	this.surfaceHeight = null;
}

GameEngine.prototype.init = function (ctx, cameraCtx) {
	this.ctx = ctx;
	this.cameraCtx = cameraCtx;
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
		requestAnimFrame(gameLoop, that.cameraCtx.canvas);
	})();
}

GameEngine.prototype.startInput = function () {
	console.log('Starting input');
	var that = this;

	var getXandY = function (e) {
		var x = e.clientX - that.cameraCtx.canvas.getBoundingClientRect().left + 100;
		var y = e.clientY - that.cameraCtx.canvas.getBoundingClientRect().top + 100;

		return { x: x, y: y};
	}

	var that = this;

	// event listeners are added here

	this.cameraCtx.canvas.addEventListener("click", function (e) {
		that.mouse = true;
		that.mouseX = (e.x - 7 + that.camera.x);
		that.mouseY = (e.y - 7 + that.camera.y);
		that.wasclicked = true;
		// console.log(e);
		// console.log("Left Click Event - X,Y " + e.clientX + ", " + e.clientY);
	}, false);

	this.cameraCtx.canvas.addEventListener("contextmenu", function (e) {
		that.mouse = true;
		that.mouseX = (e.x - 7 + that.camera.x);
		that.mouseY = (e.y - 7 + that.camera.y);
		// console.log(e);
		// console.log("Right Click Event - X,Y " + e.clientX + ", " + e.clientY);
		e.preventDefault();
	}, false);

	this.cameraCtx.canvas.addEventListener("mousedown", function (e) {
		that.mouse = true;
		that.mouseX = (e.x - 7 + that.camera.x);
		that.mouseY = (e.y - 7 + that.camera.y);
		// console.log(e);
		if (e.which === 1) {
			that.firePrimary = true;
			// console.log("Left Mouse Down - X,Y " + e.clientX + ", " + e.clientY);
		}
		if (e.which === 3) {
			that.fireSecondary = true;
			// console.log("Right Mouse Down - X,Y " + e.clientX + ", " + e.clientY);
		}
	}, false);

	this.cameraCtx.canvas.addEventListener("mouseup", function (e) {
		that.mouse = true;
		that.mouseX = (e.x - 7 + that.camera.x);
		that.mouseY = (e.y - 7 + that.camera.y);
		// console.log(e);
		if (e.which === 1) {
			that.firePrimary = false;
			// console.log("Left Mouse Up - X,Y " + e.clientX + ", " + e.clientY);
		}
		if (e.which === 3) {
			that.fireSecondary = false;
			// console.log("Right Mouse Up - X,Y " + e.clientX + ", " + e.clientY);
		}
	}, false);

	this.cameraCtx.canvas.addEventListener("mousemove", function (e) {
		//console.log(e);
		that.mouse = true;
		that.mouseX = (e.x - 7 + that.camera.x);
		that.mouseY = (e.y - 7 + that.camera.y);
		//console.log("Current mouse x: " + that.mousex + " current mouse y: " + that.mousey );
	}, false);

	this.cameraCtx.canvas.addEventListener("mouseover", function (e) {
		//console.log(e);
		that.mouse = true;
		that.mouseX = (e.x - 7 + that.camera.x);
		that.mouseY = (e.y - 7 + that.camera.y);
		//console.log("Current mouse x: " + that.mousex + " current mouse y: " + that.mousey );
	}, false);

	this.cameraCtx.canvas.addEventListener("mouseleave", function (e) {

		that.mouseX = (e.x - 7 + that.camera.x);
		that.mouseY = (e.y - 7 + that.camera.y);
		that.mouse = false;
	}, false);

	this.cameraCtx.canvas.addEventListener("mousewheel", function (e) {
		that.wheel = e;
	}, false);

	this.cameraCtx.canvas.addEventListener("keydown", function (e) {
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
		if (e.code === "Enter") {
			that.clicked = true;
		}
	}, false);

	this.cameraCtx.canvas.addEventListener("keypress", function (e) {
		e.preventDefault();
	}, false);

	this.cameraCtx.canvas.addEventListener("keyup", function (e) {
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
		if (e.code === "AltLeft") {
			that.gameStart = true;
		}
	}, false);

	console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
	// console.log('added entity');
	// this.entities.push(entity);
	if (entity.name === "Level") {
		this.levels.push(entity);
	}
	if (entity.name === "Background") {
		this.background.push(entity);
	}
	if (entity.name === "Player") {
		this.player.push(entity);
	}
	if (entity.name === "Enemy") {
		this.enemies.push(entity);
	}
	if (entity.name === "PlayerProjectile") {
		this.playerProjectiles.push(entity)
	}
	if (entity.name === "EnemyProjectile") {
		this.enemyProjectiles.push(entity);
	}
	if (entity.name === "Extra") {
		this.extras.push(entity);
	}
	if (entity.name === "Effect") {
		this.effects.push(entity);
	}
}

GameEngine.prototype.draw = function () {
	this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
	this.ctx.save();
	this.cameraCtx.clearRect(0,0,800,800);
	this.cameraCtx.save();
	// for (var i = 0; i < this.entities.length; i++) {
		//     this.entities[i].draw(this.ctx);
	// }

	for (var i = 0; i < this.background.length; i++) {
		this.background[i].draw(this.ctx);
	}
	for (var i = 0; i < this.levels.length; i++) {
		this.levels[i].draw(this.ctx);
	}
	for (var i = 0; i < this.playerProjectiles.length; i++) {
		this.playerProjectiles[i].draw(this.ctx);
	}
	for (var i = 0; i < this.enemyProjectiles.length; i++) {
		this.enemyProjectiles[i].draw(this.ctx);
	}
	for (var i = 0; i < this.extras.length; i++) {
		this.extras[i].draw(this.ctx);
	}
	for (var i = 0; i < this.enemies.length; i++) {
		this.enemies[i].draw(this.ctx);
	}
	for (var i = 0; i < this.effects.length; i++) {
		this.effects[i].draw(this.ctx);
	}
	for (var i = 0; i < this.player.length; i++) {
		this.player[i].draw(this.ctx);
	}

	this.ctx.restore();
	this.camera.draw(this.cameraCtx);
	this.cameraCtx.restore();
}

GameEngine.prototype.update = function () {
	// var entitiesCount = this.entities.length;

	// for (var i = 0; i < entitiesCount; i++) {
	// 	var entity = this.entities[i];
	// 	if(entity.removeFromWorld){
	// 		this.entities.splice(i,1);
	// 		entitiesCount--;
	// 		i--;
	// 	}
	// 	else {
	// 		entity.update();
	// 	}
	// }

	this.camera.update();
	var count = this.background.length;
	for (var i = 0; i < count; i++) {
		var entity = this.background[i];
		if (entity.removeFromWorld) {
			this.background.splice(i, 1);
			count--;
			i--;
		}
		else {
			entity.update();
		}
	}

	count = this.levels.length;
	for (var i = 0; i < count; i++) {
		var entity = this.levels[i];
		if (entity.removeFromWorld) {
			this.levels.splice(i, 1);
			count--;
			i--;
		}
		else {
			entity.update();
		}
	}

	count = this.playerProjectiles.length;
	for (var i = 0; i < count; i++) {
		var entity = this.playerProjectiles[i];
		if (entity.removeFromWorld) {
			this.playerProjectiles.splice(i, 1);
			count--;
			i--;
		}
		else {
			entity.update();
		}
	}

	count = this.enemyProjectiles.length;
	for (var i = 0; i < count; i++) {
		var entity = this.enemyProjectiles[i];
		if (entity.removeFromWorld) {
			this.enemyProjectiles.splice(i, 1);
			count--;
			i--;
		}
		else {
			entity.update();
		}
	}
	count = this.extras.length;
	for (var i = 0; i < count; i++) {
		var entity = this.extras[i];
		if (entity.removeFromWorld) {
			this.extras.splice(i, 1);
			count--;
			i--;
		}
		else {
			entity.update();
		}
	}
	count = this.effects.length;
	for (var i = 0; i < count; i++) {
		var entity = this.effects[i];
		if (entity.removeFromWorld) {
			this.effects.splice(i, 1);
			count--;
			i--;
		}
		else {
			entity.update();
		}
	}

	count = this.enemies.length;
	for (var i = 0; i < count; i++) {
		var entity = this.enemies[i];
		if (entity.removeFromWorld) {
			entity.generateItem();
			this.enemies.splice(i, 1);
			count--;
			i--;
		}
		else {
			entity.update();
		}
	}

	count = this.player.length;
	for (var i = 0; i < count; i++) {
		var entity = this.player[i];
		if (entity.removeFromWorld) {
			this.player.splice(i, 1);
			count--;
			i--;
		}
		else {
			entity.update();
		}
	}
	this.camera.update();

	this.wasclicked = false;
	this.roll = false;
	this.bomb = false;
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

/*
Any Entity being assigned damage can just use this function,
which can be updated as needed. i.e: The player is checked for
I frames when collision is detected, perhaps a weakspot damage =9999
for a powerup that sets all targets to 0 health.
*/
Entity.prototype.takeDamage = function(damage) {

	// The entity taking damage is relevant?
	//console.log("This:");
	if (this.name === 'Player' || this.name === 'Enemy') {

		// Is it a Player? if so make sure its not invincible
		//console.log(`if: ${this.name}`);
		if(!this.name === 'Player' || !this.invincible) {

			// Whatever it is, hurt it. With
			//console.log("got hurt");
			this.health -= damage;
		}
	}
}

Entity.prototype.generateItem = function() {
	//can use this.name to check for enemy or boss to change odds or item drop potential
	var genItem = Math.random() * 100;
	//console.log(`${genItem} ${this.name}`);
	if (genItem < 20) {
		var spreader = new Spreader(this.game);
		spreader.x = this.xMid - (spreader.pWidth * spreader.scale / 2);
		spreader.y = this.yMid - (spreader.pHeight * spreader.scale / 2);
		spreader.xMid = this.xMid;
		spreader.yMid = this.yMid;

		this.game.addEntity(spreader);
	} else if (genItem >= 80 && genItem < 100) {
		//new powerup here
	}
}

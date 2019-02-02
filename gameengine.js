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
		var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left + 100;
		var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top + 100;

		return { x: x, y: y};
	}

	var that = this;

	// event listeners are added here

	this.ctx.canvas.addEventListener("click", function (e) {
		that.click = getXandY(e);
		that.clicked = true;
		that.wasclicked = true;
		// console.log(e);
		// console.log("Left Click Event - X,Y " + e.clientX + ", " + e.clientY);
	}, false);

	this.ctx.canvas.addEventListener("contextmenu", function (e) {
		that.click = getXandY(e);
		// console.log(e);
		// console.log("Right Click Event - X,Y " + e.clientX + ", " + e.clientY);
		e.preventDefault();
	}, false);

	this.ctx.canvas.addEventListener("mousedown", function (e) {
		that.click = getXandY(e);
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

	this.ctx.canvas.addEventListener("mouseup", function (e) {
		that.click = getXandY(e);
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

	this.ctx.canvas.addEventListener("mousemove", function (e) {
		//console.log(e);
		that.mouse = true;
		that.mouseX = (e.x - 7);
		that.mouseY = (e.y - 7);
		//console.log("Current mouse x: " + that.mousex + " current mouse y: " + that.mousey );
	}, false);

	this.ctx.canvas.addEventListener("mouseleave", function (e) {
		that.mouse = false;
	}, false);

	this.ctx.canvas.addEventListener("mousewheel", function (e) {
		that.wheel = e;
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
}

GameEngine.prototype.draw = function () {
	this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
	this.ctx.save();
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
	for (var i = 0; i < this.player.length; i++) {
		this.player[i].draw(this.ctx);
	}

	this.ctx.restore();
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

	count = this.enemies.length;
	for (var i = 0; i < count; i++) {
		var entity = this.enemies[i];
		if (entity.removeFromWorld) {
			this.enemies.splice(i, 1);
			count--;
			i--;
		}
		else {
			entity.update();
		}
	}

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

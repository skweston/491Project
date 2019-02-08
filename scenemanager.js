/* ========================================================================================================== */
// Level Manager stuff
/* ========================================================================================================== */

function PlayGame(game) {
	this.name = "Level";
	this.bossTimer = 1000;
	this.spawnTimer = 0;
	this.spawnNum = 1;
	this.counter = 0;
	Entity.call(this, game);
}

PlayGame.prototype = new Entity();
PlayGame.prototype.constructor = PlayGame;

PlayGame.prototype.reset = function () {
	this.game.running = false;
	this.game.clicked = false;
	this.spawnNum = 1;
	this.counter = 0;
	this.bossTimer = 1000;

	for (var i = 0; i < this.game.extras.length; i++) {
		this.game.extras[i].removeFromWorld = true;
	}

	var ship = new TheShip(this.game);
	var reticle = new Reticle(this.game);
	this.game.addEntity(ship);
	this.game.addEntity(reticle);
	this.game.ship = ship;
}

PlayGame.prototype.update = function () {
	if (!this.game.running && this.game.gameStart) {
		this.game.ship.health = 100;
		SCORE = 0;
		this.game.running = true;
		this.game.gameStart = false;
	}
	if (this.bossTimer > 0){
		this.bossTimer--;
	}
	if (this.game.running && this.bossTimer === 0) {
		this.bossTimer = 1000;
		this.game.addEntity(new Boss1(this.game));
	}
	if (this.spawnTimer > 0) {
		this.spawnTimer--;
	}
	if (this.game.running && this.spawnTimer === 0) {
		this.spawnTimer = 100;

		for (var i = 0; i < this.spawnNum; i++) {
			var border = 0;
			var x = Math.random() * this.game.ctx.canvas.width;
			var y = 0;

			border = Math.floor((Math.random() * 2));

			if (border === 0) {
				x = (Math.random() * 1000) - 100;
				y = (Math.random() * 100);

				if (y < 50) { // top
					y = -50 - y;
				}
				else { // bottom
					y = this.game.ctx.canvas.height + y;
				}
			}
			else {
				y = (Math.random() * 1000) - 100;
				x = (Math.random() * 100);

				if (x < 50) { // left
					x = -50 - x;
				}
				else { // right
					x = this.game.ctx.canvas.width + x;
				}
			}

			this.game.addEntity(new Scourge(this.game, AM.getAsset("./img/scourge.png"), x, y));

			this.counter++;
		}

		if (this.counter % 10 === 0) {
			this.spawnNum++;
		}
	}

	if (this.game.ship.health < 1) {
		this.reset();
	}
}

PlayGame.prototype.draw = function (ctx) {
	if (!this.game.running) {
		ctx.font = "24pt Impact";
		ctx.fillStyle = "Red";
		if (this.game.mouse) {
			ctx.fillStyle = "Pink";
		}

		ctx.textAlign = "center";
		ctx.fillText("WASD to move", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 340);
		ctx.fillText("LClick and RClick to shoot", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 370);
		ctx.fillText("LShift to boost", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 400);
		ctx.fillText("Space to perform a roll", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 430);
		ctx.fillText("Grab powerups to shoot more at once", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 460);
		ctx.fillText("Survive as long as you can!", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 490);
		ctx.fillText("Press Left Alt to start", this.game.camera.x + this.game.cameraCtx.canvas.width/2, this.game.camera.y + 520);
	}

	ctx.font = "24pt Impact";
	ctx.fillStyle = "Red";
	ctx.textAlign = "left";
	ctx.fillText("Health: " + this.game.ship.health,  this.game.camera.x + 10, this.game.camera.y + 40);
	ctx.fillText("Score: " + SCORE, this.game.camera.x + 10, this.game.camera.y + 70);
	//Boost meter
	ctx.fillText("Boost Meter: ",  this.game.camera.x + 10, this.game.camera.y + 100);
	ctx.strokeRect(this.game.camera.x + 10, this.game.camera.y + 105, 200, 20);
	ctx.fillRect(this.game.camera.x + 10, this.game.camera.y + 105, this.game.ship.boost/5, 20);
}

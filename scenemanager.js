
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
	if (!this.game.running && this.game.roll) {
		this.game.ship.health = 100;
		SCORE = 0;
		this.game.running = true;
	}
	if (this.bossTimer > 0){
		this.bossTimer--;
	}
	if(this.game.running && this.bossTimer === 0){
		this.bossTimer = 1000;
		this.game.addEntity(new Boss1(this.game));
		this.game.addEntity(new Spawner(this.game));
	}
	if (this.spawnTimer > 0) {
		this.spawnTimer--;
	}
	if (this.game.running && this.spawnTimer === 0) {
		this.spawnTimer = 100;

		for (var i = 0; i < this.spawnNum; i++) {
			var border = 0;
			var x = Math.random() * 800;
			var y = 0;

			border = Math.floor((Math.random() * 2));

			if (border === 0) {
				x = (Math.random() * 1000) - 100;
				y = (Math.random() * 100);

				if (y < 50) { // top
					y = -50 - y;
				}
				else { // bottom
					y = 800 + y;
				}
			}
			else {
				y = (Math.random() * 1000) - 100;
				x = (Math.random() * 100);

				if (x < 50) { // left
					x = -50 - x;
				}
				else { // right
					x = 800 + x;
				}
			}

			//this.game.addEntity(new Scourge(this.game, AM.getAsset("./img/scourge.png"), x, y));

			this.counter++;
			if (this.counter % 10 === 0) {
				this.spawnNum++;
			}
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
		ctx.fillText("WASD to move", 400, 340);
		ctx.fillText("LClick and RClick to shoot", 400, 370);
		ctx.fillText("LShift to boost", 400, 400);
		ctx.fillText("Space to perform a roll", 400, 430);
		ctx.fillText("Grab powerups to shoot more at once", 400, 460);
		ctx.fillText("Survive as long as you can!", 400, 490);
		ctx.fillText("Press Enter to start", 400, 520);
	}

	ctx.font = "24pt Impact";
	ctx.fillStyle = "Red";
	ctx.textAlign = "left";
	ctx.fillText("Health: " + this.game.ship.health,  10,  40);
	ctx.fillText("Score: " + SCORE, 10, 70);
}

function AssetManager() {
	this.successCount = 0;
	this.errorCount = 0;
	this.cache = [];
	this.downloadQueue = [];
	//this.audioQueue = [];
}

AssetManager.prototype.queueDownload = function (path) {
	console.log("Queueing " + path);
	this.downloadQueue.push(path);
}

/*AssetManager.prototype.queueAudioDL = function (path) {
	console.log("Queueing " + path);
	this.audioQueue.push(path);
}*/

AssetManager.prototype.isDone = function () {
	//var length = this.downloadQueue.length + this.audioQueue.length;
	//return length === this.successCount + this.errorCount;
	return this.downloadQueue.length === this.successCount + this.errorCount;
}

AssetManager.prototype.downloadAll = function (callback) {
	var that = this;
	for (var i = 0; i < this.downloadQueue.length; i++) {
		var img = new Image();

		var path = this.downloadQueue[i];
		console.log(path);

		img.addEventListener("load", function () {
			console.log("Loaded " + this.src);
			that.successCount++;
			if(that.isDone()) callback();
		});

		img.addEventListener("error", function () {
			console.log("Error loading " + this.src);
			that.errorCount++;
			if (that.isDone()) callback();
		});

		img.src = path;
		this.cache[path] = img;
	}

	/*for (var i = 0; i < this.audioQueue.length; i++) {
		var audio = document.createElement('audio');
		console.log("audio created");

		var path = this.audioQueue[i];
		console.log(path);

		audio.addEventListener("load", function () {
			console.log("Loaded " + this.src);
			that.successCount++;
			if(that.isDone()) callback();
		});

		audio.addEventListener("error", function () {
			console.log("Error loading " + this.src);
			that.errorCount++;
			if (that.isDone()) callback();
		});

		audio.src = path;
		this.cache[path] = audio;
	}*/
}

AssetManager.prototype.getAsset = function (path) {
	return this.cache[path];
}
Util.videoPlayer = function() {

//	var player = u.ae(node, "div", "player");
	var player = document.createElement("div");
	u.ac(player, "player");

	// test for HTML5 video
	player.video = u.ae(player, "video");
	player.video.player = player;

	// HTML5 support
	if(typeof(player.video.play) == "function" && !u.explorer()) {

		// load src into player
		player.load = function(src) {

			this.setup();

			// if player is playing - stop it before loading new src
			if(this.className.match("/playing/")) {
				this.stop();
			}

			if(src) {
//				u.bug(this.correctSource(src));
				this.video.src = this.correctSource(src);
				this.video.load();
//				this.video.controls = "hide";
				this.video.controls = false;
			}
		}
		player.play = function(position) {

			position = position == undefined ? false : position;

			if(this.video.currentTime && position !== false) {
				this.video.currentTime = position;
			}

			// only play if src is set
			if(this.video.src) {
				this.video.play();
			}
		}
		player.loadAndPlay = function(src, position) {
			// TODO: put position into a global var?
			this.load(src);
			// firefox does not throw canplaythrough event unless I call play when loading
			this.play(position);
		}

		player.pause = function() {
			this.video.pause();
		}
		player.stop = function() {
			this.video.pause();
			if(this.video.currentTime) {
				this.video.currentTime = 0;
			}
		}

		// toggle between play and pause
		player.togglePlay = function() {
			if(this.className.match(/playing/g)) {
				this.pause();
			}
			else {
				this.play();
			}
		}

		player.setup = function() {

			// reset video safety net (or old video may show before new one loads)
			if(u.qs("video", this)) {
				this.removeChild(this.video);
			}
			// add video player again
			this.video = u.ie(this, "video");
			this.video.player = this;


			// set all playback events
			// loading begins
			this._loadstart = function(event) {
	//			u.bug("load");

				u.ac(this.player, "loading");
			}
			u.e.addEvent(this.video, "loadstart", this._loadstart);

			// enough is loaded to play entire movie
			this._canplaythrough = function(event) {
	//			u.bug("ready");

				u.rc(this.player, "loading");
			}
			u.e.addEvent(this.video, "canplaythrough", this._canplaythrough);

			// movie is playing
			this._playing = function(event) {
//				u.bug("playing" + this.player);

				u.rc(this.player, "loading");
				u.ac(this.player, "playing");
			}
			u.e.addEvent(this.video, "playing", this._playing);

			// movie is paused
			this._paused = function(event) {
	//			u.bug("paused");

				u.rc(this.player, "playing");
			}
			u.e.addEvent(this.video, "pause", this._paused);

			// movie is stalled
			this._stalled = function(event) {
	//			u.bug("stalled");

				u.rc(this.player, "playing");
				u.ac(this.player, "loading");
			}
			u.e.addEvent(this.video, "stalled", this._paused);

			// movie has play til its end
			this._ended = function(event) {
	//			u.bug("ended");

				u.rc(this.player, "playing");
			}
			u.e.addEvent(this.video, "ended", this._ended);
		
		}
		player.eject = function() {
//			this.video.removeAttribute("src");
//			this.video.src = "#";
			if(this.parentNode) {
				if(u.qs("video", this)) {
					this.removeChild(this.video);
				}
				this.parentNode.removeChild(this);
			}
		}

	}
	// Flash support
	else if(document.all || (navigator.plugins && navigator.mimeTypes["application/x-shockwave-flash"])) {

//		u.bug("video")

		// remove HTML5 test element
		player.removeChild(player.video);

		if(!player.id) {
			var id = u.randomString();
			player.id = id;
		}

		player.flash = true;


		player.load = function(src) {

//			u.bug("load_ie:" + src + ":" + this.ready);

			if(!this.ready) {
				this.setup();
			}

//			u.e.removeEvent(this.video, "canplaythrough", this._canplaythrough);
			if(this.ready) {
				if(this.className.match("/playing/")) {
					this.stop();
				}
				if(src) {
//					u.bug("correct source:" + this.correctSource(src));

					this.video.loadVideo(this.correctSource(src));
	//				this.video.controls = "hide";
	//				this.video.controls = false;
				}
			}
			else {
				this.queue(this.load, src);
			}

		}
		player.play = function(position) {
//			u.bug("play:" + position);
			if(this.ready) {
				this.video.playVideo();
			}
			else {
				this.queue(this.play, position);
			}
		}
		player.loadAndPlay = function(src) {
//			u.bug("loadAndPlay:" + src);
//			if(this.ready) {
//				this.video.loadVideo(src);
//				this.video.playVideo();
				this.load(src);
				this.play(0);
//			}
//			else {
//				this.queue(this.loadAndPlay, src);
//			}
		}

		player.pause = function() {
//			u.bug("pause");
			if(this.ready) {
				this.video.pauseVideo();
			}
			else {
				this.queue(this.pause);
			}
		}
		player.stop = function() {
//			u.bug("stop");
			if(this.ready) {

//				TODO: not implemented in flash
//				this.video.stopVideo();
			}
			else {
				this.queue(this.stop);
			}
		}

		// toggle between play and pause
		player.togglePlay = function() {
//			u.bug("togglePlay")

			if(this.ready) {
				if(this.className.match(/playing/g)) {
					this.pause();
				}
				else {
					this.play();
				}
			}
			else {
				this.queue(this.togglePlay);
			}
		}

		player.setup = function() {

//			u.bug("setup")

			// reset video safety net (or old video may show before new one loads)
			if(u.qs("object", this)) {
				this.removeChild(this.video);
			}

			this.ready = false;
			this.video = u.flash(this, "/media/flash/videoplayer.swf?id="+this.id, false, "100%", "100%");

//			u.bug("injected:" + this.video);

			/*

			// add video player again
			this.video.player = this;
			*/
		}

		player.queue = function(action) {
//			u.bug("queue:" + action)

			if(!this.actionsQueue) {
				this.actionsQueue = new Array();
				this.paramsQueue = new Array();
			}

			this.actionsQueue[this.actionsQueue.length] = action;

			// default no parameters
			var params = false;

			// parameters
			/*
			if(arguments.length > 1) {
				var i, param;
				params = new Array();
				for(i = 1; param = arguments[i]; i++) {
					params[i-1] = param;
				}
			}
			*/

			// limit to one param now
			if(arguments.length > 1) {
				params = arguments[1];
			}
			this.paramsQueue[this.paramsQueue.length] = params;

			this.hasQueue = true;
		}
		player.eject = function() {
			this.ready = false;
			if(this.parentNode) {
				this.parentNode.removeChild(this);
			}
		}


		// callback functions
		u.flashVideoPlayer = new Object();

		// player id is passed to flash and flash uses this id as parameter when calling back to the player

		u.flashVideoPlayer.ready = function(id, check) {
//			u.bug("ready:" + id + ":" + check)

			var player = document.getElementById(id);
			player.ready = true;

//			u.bug(player + ":" + player.hasQueue + ":" + player.actionsQueue.length)
			if(player.hasQueue) {
				player.hasQueue = false;


				var i, action;
				for(i = 0; action = player.actionsQueue[i]; i++) {
					player._action = action;

					if(player.paramsQueue[0]) {
						player._action(player.paramsQueue[0]);
					}
					else {
						player._action();
					}

//					u.bug("action:" + action + ":" + player.paramsQueue.toString());

				}

				player.actionsQueue = null;
			}

		}

		u.flashVideoPlayer.ended = function(id) {
			u.rc(document.getElementById(id), "playing");
//			alert("ended");
		}
		u.flashVideoPlayer.paused = function(id) {
			u.rc(document.getElementById(id), "playing");
//			alert("paused");
		}
		u.flashVideoPlayer.loadstart = function(id) {
			u.ac(document.getElementById(id), "loading");
//			u.bug("loadstart" + id);
//			document.getElementById(id).pauseVideo();

		}
		u.flashVideoPlayer.playing = function(id) {
			u.rc(document.getElementById(id), "loading");
			u.ac(document.getElementById(id), "playing");
//			u.bug("playing");
		}
		u.flashVideoPlayer.canplaythrough = function(id) {
			u.rc(document.getElementById(id), "loading");
//			alert("canplaythrough");
		}


	}
	// Other plugin? Create oldschool generic media player plugin
	else {
		player.innerHTML = "<p>no HTML5 or flash</p>";
	}


	// find the correct source for the browser
	player.correctSource = function(src) {
		src = src.replace(/\.m4v|\.mp4|\.webm|\.ogv|\.3gp|\.mov/, "");

		if(this.flash) {
			return src+".mp4";
		}
		else if(this.video.canPlayType("video/mp4")) {
			return src+".mp4";
		}
		else if(this.video.canPlayType("video/ogg")) {
			return src+".ogv";
		}
		else if(this.video.canPlayType("video/3gpp")) {
			return src+".3gp";
		}
		else {
			return src+".mov";
		}

	}



	// player controls
	player.controls = u.ae(player, "div", "controls");

	// set up playback controls
	var playpause = u.ae(player.controls, "a", "playpause");

	playpause.player = player;

	player.controls.playpause = playpause;

	u.e.click(playpause);
	playpause.clicked = function(event) {
//		u.bug("play/pause")
		this.player.togglePlay();
	}

	// hide controls
	player.hideControls = function() {
		// reset timer to avoid double actions
		this.t_controls = u.t.resetTimer(this.t_controls);

		u.a.transition(this.controls, "all 0.3s ease-out");
		u.a.setOpacity(this.controls, 0);
	}
	// show controls
	player.showControls = function() {
		// reset timer to keep visible
		if(this.t_controls) {
			this.t_controls = u.t.resetTimer(this.t_controls);
		}
		// fade up
		else {
			u.a.transition(this.controls, "all 0.5s ease-out");
			u.a.setOpacity(this.controls, 1);
		}

		// auto hide after 1 sec of inactivity
		this.t_controls = u.t.setTimer(this, this.hideControls, 1500);
	}
	// enable controls on mousemove
	u.e.addEvent(player, "mousemove", player.showControls);



	return player;
}
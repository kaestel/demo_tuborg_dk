Util.Objects["ads"] = new function() {
	this.init = function(scene) {

		var i, node;

		// page reference
		scene.page = u.qs("#page");
		scene.page.cN.scene = scene;

		// inject mask
		scene.mask = u.ae(scene.page.cN, "div", "mask");
		scene.mask.appendChild(scene);
		scene.mask.page = scene.page;

		// content ready
		scene.ready = function() {
			if(!this.page.cN.className.match(/ready/)) {
				// show when ready
				u.ac(this.page.cN, "ready");
				this.page.cN.ready();
			}
		}

		// do what ever is needed 

		/*
		scene.fullScreen = function(index) {

			// remember scroll position
			this.page.scrolled_to = u.scrollY();

			// prepare for fullscreen
			u.ac(document.body, "fullscreen");

			// create fullscreen window
			this.page.fullscreen = u.ae(document.body, "div", ({"id":"fullscreen"}));
			this.page.fullscreen.page = this.page;

		}

		u.e.click(scene);
		scene.clicked = function(event) {
			this.fullScreen();
		}
		*/

		scene.video = u.qs(".video", scene);
		scene.video.scene = scene;

		scene.player = u.videoPlayer();
		scene.videos = u.qsa(".videos li", scene);


		// play handling
		scene.video.playVideo = function(node) {
			u.as(this, "backgroundImage", "none");

			this.scene.selected_video = node;
//			u.bug(this.scene + ":" + this.scene.player)
//			u.bug(typeof(this.scene.player.eject));

			this.scene.player.eject();
			// put player into place
			this.scene.player = this.scene.video.appendChild(this.scene.player);
			// load and play
			this.scene.player.loadAndPlay(Tuborg.ads_video_path + "/" + node.item_id + "/" + "video_960x540.mov");

			this.scene.setSelectedVideo();
		}

		// update list with selected class
		scene.setSelectedVideo = function() {
			var i, node;
			for(i = 0; node = this.videos[i]; i++) {
				u.rc(node, "selected");
			}
			u.ac(this.selected_video, "selected");
		}

		scene.video.bn_play = u.qs(".play", scene.video);
		scene.video.bn_play.scene = scene;
		u.e.click(scene.video.bn_play);
		scene.video.bn_play.clicked = function(event) {
			this.scene.video.playVideo(this.scene.selected_video);
		}

		for(i = 0; node = scene.videos[i]; i++) {
			node.scene = scene;
			node.i = i;
			node.item_id = u.getIJ(node, "id");
			node.preview_format = u.getIJ(node, "preview_format");

			// load background
			u.as(node, "backgroundImage", "url(" + Tuborg.ads_video_path + "/" + node.item_id + "/preview_frontend_thumbnail." + node.preview_format + ")")

			u.link(node);
			node.clicked = function(event) {
				this.scene.video.playVideo(this);
			}
			if(u.e.event_pref == "touch") {
				node.moved = function(event) {
//					u.e.kill(event);
					u.e.resetClickEvents(this);
				}
			}
		}


		// set selected
		scene.selected_video = u.qs(".videos li.selected", scene);
		if(!scene.selected_video) {
			scene.selected_video = scene.videos[0];
			scene.setSelectedVideo();
		}

		// primary video screen graphic
		scene.video.loaded = function(event) {
			u.as(this, "backgroundImage", "url(" + event.target.src + ")");
			this.scene.ready();
		}
		u.i.load(scene.video, Tuborg.ads_video_path + "/" + scene.selected_video.item_id + "/preview_frontend." + scene.selected_video.preview_format);


		// set keyboard shortcuts
		scene.keycuts = function(event) {
//			u.bug("event.keyCode:" + event.keyCode);

			// ESC
			if(event.keyCode == 27) {
				u.e.kill(event);
				u.qs("#fullscreen .zoom").clicked(event);
			}
			// prev
			if(event.keyCode == 37) {
				u.e.kill(event);
				u.qs("#fullscreen .prev").clicked(event);
			}
			// next
			if(event.keyCode == 39) {
				u.e.kill(event);
				u.qs("#fullscreen .next").clicked(event);
			}
		}

		scene.resized = function() {
			var player = u.qs("#fullscreen .player");
			if(player) {
				u.a.translate(player, (player.parentNode.offsetWidth - player.parentNode.player_width) / 2, (player.parentNode.offsetHeight - player.parentNode.player_height) / 2);
			}
		}

		// show ads in fullscreen mode
		scene.showAds = function(node) {

			// remember scroll position
			this.page.scrolled_to = u.scrollY();
			this.page.current_ad = node;
			this.page.scene = this;

			u.e.addEvent(window, "resize", this.resized);
			u.e.addEvent(document.body, "keyup", this.keycuts);

			this.page.transitioned = function(event) {
				this.transitioned = null;
				// remove transition before manipulation
				u.a.transition(this, "none");

				// hide page to remove scrollbars
				u.as(this, "display", "none");

				// setup fullscreen

				// remove video player to avoid playback from invisible player
				if(this.scene.player) {
					this.scene.player.eject();

					u.as(this.scene.video, "backgroundImage", "url(" + Tuborg.ads_video_path + "/" + this.scene.selected_video.item_id + "/preview_frontend." + this.scene.selected_video.preview_format + ")");
				}

				// prepare for fullscreen
				u.ac(document.body, "fullscreen");

				// create fullscreen window
				this.fullscreen = u.ae(document.body, "div", ({"id":"fullscreen"}));
				this.fullscreen.page = this;
				u.as(this.fullscreen, "display", "block");

				u.a.transition(this.fullscreen, "all 0.3s ease-in");
				u.a.setOpacity(this.fullscreen, 1);
 
				// inject zoom
				var zoom = u.ae(this.fullscreen, "a", ({"class":"zoom"}));
				zoom.fullscreen = this.fullscreen;
				u.e.click(zoom);
				zoom.clicked = function(event) {

					// finish fullscreen exit
					this.fullscreen.transitioned = function(event) {
						this.transitioned = null;
						u.a.transition(this, "none");

						this.parentNode.removeChild(this);

						// remove static video settings
						u.a.setWidth(this.page.scene.player, "100%");
						u.a.setHeight(this.page.scene.player, "100%");
						u.a.translate(this.page.scene.player, 0, 0);

						// display page to enable scrolling before fade up
						u.as(this.page, "display", "block");
						// if window is resized while in fullscreen mode - page needs resetting
						this.page.resized(event);

						// scroll to last position
						window.scrollTo(0, this.page.scrolled_to);

						// fade page up again
						u.a.transition(this.page, "all 0.3s ease-in");
						u.a.setOpacity(this.page, 1);
						u.rc(document.body, "fullscreen");
					}

					// remove shortcut handler
					u.e.removeEvent(document.body, "keyup", this.fullscreen.page.scene.keycuts);

					// remove resize updater
					u.e.removeEvent(window, "resize", this.fullscreen.page.scene.resized);

					// fade out fullscreen
					u.a.transition(this.fullscreen, "all 0.3s ease-in");
					u.a.setOpacity(this.fullscreen, 0);

				}

				if(this.scene && this.scene.ads && this.scene.ads.length > 1) {
					this.fullscreen.bn_prev = u.ae(this.fullscreen, "div", "prev");
					this.fullscreen.bn_prev.span = u.ae(this.fullscreen.bn_prev, "span");
					this.fullscreen.bn_prev.scene = this.scene;
					u.as(this.fullscreen.bn_prev, "left", -(u.absX(this) + this.fullscreen.bn_prev.span.offsetWidth)+"px");

					this.fullscreen.bn_next = u.ae(this.fullscreen, "div", "next");
					this.fullscreen.bn_next.span = u.ae(this.fullscreen.bn_next, "span");
					this.fullscreen.bn_next.scene = this.scene;
					u.as(this.fullscreen.bn_next, "right", -(u.absX(this) + this.fullscreen.bn_prev.span.offsetWidth)+"px");

					u.e.click(this.fullscreen.bn_prev);
					this.fullscreen.bn_prev.clicked = function(event) {
						u.e.kill(event);
						this.scene.showAd(this.scene.page.current_ad.i-1);
					}

					u.e.click(this.fullscreen.bn_next);
					this.fullscreen.bn_next.clicked = function(event) {
						u.e.kill(event);
						this.scene.showAd(this.scene.page.current_ad.i+1);
					}

					// reveal buttons
					this.fullscreen.bn_prev.transitioned = function(event) {
						this.transitioned = null;
						u.a.transition(this, "none");
					}
					u.a.transition(this.fullscreen.bn_prev, "all 0.2s linear");
					u.a.setOpacity(this.fullscreen.bn_prev, 1);

					this.fullscreen.bn_next.transitioned = function(event) {
						this.transitioned = null;
						u.a.transition(this, "none");
					}
					u.a.transition(this.fullscreen.bn_next, "all 0.2s linear");
					u.a.setOpacity(this.fullscreen.bn_next, 1);


					if(u.e.event_pref == "mouse") {

						this.fullscreen.prev_next_hide = function() {
							u.a.transition(this, "all 200ms ease-in");
							u.a.translate(this, 0, 0);
						}
						this.fullscreen.prev_next_out = function() {
							this.t_hide = u.t.setTimer(this, this.scene.page.fullscreen.prev_next_hide, 200);
						}
						this.fullscreen.prev_next_wait = function() {
							u.t.resetTimer(this.t_hide);
						}

						this.fullscreen.prev_show = function() {
							u.t.resetTimer(this.t_hide);
							u.a.transition(this, "all 200ms ease-in");
							u.a.translate(this, this.span.offsetWidth, 0);
						}
						this.fullscreen.next_show = function() {
							u.t.resetTimer(this.t_hide);
							u.a.transition(this, "all 200ms ease-in");
							u.a.translate(this, -this.span.offsetWidth, 0);
						}

						this.fullscreen.bn_prev.onmouseover = this.fullscreen.prev_show;
						this.fullscreen.bn_next.onmouseover = this.fullscreen.next_show;

						this.fullscreen.bn_next.span.onmouseover = this.fullscreen.prev_next_wait;
						this.fullscreen.bn_prev.span.onmouseover = this.fullscreen.prev_next_wait;

						this.fullscreen.bn_prev.onmouseout = this.fullscreen.prev_next_out;
						this.fullscreen.bn_next.onmouseout = this.fullscreen.prev_next_out;

					}

				}

				this.scene.showAd(this.current_ad.i);

//				this.fullscreen.setup();
			}
			u.a.transition(this.page, "all .3s ease-in");
			u.a.setOpacity(this.page, 0);

		}

		// show ad (in fullscreen mode)
		scene.showAd = function(index) {

			// already shown node
			var org_node = this.page.current_ad;

			// what is exit direction - always 1 (left) or -1 (right)
			this.direction = index - org_node.i;


			// correct index
			if(index < 0) {
				index = this.ads.length-1;
			}
			else if(index >= this.ads.length) {
				index = 0;
			}

			// set new selected node
			this.page.current_ad = this.ads[index];

			// ad do not already exist
			if(!this.page.fullscreen.ad) {
				this.page.fullscreen.ad = u.ae(this.page.fullscreen, "div", ({"class":"ad"}));
				this.page.fullscreen.ad.fullscreen = this.page.fullscreen;

				if(u.e.event_pref == "touch") {

					u.e.swipe(this.page.fullscreen.ad, [-(this.page.fullscreen.ad.offsetWidth), 0, this.page.fullscreen.ad.offsetWidth*2, this.page.fullscreen.ad.offsetHeight], true);
					this.page.fullscreen.ad.swipedLeft = function(event) {
						this.fullscreen.page.scene.showAd(this.fullscreen.page.current_ad.i+1);
					}
					this.page.fullscreen.ad.swipedRight = function(event) {
						this.fullscreen.page.scene.showAd(this.fullscreen.page.current_ad.i-1);
					}
				}
				
				this.page.fullscreen.ad.loaded = function(event) {
					this.player_height = event.target.height;
					this.player_width = event.target.width;
					u.as(this, "backgroundImage", "url(" + event.target.src + ")");
				}
				u.i.load(this.page.fullscreen.ad, this.page.current_ad.url);

				// play button
				if(u.hc(this.page.current_ad, "movie")) {
					this.page.fullscreen.ad.bn_play = u.ae(this.page.fullscreen.ad, "div", ({"class":"play"}));
					this.page.fullscreen.ad.bn_play.scene = scene;
					u.e.click(this.page.fullscreen.ad.bn_play);
					this.page.fullscreen.ad.bn_play.clicked = function(event) {
						this.scene.player = this.scene.page.fullscreen.ad.appendChild(this.scene.player);
						u.a.setWidth(this.scene.player, this.parentNode.player_width);
						u.a.setHeight(this.scene.player, this.parentNode.player_height);
						u.a.translate(this.scene.player, (this.parentNode.offsetWidth - this.parentNode.player_width) / 2, (this.parentNode.offsetHeight - this.parentNode.player_height) / 2);
						// load and play
						this.scene.player.loadAndPlay(this.scene.page.current_ad.url.replace(/_large|_medium|_small|/g, "").replace(/.jpg|.png|.gif/, ".mov"));
					}
				}
				else if(this.page.fullscreen.ad.bn_play && this.page.fullscreen.ad.bn_play.parentNode) {
					this.page.fullscreen.ad.bn_play.parentNode.removeChild(this.page.fullscreen.ad.bn_play);
				}

			}
			else {
				this.page.fullscreen.ad.transitioned = function(event) {

					if(this.fullscreen.page.scene.player) {
						this.fullscreen.page.scene.player.eject();
					}

					this.transitioned = null;
					u.a.transition(this, "none");
					u.a.translate(this, -(this.element_x), 0);
					
					this.loaded = function(event) {
						this.player_height = event.target.height;
						this.player_width = event.target.width;
						u.as(this, "backgroundImage", "url(" + event.target.src + ")");
					}
					u.i.load(this, this.fullscreen.page.current_ad.url);

					// play button
					if(u.hc(this.fullscreen.page.current_ad, "movie")) {
						this.bn_play = u.ae(this, "div", ({"class":"play"}));
						this.bn_play.scene = scene;
						u.e.click(this.bn_play);
						this.bn_play.clicked = function(event) {
							this.scene.player = this.scene.page.fullscreen.ad.appendChild(this.scene.player);
							u.a.setWidth(this.scene.player, this.parentNode.player_width);
							u.a.setHeight(this.scene.player, this.parentNode.player_height);
							u.a.translate(this.scene.player, (this.parentNode.offsetWidth - this.parentNode.player_width) / 2, (this.parentNode.offsetHeight - this.parentNode.player_height) / 2);
							// load and play
							this.scene.player.loadAndPlay(this.scene.page.current_ad.url.replace(/_large|_medium|_small|/g, "").replace(/.jpg|.png|.gif/, ".mov"));
						}

					}
					else if(this.bn_play && this.bn_play.parentNode) {
						this.bn_play.parentNode.removeChild(this.bn_play);
					}

					this.transitioned = function(event) {
						this.transitioned = null;
						u.a.transition(this, "none");
					}
					u.a.transition(this, "all 1s ease-in-out");
					u.a.translate(this, 0, 0);

				}

				if(this.page.fullscreen.ad.current_xps) {

					var duration = this.page.fullscreen.ad.current_xps ? ((960 / Math.abs(this.page.fullscreen.ad.current_xps)) * 0.6) : 0.6;
					// adjust duration to avoid too slow transition
					duration = duration > 0.6 ? 0.6 : duration;
					u.a.transition(this.page.fullscreen.ad, "all "+duration+"s ease-in");
				}
				// regular transition
				else {
					u.a.transition(this.page.fullscreen.ad, "all 600ms cubic-bezier(1, .03, .96, .78)");
				}

//				u.a.transition(this.page.fullscreen.ad, "all 1s ease-in-out");
				u.a.translate(this.page.fullscreen.ad, -(this.direction*this.page.fullscreen.offsetWidth), 0);
			}


			this.updateButtons(this.page.current_ad.i);
		}
		
		// update prev/next buttons
		scene.updateButtons = function(index) {
//			u.bug("updateButtons:" + index);

			var next = index+1 >= this.ads.length ? 0 : index+1;
			var prev = index-1 < 0 ? this.ads.length-1 : index-1;

			if(this.page.fullscreen.bn_prev) {
				this.page.fullscreen.bn_prev.span._node = this.ads[prev];
				this.page.fullscreen.bn_next.span._node = this.ads[next];

				this.page.fullscreen.bn_prev.span.transitioned = function(event) {
					this.transitioned = null;
					u.a.transition(this, "none");
					this.innerHTML = u.cutString(this._node.nodeTitle, 14);

					u.a.transition(this, "all 0.3s ease-in-out");
					u.a.translate(this, 0, 0);
				}
				u.a.transition(this.page.fullscreen.bn_prev.span, "all 0.3s ease-in-out");
				u.a.translate(this.page.fullscreen.bn_prev.span, -this.page.fullscreen.bn_prev.span.offsetWidth, 0);

				this.page.fullscreen.bn_next.span.transitioned = function(event) {
					this.transitioned = null;
					u.a.transition(this, "none");
					this.innerHTML = u.cutString(this._node.nodeTitle, 14);

					u.a.transition(this, "all 0.3s ease-in-out");
					u.a.translate(this, 0, 0);
				}
				u.a.transition(this.page.fullscreen.bn_next.span, "all 0.3s ease-in-out");
				u.a.translate(this.page.fullscreen.bn_next.span, this.page.fullscreen.bn_next.span.offsetWidth+10, 0);

			}

		}

		// setup ads
		scene.ads = u.qsa(".classics li", scene);
		for(i = 0; node = scene.ads[i]; i++) {
			node.i = i;
			node.scene = scene;
			node.nodeTitle = u.qs("a", node).innerHTML;

			u.link(node);
			if(u.browserH() < 735) {
				node.url = node.url.replace(/_large./, "_medium.");
			}
			node.clicked = function(event) {
				this.scene.showAds(this);
			}
			if(u.e.event_pref == "touch") {
				node.moved = function(event) {
//					u.e.kill(event);
					u.e.resetClickEvents(this);
				}
			}

		}


	}
}

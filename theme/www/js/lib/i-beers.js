Util.Objects["beers"] = new function() {
	this.init = function(scene) {

		var i, beer;

		// page reference
		scene.page = u.qs("#page");
		scene.page.cN.scene = scene;

		// inject mask
		scene.mask = u.ae(scene.page.cN, "div", "mask");
		scene.mask.appendChild(scene);
		scene.mask.page = scene.page;


		scene.beer = u.qs(".beer", scene);
		scene.beer.scene = scene;

		// content ready
		scene.ready = function() {

			// wait for beer ready
			if(this.beer.className.match(/ready/) && this.className.match(/ready/)) {

				// if content is already ready - wipe beer on
				if(this.page.cN.className.match(/ready/)) {
//					u.bug("wipe beer on");

					this.beer.transitioned = function() {
						this.transitioned = null;
						u.a.transition(this, "none");
						u.as(this, "overflow", "visible");
						// beer shown - go
						this.go();
					}

					u.a.transition(this.beer, "none");
					u.a.setOpacity(this.beer, 1);

					u.a.transition(this.beer, "all 500ms ease-in-out");
//					u.a.setWidth(this.beer, this.offsetWidth);
					u.a.translate(this.beer, 0, 0);
				}
				// if content is not declared ready
				else {

	 				// show when ready
					u.ac(this.page.cN, "ready");
					this.page.cN.ready();
				}
			}

		}

		scene.go = function() {
//			u.bug("scene go")

			// show beer navigation
			this.beer_navigation.clicked();

//			u.bug("this.beers.length:" + this.beers.length);

			// set prev/next
			if(this.beers.length > 0 && (!this.bn_prev || !this.bn_prev.parentNode)) {

				this.bn_prev = u.ae(this, "div", "prev");
				this.bn_prev.span = u.ae(this.bn_prev, "span");
				this.bn_prev.scene = this;
				u.as(this.bn_prev, "left", -(u.absX(this) + this.bn_prev.span.offsetWidth)+"px");

				this.bn_next = u.ae(this, "div", "next");
				this.bn_next.span = u.ae(this.bn_next, "span");
				this.bn_next.scene = this;
				u.as(this.bn_next, "right", -(u.absX(this) + this.bn_prev.span.offsetWidth)+"px");

				u.e.click(this.bn_prev);
				this.bn_prev.clicked = function(event) {
					u.e.kill(event);
					this.scene.selectBeer(this.scene.selected_node.i-1);
				}

				u.e.click(this.bn_next);
				this.bn_next.clicked = function(event) {
					u.e.kill(event);
					this.scene.selectBeer(this.scene.selected_node.i+1);
				}

				// reveal buttons
				this.bn_prev.transitioned = function(event) {
					this.transitioned = null;
					u.a.transition(this, "none");
				}
				u.a.transition(this.bn_prev, "all 0.2s linear");
				u.a.setOpacity(this.bn_prev, 1);

				this.bn_next.transitioned = function(event) {
					this.transitioned = null;
					u.a.transition(this, "none");
				}
				u.a.transition(this.bn_next, "all 0.2s linear");
				u.a.setOpacity(this.bn_next, 1);


				if(u.e.event_pref == "mouse") {

					this.prev_next_hide = function() {
						u.a.transition(this, "all 200ms ease-in");
						u.a.translate(this, 0, 0);
					}
					this.prev_next_out = function() {
						this.t_hide = u.t.setTimer(this, this.scene.prev_next_hide, 200);
					}
					this.prev_next_wait = function() {
						u.t.resetTimer(this.t_hide);
					}

					this.prev_show = function() {
						u.t.resetTimer(this.t_hide);
						u.a.transition(this, "all 200ms ease-in");
						u.a.translate(this, this.span.offsetWidth, 0);
					}
					this.next_show = function() {
						u.t.resetTimer(this.t_hide);
						u.a.transition(this, "all 200ms ease-in");
						u.a.translate(this, -this.span.offsetWidth, 0);
					}

					this.bn_prev.onmouseover = this.prev_show;
					this.bn_next.onmouseover = this.next_show;

					this.bn_next.span.onmouseover = this.prev_next_wait;
					this.bn_prev.span.onmouseover = this.prev_next_wait;

					this.bn_prev.onmouseout = this.prev_next_out;
					this.bn_next.onmouseout = this.prev_next_out;
				}

				// adding swipes for touch devices
				if(u.e.event_pref == "touch") {
					u.e.swipe(this.beer, [-(this.beer.offsetWidth), 0, this.beer.offsetWidth*2, this.beer.offsetHeight], true);
					this.beer.swipedLeft = function(event) {
						this.scene.selectBeer(this.scene.selected_node.i+1);
					}
					this.beer.swipedRight = function(event) {
						this.scene.selectBeer(this.scene.selected_node.i-1);
					}
				}


				this.updateButtons(this.selected_node.i);


				if(typeof(this.beer.go) == "function") {
					this.beer.go();
				}

			}

		}

		scene.resized = function() {
			u.a.transition(this.beer_navigation, "none");
//			u.as(this.beer_navigation, "left", -(this.offsetLeft)+"px");
			u.as(this.beer_navigation, "left", "0px");
			u.a.setWidth(this.beer_navigation, u.browserW());

			if(this.bn_prev && this.bn_prev.parentNode) {
				u.a.transition(this.bn_prev, "none");
				u.a.transition(this.bn_next, "none");
				u.as(this.bn_prev, "left", -(u.absX(this) + this.bn_prev.span.offsetWidth)+"px");
				u.as(this.bn_next, "right", -(u.absX(this) + this.bn_next.span.offsetWidth)+"px");
			}
		}


		scene.updateButtons = function(index) {
//			u.bug("updateButtons:" + index);

			var next = index+1 >= this.beers.length ? 0 : index+1;
			var prev = index-1 < 0 ? this.beers.length-1 : index-1;

			if(this.bn_prev) {
				this.bn_prev.span._node = this.beers[prev];
				this.bn_next.span._node = this.beers[next];

				this.bn_prev.span.transitioned = function(event) {
					this.transitioned = null;
					u.a.transition(this, "none");
					this.innerHTML = u.cutString(this._node.nodeTitle, 14);

					u.a.transition(this, "all 0.3s ease-in-out");
					u.a.translate(this, 0, 0);
				}
				u.a.transition(this.bn_prev.span, "all 0.3s ease-in-out");
				u.a.translate(this.bn_prev.span, -this.bn_prev.span.offsetWidth, 0);

				this.bn_next.span.transitioned = function(event) {
					this.transitioned = null;
					u.a.transition(this, "none");
					this.innerHTML = u.cutString(this._node.nodeTitle, 14);

					u.a.transition(this, "all 0.3s ease-in-out");
					u.a.translate(this, 0, 0);
				}
				u.a.transition(this.bn_next.span, "all 0.3s ease-in-out");
				u.a.translate(this.bn_next.span, this.bn_next.span.offsetWidth+10, 0);

			}

		}

		scene.selectBeer = function(index) {
//			u.bug("select beer:" + index);

			// already shown node
			var org_node = this.selected_node;

			// what is exit direction - always 1 (left) or -1 (right)
			this.direction = index - org_node.i < 0 ? 1 : -1;

//			u.bug("direction:" + this.direction);

			// correct index
			if(index < 0) {
				index = this.beers.length-1;
			}
			else if(index >= this.beers.length) {
				index = 0;
			}

			// set selected state in beers navigation
			var i, node;
			for(i = 0; node = this.beers[i]; i++) {
				u.rc(node, "selected");
			}
			
			location.hash = u.h.getCleanUrl(this.beers[index].url);
			this.selected_node = this.beers[index];
			u.ac(this.beers[index], "selected");

			// TODO: set prev/next labels
			this.updateButtons(this.selected_node.i);
		}

		// handle load-response when returned after load and fade back in
		scene.Response = function(response) {
//			u.bug("scene navigate response")

			// set body class
			var beer = u.qs("#content .beer", response);
			u.setClass(this.beer, beer.className);

			// replace content
			this.beer.innerHTML = beer.innerHTML;

			// set title
			document.title = response.head_title;

			// init content - will callback to cN.ready, when done
			u.init();
		}
	
		scene.loadContent = function() {
//			u.bug("scene.loadContent")

			// set current scene url
			this.current_scene_url = u.h.getCleanHash(location.hash, 2);

			// load content
			u.Request(this, u.h.getCleanHash(location.hash));
		}


		// scene subnavigation
		scene.navigate = function() {
//			u.bug("scene navigation:" + this.current_scene_url + ":" + u.h.getCleanHash(location.hash, 2))

			if(this.current_scene_url != u.h.getCleanHash(location.hash, 2)) {

				// beer is no longer ready
				u.rc(this.beer, "ready");

				// if element is already wiped out
				if(u.gcs(this.beer, "width") == 0) {
	//				u.bug("go directly to loadContent");
					this.loadContent();
				}
				// start wipe out transition
				else {
//					u.bug("wipe out")

					// capture transition event and load new content, when wipe out is done
					this.beer.transitioned = function(event) {
//						u.bug("beer wiped")
						this.transitioned = null;
						u.a.transition(this, "none");

						// hide content layer while preparing next node
						u.a.setOpacity(this, 0);
						// move beer to entering position
						u.a.translate(this, -(u.browserW()*this.scene.direction), 0);

						// request new content
						// does not finish transition properly unless I wait a little
						u.t.setTimer(this.scene, this.scene.loadContent, 100);
					}

					// prepare mask for exit transition
					u.a.transition(this.beer, "none");
					u.as(this.beer, "left", "auto");
					u.as(this.beer, "right", "0");
					u.as(this.beer, "overflow", "hidden");

					// wipe out
					// move node
					if(this.beer.current_xps) {

						var duration = this.beer.current_xps ? ((960 / Math.abs(this.beer.current_xps)) * 0.6) : 0.6;
						// adjust duration to avoid too slow transition
						duration = duration > 0.6 ? 0.6 : duration;
						u.a.transition(this.beer, "all "+duration+"s ease-in");
					}
					// regular transition
					else {
						u.a.transition(this.beer, "all 600ms cubic-bezier(1, .03, .96, .78)");
					}

//					u.a.transition(this.beer, "all 500ms ease-in-out");
//					u.a.setWidth(this.beer, 0);
					u.a.translate(this.beer, u.browserW()*this.direction, 0);
				}

			}

		}

		// do what ever is needed 

		// set up beer navigation
		scene.beer_navigation = u.qs(".beers", scene);
		scene.beer_navigation.scene = scene;


		scene.beer_navigation.ul = u.qs("ul", scene.beer_navigation);
		scene.beer_navigation.ul.scene = scene;

//		u.as(scene.beer_navigation, "left", -(scene.offsetLeft)+"px");
		u.as(scene.beer_navigation, "left", "0px");
		u.a.setWidth(scene.beer_navigation, u.browserW());


		u.as(scene.mask, "position", "absolute");
		u.as(scene.mask, "left", "auto");
		u.as(scene.mask, "right", "0");
		u.as(scene.mask, "overflow", "hidden");
		u.a.setWidth(scene.mask, 0);

		// touch-based
		if(u.e.event_pref == "touch") {
			u.e.click(scene.beer_navigation);


			// also used for initial opening of beer menu
			scene.beer_navigation.clicked = function(event) {
				var state = u.tc(this, "show");
				u.a.transition(this, "all 0.4s ease-in-out");
				if(state == "show") {
					u.a.setHeight(this, 128);
				}
				else {
					u.a.setHeight(this, 5);
				}
			}

			scene.beer_navigation.t_hide = u.t.setTimer(scene.beer_navigation, scene.beer_navigation.clicked, 4000);

		}
		else {

			// also used for initial opening of beer menu
			scene.beer_navigation.clicked = function(event) {
				var state = u.tc(this, "show");
				u.a.transition(this, "all 0.4s ease-in-out");
				if(state == "show") {
					u.a.setHeight(this, 128);
					this.t_hide = u.t.setTimer(this, this.clicked, 2000);
				}
				else {
					u.a.setHeight(this, 5);
				}
			}

		}

		// mouse-based
		if(u.e.event_pref == "mouse") {

			scene.beer_navigation.onmouseover = function(event) {
//				u.bug("over");
				u.t.resetTimer(this.t_hide);
				u.a.transition(this, "all 300ms ease-in");
				u.a.setHeight(this, 128);
			}

			scene.beer_navigation.hide = function() {
//				u.bug("hide")
				u.a.transition(this, "all 300ms ease-in-out");
				u.a.setHeight(this, 5);
			}
			scene.beer_navigation.onmouseout = function(event) {
				this.t_hide = u.t.setTimer(this, this.hide, 200);
			}
			// scene.beer_navigation.wait = function() {
			// 	u.bug("wait")
			// 	u.t.resetTimer(this.t_hide);
			// }

		}


		// set up individual beers
		scene.beers = u.qsa("li", scene.beer_navigation);
		for(i = 0; beer = scene.beers[i]; i++) {
			beer.scene = scene;
			beer.i = i;
			beer.nodeTitle = u.qs("a", beer).innerHTML;
			u.link(beer);
			beer.clicked = function(event) {
				u.e.kill(event);
				this.scene.selectBeer(this.i);
			}

			if(u.h.getCleanUrl(beer.url) == u.h.getCleanHash(location.hash, 2)) {
				scene.selected_node = beer
				u.ac(beer, "selected");
			}
		}

		if(!scene.selected_node) {
			scene.selected_node = scene.beers[0];
			u.ac(scene.beers[0], "selected");
		}

//		u.bug("preload images");

		scene.loaded = function(event) {
			this.loaded = function(event) {

				// call content ready class
				u.ac(this, "ready");
				this.ready();

			}
			u.i.load(scene, "/img/bg_beers_small.png");
		}
		u.i.load(scene, "/img/sponsorships/bg_sponsorships.png");

	}
}

Util.Objects["beer"] = new function() {
	this.init = function(beer) {
//		u.bug("init beer");

		var i, node;

		beer.ready = function() {

//			u.ac(this.scene, "ready");
			u.ac(this, "ready");
			this.scene.ready();

		}

		beer.go = function() {
//			u.bug("beer go")
		}

		beer.selected_node = false;
		beer.nodes = u.qsa("li.main,li.sponsorship", beer);

		beer.bottle = u.ae(beer, "div", "bottle");
		beer.bottle.beer = beer;
		beer.bottle_id = u.getIJ(beer, "bottle_id");
		beer.bottle_format = u.getIJ(beer, "bottle_format");


		// sponsorship bottle
		beer.sponsorship_bottle = u.ae(beer, "div", "sponsorship_bottle");
		beer.sponsorship_bottle.beer = beer;


		beer.sponsorships = u.ae(beer, "ul", "sponsorships");
		beer.sponsorships.nodes = u.qsa("li.sponsorship", beer);


		// if more nodes - setup prev/next links
		if(beer.sponsorships.nodes.length > 0) {

			for(i = 0; node = beer.sponsorships.nodes[i]; i++) {
				var sponsorship = u.ae(beer.sponsorships, "li");
				sponsorship.label_top = u.ae(sponsorship, "div", {"class":"top"});
				sponsorship.label_top.node = node;
				sponsorship.label_bottom = u.ae(sponsorship, "div", {"class":"bottom"});
				sponsorship.label_bottom.node = node;

				sponsorship.label_close = u.ae(sponsorship, "div", {"class":"close"});
				sponsorship.label_close.node = node;

				if(u.e.event_pref == "mouse") {

					sponsorship.onmouseover = function(event) {
						u.t.resetTimer(this.t_hide);

//						u.bug("mouseover")

						// flow controller to avoid over-events while last over-event is executing
						if(!this._over) {
							this._over = true;
							
	//						u.bug("top up");

							//var label_top = this.nodes[this.selected_node.i]._label.label_top;
							this.label_top.transitioned = function(event) {
								u.a.transition(this, "none");
	//							u.bug("top up 1");

								this.transitioned = function(event) {
									u.a.transition(this, "none");
	//								u.bug("top up 2");

									this.transitioned = function(event) {
										u.a.transition(this, "none");
	//									u.bug("top up 3");

										this.transitioned = function(event) {
											u.a.transition(this, "none");
	//										u.bug("top up 4");

											this.transitioned = function(event) {
	//											u.bug("top up 5");

												this.transitioned = null;
												u.a.transition(this, "none");
											}
											u.a.transition(this, "all 100ms ease-in-out");
											u.a.translate(this, 0, -15);
										}
										u.a.transition(this, "all 100ms ease-in-out");
										u.a.translate(this, 0, -14);
									}
									u.a.transition(this, "all 200ms ease-in-out");
									u.a.translate(this, 0, -17);
								}
								u.a.transition(this, "all 200ms ease-in-out");
								u.a.translate(this, 0, -13);
							}
							u.a.transition(this.label_top, "all 300ms ease-in-out");
							u.a.translate(this.label_top, 0, -18);

	//						var label_bottom = this.nodes[this.selected_node.i]._label.label_bottom;
							this.label_bottom.transitioned = function(event) {
								u.a.transition(this, "none");

								this.transitioned = function(event) {
									u.a.transition(this, "none");

									this.transitioned = function(event) {
										u.a.transition(this, "none");

										this.transitioned = function(event) {
											u.a.transition(this, "none");

											this.transitioned = function(event) {

												this.transitioned = null;
												u.a.transition(this, "none");
											}
											u.a.transition(this, "all 100ms ease-in-out");
											u.a.translate(this, 0, 5);
										}
										u.a.transition(this, "all 100ms ease-in-out");
										u.a.translate(this, 0, 4);
									}
									u.a.transition(this, "all 200ms ease-in-out");
									u.a.translate(this, 0, 7);
								}
								u.a.transition(this, "all 200ms ease-in-out");
								u.a.translate(this, 0, 3);
							}
							u.a.transition(this.label_bottom, "all 300ms ease-in-out");
							u.a.translate(this.label_bottom, 0, 8);


						}
					}

					// use timer to avoid mouseover/out chaos
					sponsorship.onmouseout = function(event) {
						this.t_hide = u.t.setTimer(this, this.hide, 100);
					}

					sponsorship.hide = function(event) {

						if(!u.hc(this, "selected")) {


							this.label_top.transitioned = function(event) {
//								u.bug("top down done");
								this.transitioned = null;
								u.a.transition(this, "none");

								this.parentNode._over = false;

								// this.transitioned = function(event) {
								// 	this.transitioned = function(event) {
								// 		this.transitioned = null;
								// 		u.a.transition(this, "none");
								// 	}
								// 	u.a.transition(this, "all 100ms ease-in-out");
								// 	u.a.translate(this, 0, 0);
								// }
								// u.a.transition(this, "all 100ms ease-in-out");
								// u.a.translate(this, 0, -2);
							}
							u.a.transition(this.label_top, "all 200ms ease-out");
//							u.a.transition(this.label_top, "all 200ms ease-in-out");
							u.a.translate(this.label_top, 0, 0);

							this.label_bottom.transitioned = function(event) {
								this.transitioned = null;
								u.a.transition(this, "none");

								// this.transitioned = function(event) {
								// 	this.transitioned = function(event) {
								// 		this.transitioned = null;
								// 		u.a.transition(this, "none");
								// 	}
								// 	u.a.transition(this, "all 100ms ease-in-out");
								// 	u.a.translate(this, 0, 0);
								// }
								// u.a.transition(this, "all 100ms ease-in-out");
								// u.a.translate(this, 0, 1);
							}
							u.a.transition(this.label_bottom, "all 200ms ease-out");
//							u.a.transition(this.label_bottom, "all 200ms ease-in-out");
							u.a.translate(this.label_bottom, 0, 0);
						}

					}
				}


				u.ac(sponsorship, node.className);
				sponsorship.i = i+1;
				sponsorship.beer = beer;
				node._label = sponsorship;
				u.e.click(sponsorship);
				sponsorship.clicked = function(event) {
					if(u.hc(this, "selected")) {
						this.beer.selectNode(0);
					}
					else {
						this.beer.selectNode(this.i);
					}
				}
			}
		}


		// load selected node
		beer.nodeLoad = function() {
//			u.bug("nodeLoad:" + this.selected_node);

			// load sponsorship
			if(this.selected_node.className.match(/sponsorship/)) {
//				u.bug("load sponsorship")

				this.selected_node.loaded = function(event) {
//					// set image
					u.as(this, "backgroundImage", "url("+event.target.src+")");

					u.ac(this, "ready");

					// enter node
					this.beer.nodeEnter();
				}
				u.i.load(this.selected_node, "/img/sponsorships/bg_" + this.selected_node.sponsorship + ".png");

			}
			// load beer
			else {
//				u.bug("load beer")

				// load image
				this.selected_node.loaded = function(event) {
//					// set image
					u.as(this.beer.bottle, "backgroundImage", "url("+event.target.src+")");

					u.ac(this, "ready");

					// enter node
					this.beer.nodeEnter();
				}
				u.i.load(this.selected_node, Tuborg.beers_image_path + "/" + this.bottle_id + "/bottle_frontend." + this.bottle_format);

			}

		}



		// CHANGE sponsorship transition


		// enter selected node
		beer.nodeEnter = function() {
//			u.bug("node enter:" + this.selected_node.i);

			// content is not ready - no transition
			if(!this.className.match("ready")) {
//			if(!this.scene.page.cN.className.match("ready")) {
//				u.bug("hard entrence");

				u.a.transition(this.selected_node, "none");
				u.a.setOpacity(this.selected_node, 0);
				u.as(this.selected_node, "display", "block");

//				u.a.transition(this.selected_node, "all 500ms cubic-bezier(.11, .68, .47, .96)");
				u.a.transition(this.selected_node, "all 500ms ease-in");
//				u.a.translate(this.selected_node, 0, 0);
				u.a.setOpacity(this.selected_node, 1);

//				u.ac(this, "ready");
				this.ready();
			}
			// content is ready - slide node in
			else {
//				u.bug("transition entrance")

				// reset node transition when done
				this.selected_node.transitioned = function(event) {


					this.transitioned = null;
					u.a.transition(this, "none");

//					u.ac(this, "ready");
					this.beer.ready();
				}


				// if selected_node is sponsorship - show sponsorship bottle label
				if(this.selected_node.i > 0) {

					// get sponsorship id from className
					var sponsorship_id = this.selected_node.className.replace(/sponsorship|ready|eid:[a-zA-Z0-9]+/g, "").trim();

					this.selected_node.beer.sponsorship_bottle.transitioned = function() {
						this.transitioned = null;
						u.a.transition(this, "none");

					}
					this.selected_node.beer.sponsorship_bottle.loaded = function(event) {
						u.as(this, "backgroundImage", "url("+event.target.src+")");

						u.a.transition(this, "all 0.3s ease-in");
						u.a.setOpacity(this, 1);
					}

					u.a.transition(this.selected_node.beer.sponsorship_bottle, "none");
					u.a.setOpacity(this.selected_node.beer.sponsorship_bottle, 0);

					// load sponsorship label
					u.i.load(this.selected_node.beer.sponsorship_bottle, "/img/sponsorships/bg_"+sponsorship_id+"_bottle.png");
				}

				u.a.transition(this.selected_node, "none");
				u.a.setOpacity(this.selected_node, 0);
				u.as(this.selected_node, "display", "block");

				// move node in
//				u.a.transition(this.selected_node, "all 500ms cubic-bezier(.11, .68, .47, .96)");
				u.a.transition(this.selected_node, "all 500ms ease-in");
//				u.a.translate(this.selected_node, 0, 0);
				u.a.setOpacity(this.selected_node, 1);
			}
		}

		// set selected image
		// optional param hidden can be set to avoid transition when updating list from fullscreen interaction
		beer.selectNode = function(index) {
//			u.bug("beer.selectNode:" + index + ":" + this.selected_node);

			// fade out sponsorship bottle
			if(this.sponsorship_bottle) {
				u.a.transition(this.sponsorship_bottle, "all 0.2s ease-in");
				u.a.setOpacity(this.sponsorship_bottle, 0);
			}
//			u.bug("remove sponsorship label:" + this.sponsorship_bottle)
	

			// if no selected_node - fresh start, prepare page for initial viewing
			if(!this.selected_node) {
//				u.bug("initial setup")

				// set selected node
				this.selected_node = this.nodes[index];
				this.selected_index = this.selected_node.i;

				this.selected_node.initialized = true;

				// position node for wipe on
				u.a.transition(this.selected_node, "none");
				u.a.translate(this.selected_node, 0, 0);
				u.a.setOpacity(this.selected_node, 1);

				// load node
				this.nodeLoad();

			}
			// we already have a node shown
			else {
//				u.bug("change node");
				var i, node;

				// scene needs to be prepared
				u.rc(this, "ready");

				// already shown node
				var org_node = this.selected_node;

				// what is exit direction - always 1 (left) or -1 (right)
				this.direction = index - org_node.i;
//				this.scene.beer.direction = this.scene.direction;


				// correct index
				if(index < 0) {
					index = this.nodes.length-1;
				}
				else if(index >= this.nodes.length) {
					index = 0;
				}


				// set new selected node
				this.selected_node = this.nodes[index];
				this.selected_index = this.selected_node.i;



				// exit org node
				org_node.transitioned = function(event) {
//					u.bug("ready to enter if node is loaded")

					this.transitioned = null;
					u.a.transition(this, "none");
					u.a.setOpacity(this, 0);
					u.as(this, "display", "none");

					u.a.transition(this.beer.selected_node, "none");
//					u.a.translate(this.beer.selected_node, u.browserW()*this.beer.direction, 0);
//					u.a.setOpacity(this.beer.selected_node, 1);
					u.a.setOpacity(this.beer.selected_node, 0);

					// scene is ready
					u.ac(this.beer, "ready");
					this.beer.nodeLoad();
				}

				// hide node
				u.a.transition(org_node, "all 600ms cubic-bezier(1, .03, .96, .78)");
//				u.a.translate(org_node, -(u.browserW()*this.direction), 0);
				u.a.setOpacity(org_node, 0);

			}

			// set bullets

			// fade-out currently selected
			for(i = 1; node = this.nodes[i]; i++) {
				if(node._label && u.hc(node._label, "selected")) {

					// hide close button
					u.a.transition(node._label.label_close, "all 0.3s ease-in");
					u.a.setOpacity(node._label.label_close, 0);

					u.rc(node._label, "selected");

					node._label.label_top.transitioned = function(event) {
						this.transitioned = null;
						u.a.transition(this, "none");

						this.parentNode._over = false;

						// this.transitioned = function(event) {
						// 	this.transitioned = function(event) {
						// 		this.transitioned = null;
						// 		u.a.transition(this, "none");
						// 	}
						// 	u.a.transition(this, "all 100ms ease-in-out");
						// 	u.a.translate(this, 0, 0);
						// }
						// u.a.transition(this, "all 100ms ease-in-out");
						// u.a.translate(this, 0, -2);
					}
					u.a.transition(node._label.label_top, "all 200ms ease-out");
					u.a.translate(node._label.label_top, 0, 0);

					node._label.label_bottom.transitioned = function(event) {
						this.transitioned = null;
						u.a.transition(this, "none");

						// this.transitioned = function(event) {
						// 	this.transitioned = function(event) {
						// 		this.transitioned = null;
						// 		u.a.transition(this, "none");
						// 	}
						// 	u.a.transition(this, "all 100ms ease-in-out");
						// 	u.a.translate(this, 0, 0);
						// }
						// u.a.transition(this, "all 100ms ease-in-out");
						// u.a.translate(this, 0, 1);
					}
					u.a.transition(node._label.label_bottom, "all 200ms ease-out");
					u.a.translate(node._label.label_bottom, 0, 0);
				}
			}
			if(this.selected_node.i > 0) {
				var label_top = this.nodes[this.selected_node.i]._label.label_top;

				this.parentNode._over = true;

				u.ac(label_top.node._label, "selected");

				label_top.transitioned = function(event) {
					u.a.transition(this, "none");

					this.transitioned = function(event) {
						u.a.transition(this, "none");

						this.transitioned = function(event) {
							u.a.transition(this, "none");

							this.transitioned = function(event) {
								u.a.transition(this, "none");

								this.transitioned = function(event) {

									this.transitioned = null;
									u.a.transition(this, "none");

									// show close button
									u.a.transition(this.node._label.label_close, "all 0.3s ease-in");
									u.a.setOpacity(this.node._label.label_close, 1);
								}
								u.a.transition(this, "all 100ms ease-in-out");
								u.a.translate(this, 0, -15);
							}
							u.a.transition(this, "all 100ms ease-in-out");
							u.a.translate(this, 0, -14);
						}
						u.a.transition(this, "all 200ms ease-in-out");
						u.a.translate(this, 0, -17);
					}
					u.a.transition(this, "all 200ms ease-in-out");
					u.a.translate(this, 0, -13);

				}
				u.a.transition(label_top, "all 300ms ease-in-out");
				u.a.translate(label_top, 0, -18);

				var label_bottom = this.nodes[this.selected_node.i]._label.label_bottom;
				label_bottom.transitioned = function(event) {
					u.a.transition(this, "none");

					this.transitioned = function(event) {
						u.a.transition(this, "none");

						this.transitioned = function(event) {
							u.a.transition(this, "none");

							this.transitioned = function(event) {
								u.a.transition(this, "none");

								this.transitioned = function(event) {

									this.transitioned = null;
									u.a.transition(this, "none");
								}
								u.a.transition(this, "all 100ms ease-in-out");
								u.a.translate(this, 0, 5);
							}
							u.a.transition(this, "all 100ms ease-in-out");
							u.a.translate(this, 0, 4);
						}
						u.a.transition(this, "all 200ms ease-in-out");
						u.a.translate(this, 0, 7);
					}
					u.a.transition(this, "all 200ms ease-in-out");
					u.a.translate(this, 0, 3);

//					u.ac(this.node._label, "selected");
				}
				u.a.transition(label_bottom, "all 300ms ease-in");
				u.a.translate(label_bottom, 0, 8);
			}


			// TODO: set prev/next labels


		}

		// loop through nodes for initial setup
		for(i = 0; node = beer.nodes[i]; i++) {
			node.beer = beer;
			node.i = i;
			node.item_id = u.getIJ(node, "id");

			// main slide
			if(node.className.match(/main/)) {
/*
				node._description = u.qs(".description", node);
				node._description_height = node._description.offsetHeight;
				u.a.setHeight(node._description, 0);
				u.a.transition(node._description, "all 0.3s ease-in");

				node._info = node.insertBefore(u.ae(node, "div", "info"), u.qs(".facebook", node));
				node._info.node = node;
				u.e.click(node._info);
				node._info.clicked = function(event) {
					if(this.node._description.className.match(/show/)) {
						u.rc(this.node._description, "show");
						u.a.setHeight(this.node._description, 0);
					}
					else {
						u.ac(this.node._description, "show");
						u.a.setHeight(this.node._description, this.node._description_height);
					}
				}
*/
			}
			// sponsorship slide
			else {
				node.sponsorship = node.className.replace(/\s|sponsorship/g, "");
			}

			u.a.setOpacity(node, 0);
			u.as(node, "display", "none");
//			u.a.translate(node, u.browserW(), 0);
		}

		/*
		// load bottle
		beer.bottle.loaded = function(event) {
			u.as(this, "backgroundImage", "url("+event.target.src+")");

		}
		u.i.load(beer.bottle, "/img/" + beer.bottle_id + "/temp_bottle.png");
		*/

		beer.selectNode(0);
	}
}
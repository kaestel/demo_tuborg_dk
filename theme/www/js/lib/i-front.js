Util.Objects["front"] = new function() {
	this.init = function(scene) {
//		u.bug("front init")

		// page reference
		scene.page = u.qs("#page");
		scene.page.cN.scene = scene;

		// inject mask
		scene.mask = u.ae(scene.page.cN, "div", "mask");
		scene.mask.appendChild(scene);
		scene.mask.page = scene.page;

		u.as(scene.mask, "position", "absolute");
		u.as(scene.mask, "left", "auto");
		u.as(scene.mask, "right", "0");
		u.as(scene.mask, "overflow", "hidden");
		u.a.setWidth(scene.mask, 0);

		var i, node;

		// list items ready
		scene.ready = function() {
//			u.bug("scene ready");

			// callback to main controller when ready - if main controller is waiting
			if(!this.page.cN.className.match(/ready/)) {
				u.ac(this.page.cN, "ready");
				this.page.cN.ready();
			}

//			u.bug("start auto rotate")
			if(this.stories.nodes.length > 1) {
				this.stories.t_rotate = u.t.setTimer(this.stories, this.stories.autoRotate, 5000);
			}
		}


		// scene is shown - do additional animations
		scene.go = function() {
//			u.bug("scene go")

			// set prev/next
			if(this.stories.nodes.length > 1) {
				scene.bn_prev = u.ae(scene, "div", "prev");
				scene.bn_prev.span = u.ae(scene.bn_prev, "span");
				scene.bn_prev.scene = scene;
				u.as(scene.bn_prev, "left", -(u.absX(scene) + scene.bn_prev.span.offsetWidth)+"px");
			
				scene.bn_next = u.ae(scene, "div", "next");
				scene.bn_next.span = u.ae(scene.bn_next, "span");
				scene.bn_next.scene = scene;
				u.as(scene.bn_next, "right", -(u.absX(scene) + scene.bn_prev.span.offsetWidth)+"px");
			
				u.e.click(scene.bn_prev);
				scene.bn_prev.clicked = function(event) {
					u.e.kill(event);
					this.scene.stories.selectNode(this.scene.stories.selected_index-1);
				}
				u.e.click(scene.bn_next);
				scene.bn_next.clicked = function(event) {
					u.e.kill(event);
					this.scene.stories.selectNode(this.scene.stories.selected_index+1);
				}
			
				// reveal buttons
				scene.bn_prev.transitioned = function(event) {
					this.transitioned = null;
					u.a.transition(this, "none");
				}
				u.a.transition(scene.bn_prev, "all 0.2s linear");
				u.a.setOpacity(scene.bn_prev, 1);
			
				scene.bn_next.transitioned = function(event) {
					this.transitioned = null;
					u.a.transition(this, "none");
				}
				u.a.transition(scene.bn_next, "all 0.2s linear");
				u.a.setOpacity(scene.bn_next, 1);
			
			
				if(u.e.event_pref == "mouse") {
			
					scene.prev_next_hide = function() {
						u.a.transition(this, "all 200ms ease-in");
						u.a.translate(this, 0, 0);
					}
					scene.prev_next_out = function() {
						this.t_hide = u.t.setTimer(this, this.scene.prev_next_hide, 200);
					}
					scene.prev_next_wait = function() {
						u.t.resetTimer(this.t_hide);
					}
			
					scene.prev_show = function() {
						u.t.resetTimer(this.t_hide);
						u.a.transition(this, "all 200ms ease-in");
						u.a.translate(this, this.span.offsetWidth, 0);
					}
					scene.next_show = function() {
						u.t.resetTimer(this.t_hide);
						u.a.transition(this, "all 200ms ease-in");
						u.a.translate(this, -this.span.offsetWidth, 0);
					}
			
					scene.bn_prev.onmouseover = scene.prev_show;
					scene.bn_next.onmouseover = scene.next_show;
			
					scene.bn_next.span.onmouseover = scene.prev_next_wait;
					scene.bn_prev.span.onmouseover = scene.prev_next_wait;
			
					scene.bn_prev.onmouseout = scene.prev_next_out;
					scene.bn_next.onmouseout = scene.prev_next_out;
				}
			
				this.stories.updateButtons(this.stories.selected_node.i);
			}


		}



		scene.resized = function() {
			if(this.bn_prev && this.bn_prev.parentNode) {
				u.a.transition(this.bn_prev, "none");
				u.a.transition(this.bn_next, "none");
				u.as(this.bn_prev, "left", -(u.absX(this) + this.bn_prev.span.offsetWidth)+"px");
				u.as(this.bn_next, "right", -(u.absX(this) + this.bn_next.span.offsetWidth)+"px");
			}
		}


		// do what ever is needed - content setup

		scene.beer = u.ae(scene, "div", "beer");
		scene.beer.scene = scene;

		scene.stories = u.qs(".stories", scene);
		scene.stories.nodes = u.qsa("li", scene.stories);
		scene.stories.scene = scene;


		// auto rotatation - selectNode calls back to ready, which sets new timer
		scene.stories.autoRotate = function() {
			if(this.parentNode) {
				this.selectNode(this.selected_index+1);
			}
		}

		// if more nodes - bullet navigation (prev/next is set on "go")
		if(scene.stories.nodes.length > 1) {

			scene.stories.bullets = u.ae(scene, "ul", "bullets");
			for(i = 0; node = scene.stories.nodes[i]; i++) {
				var bullet = u.ae(scene.stories.bullets, "li");
				bullet.i = i;
				bullet.scene = scene;
				u.e.click(bullet);
				bullet.clicked = function(event) {
					this.scene.stories.selectNode(this.i);
				}
			}

			if(u.e.event_pref == "touch") {

				// set swipes on beer
				u.e.swipe(scene.beer, [-(scene.offsetWidth), 0, scene.offsetWidth*2, scene.beer.offsetHeight], true);
				scene.beer.moved = function(event) {
					u.a.translate(this.scene.stories.selected_node, this.element_x/2, 0);
				}
				scene.beer.swipedLeft = function(event) {
					this.scene.stories.selectNode(this.scene.stories.selected_index+1);
				}
				scene.beer.swipedRight = function(event) {
					this.scene.stories.selectNode(this.scene.stories.selected_index-1);
				}

			}


		}

		scene.stories.updateButtons = function(index) {
			var next = index+1 >= this.nodes.length ? 0 : index+1;
			var prev = index-1 < 0 ? this.nodes.length-1 : index-1;
			
			if(this.scene.bn_prev) {
				this.scene.bn_prev.span._node = this.nodes[prev];
				this.scene.bn_next.span._node = this.nodes[next];
			
				this.scene.bn_prev.span.transitioned = function(event) {
					this.transitioned = null;
					u.a.transition(this, "none");
					this.innerHTML = u.cutString(this._node.nodeTitle, 14);
			
					u.a.transition(this, "all 0.3s ease-in-out");
					u.a.translate(this, 0, 0);
				}
				u.a.transition(this.scene.bn_prev.span, "all 0.3s ease-in-out");
				u.a.translate(this.scene.bn_prev.span, -this.scene.bn_prev.span.offsetWidth, 0);
			
				this.scene.bn_next.span.transitioned = function(event) {
					this.transitioned = null;
					u.a.transition(this, "none");
					this.innerHTML = u.cutString(this._node.nodeTitle, 14);
			
					u.a.transition(this, "all 0.3s ease-in-out");
					u.a.translate(this, 0, 0);
				}
				u.a.transition(this.scene.bn_next.span, "all 0.3s ease-in-out");
				u.a.translate(this.scene.bn_next.span, this.scene.bn_next.span.offsetWidth, 0);
			}
		}

		// load selected node
		scene.stories.nodeLoad = function() {
//			u.bug("nodeLoad:" + this.selected_node);

			// load image
			this.selected_node.loaded = function(event) {
//				// set image
				u.as(this.main, "backgroundImage", "url("+event.target.src+")");

				// load reflection
				this.loaded = function(event) {
					u.as(this.reflection, "backgroundImage", "url("+event.target.src+")");

					// load beer
					this.loaded = function(event) {
						u.as(this.scene.beer, "backgroundImage", "url("+event.target.src+")");


						// adding swipes for touch devices
						if(u.e.event_pref == "touch") {

							u.e.swipe(this, [-(this.offsetWidth), 0, this.offsetWidth*2, this.offsetHeight], true);
							this.moved = function(event) {
								u.a.translate(this.scene.beer, this.element_x/2, 0);
							}
							this.swipedLeft = function(event) {
								this.scene.stories.selectNode(this.scene.stories.selected_index+1);
							}
							this.swipedRight = function(event) {
								this.scene.stories.selectNode(this.scene.stories.selected_index-1);
							}

						}

						// node is ready
						u.ac(this, "ready");

						// enter node
						this.scene.stories.nodeEnter();
					}

					// bottle available?
					if(this.bottle_id) {
						u.i.load(this, Tuborg.beers_image_path + "/" + this.bottle_id + "/bottle_frontend." + this.bottle_format);
					}
					else {
						u.as(this.scene.beer, "backgroundImage", "none");
						// node is ready
						u.ac(this, "ready");

						// enter node
						this.scene.stories.nodeEnter();
					}
				}
				u.i.load(this, Tuborg.front_slides_image_path + "/" + this.slide_id + "/reflection_frontend." + this.reflection_format);
			}
			u.i.load(this.selected_node, Tuborg.front_slides_image_path + "/" + this.selected_node.slide_id + "/slide_frontend." + this.selected_node.slide_format);
		}

		// enter selected node
		scene.stories.nodeEnter = function() {
//			u.bug("node enter:" + this.selected_node.i);

			// content is not ready - no transition
			if(!this.scene.page.cN.className.match("ready")) {
//				u.bug("hard entrence");

				u.a.transition(this.selected_node, "all 500ms cubic-bezier(.11, .68, .47, .96)");
				u.a.translate(this.selected_node, 0, 0);
				// move beer in
				// .47, .47, .47, .96
				u.a.transition(this.scene.beer, "all 600ms cubic-bezier(.47,.47,.22,.79)");
				u.a.translate(this.scene.beer, 0, 0);

				u.ac(this.scene, "ready");
				this.scene.ready();
			}
			// content is ready - slide node in
			else if(this.selected_node.className.match("ready")) {
//				u.bug("transition entrance")

				// reset node transition when done
				this.selected_node.transitioned = function(event) {
					this.transitioned = null;
					u.a.transition(this, "none");
				}

				// beer jiggle
				this.scene.beer.transitioned = function(event) {
					this.transitioned = null;
					u.a.transition(this, "none");

					u.ac(this.scene, "ready");
					this.scene.ready();
				}

				// move node in
				u.a.transition(this.selected_node, "all 500ms cubic-bezier(.11, .68, .47, .96)");
				u.a.translate(this.selected_node, 0, 0);
				// move beer in
				u.a.transition(this.scene.beer, "all 600ms cubic-bezier(.47, .47, .47, .96)");
				u.a.translate(this.scene.beer, 0, 0);
			}
		}

		// set selected image
		// optional param hidden can be set to avoid transition when updating list from fullscreen interaction
		scene.stories.selectNode = function(index) {

			u.t.resetTimer(this.t_rotate);

			// if no selected_node - fresh start, prepare page for initial viewing
			if(!this.selected_node) {

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

				// scene needs to be prepared
				u.rc(this.scene, "ready");

				// already shown node
				var org_node = this.selected_node;

				// what is exit direction - always 1 (left) or -1 (right)
				this.scene.direction = index - org_node.i;

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

				// org node exited
				org_node.transitioned = function(event) {
//					u.bug("node exited")

					this.transitioned = null;
					u.a.transition(this, "none");
					u.a.setOpacity(this, 0);
				}

				// beer moved away - place to be ready for new entrence
				this.scene.beer.transitioned = function(event) {
//					u.bug("beer moved out")
					this.transitioned = null;
					u.a.transition(this, "none");
					u.a.translate(this, (u.browserW()*this.scene.direction), 0);

					// position new node for entrance
					u.a.transition(this.scene.stories.selected_node, "none");
					u.a.translate(this.scene.stories.selected_node, u.browserW()*this.scene.direction, 0);
					u.a.setOpacity(this.scene.stories.selected_node, 1);

					// start loading new node
					this.scene.stories.nodeLoad();
				}

				// move node
				if(org_node.current_xps) {

					var duration = org_node.current_xps ? ((960 / Math.abs(org_node.current_xps)) * 0.6) : 0.6;
					// adjust duration to avoid too slow transition
					duration = duration > 0.6 ? 0.6 : duration;
					u.a.transition(org_node, "all "+duration+"s ease-in");
				}
				// regular transition
				else {
					u.a.transition(org_node, "all 600ms cubic-bezier(1, .03, .96, .78)");
				}
				u.a.translate(org_node, -(u.browserW()*this.scene.direction), 0);


				// move beer
				if(this.scene.beer.current_xps) {

					var duration = this.scene.beer.current_xps ? ((960 / Math.abs(this.scene.beer.current_xps)) * 0.65) : 0.65;
					// adjust duration to avoid too slow transition
					duration = duration > 0.65 ? 0.65 : duration;
					u.a.transition(this.scene.beer, "all "+duration+"s ease-in");
				}
				// regular transition
				else {
					u.a.transition(this.scene.beer, "all 650ms cubic-bezier(1, .03, .96, .78)");
				}
				u.a.translate(this.scene.beer, -(u.browserW()*this.scene.direction), 0);

			}

			if(this.scene.stories.bullets) {
				// set bullets
				for(i = 0; node = this.scene.stories.bullets.childNodes[i]; i++) {
					u.rc(node, "selected");
				}
				u.ac(this.scene.stories.bullets.childNodes[this.selected_node.i], "selected");
			}


			// TODO: set prev/next labels
			this.updateButtons(this.selected_node.i);
		}


		// loop through nodes for initial setup
		for(i = 0; node = scene.stories.nodes[i]; i++) {
			node.scene = scene;
			node.i = i;
			node.nodeTitle = u.qs("a", node).innerHTML;

			// get image ids
			node.slide_id = u.getIJ(node, "slide_id");
			node.slide_format = u.getIJ(node, "slide_format");
			node.reflection_format = u.getIJ(node, "reflection_format");
			node.bottle_id = u.getIJ(node, "bottle_id");
			node.bottle_format = u.getIJ(node, "bottle_format");

			// additional place holders
			node.reflection = u.ae(node, "div", "reflection");
			node.main = u.qs("h3", node);

			// default hide all stories
			u.a.transition(node, "none");
			u.a.setOpacity(node, 0);
			u.a.translate(node, u.browserW(), 0);

			u.link(node.main);
			node.main.clicked = function(event) {
				if(u.h.getCleanUrl(this.url).match(/http:\/\//)) {

					// open in new window
					window.open(this.url, "_blank");
//					location.href = this.url;
				}
				else {
					location.hash = u.h.getCleanUrl(this.url);
				}
			}
			if(u.e.event_pref == "touch") {
				node.main.moved = function(event) {
//					u.e.kill(event);
					u.e.resetClickEvents(this);
				}
			}
		}

		// show selected node (selectNode calls back to ready)
		scene.stories.selectNode(0);


		// set up beer link
		var beers = u.qs(".beers", scene);
		u.link(beers);
		beers.clicked = function(event) {
			location.hash = u.h.getCleanUrl(this.url);
		}
	}
}

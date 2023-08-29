Util.Objects["stories"] = new function() {
	this.init = function(scene) {

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


		// content ready
		scene.ready = function() {
			// show when ready
			if(!this.page.cN.className.match(/ready/)) {

				u.ac(this.page.cN, "ready");
				this.page.cN.ready();
			}
		}

		// do what ever is needed 
		scene.go = function() {
			// set prev/next
			if(this.stories.nodes.length > 1) {
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
					this.scene.stories.selectNode(this.scene.stories.selected_index-1);
				}

				u.e.click(this.bn_next);
				this.bn_next.clicked = function(event) {
					u.e.kill(event);
					this.scene.stories.selectNode(this.scene.stories.selected_index+1);
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


		scene.stories = u.qs(".stories", scene);
		scene.stories.nodes = u.qsa("li", scene.stories);
		scene.stories.scene = scene;

		// if more nodes - setup prev/next links
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

		}

		scene.stories.updateButtons = function(index) {
//			u.bug("updateButtons:" + index);

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
				u.a.translate(this.scene.bn_next.span, this.scene.bn_next.span.offsetWidth+10, 0);

			}
			
		}

		// load selected node
		scene.stories.nodeLoad = function() {
//			u.bug("nodeLoad:" + this.selected_node + ":" + this.selected_node.initialized);

			if(!this.selected_node.initialized) {
				this.selected_node.initialized = true;

				this.selected_node.Response = function(response) {
	
					var scene = u.qs("#content .scene", response);
					this.innerHTML = scene.innerHTML;

					var story = u.qs(".story", this);
					this.item_id = u.getIJ(story, "id");
					this.image_format = u.getIJ(story, "image_format");

					// load bg
					this.loaded = function(event) {
						u.as(this, "backgroundImage", "url("+event.target.src+")");

						// adding swipes for touch devices
						if(u.e.event_pref == "touch") {

							u.e.swipe(this, [-(this.scene.stories.offsetWidth), 0, this.scene.stories.offsetWidth*2, this.scene.stories.offsetHeight], true);
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
					u.i.load(this, Tuborg.stories_image_path + "/" + this.item_id + "/story_frontend." + this.image_format);
				}
				u.Request(this.selected_node, this.selected_node.url);
			}
			else {
				this.nodeEnter();
			}

		}

		// enter selected node
		scene.stories.nodeEnter = function() {
//			u.bug("node enter:" + this.selected_node.i);

			// content is not ready - no transition
			if(!this.scene.page.cN.className.match("ready")) {
//				u.bug("hard entrence");

				u.a.transition(this.selected_node, "all 500ms cubic-bezier(.11, .68, .47, .96)");
				u.a.translate(this.selected_node, 0, 0);

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

					u.ac(this.scene, "ready");
					this.scene.ready();
				}

				// move node in
				u.a.transition(this.selected_node, "all 500ms cubic-bezier(.11, .68, .47, .96)");
				u.a.translate(this.selected_node, 0, 0);
			}
		}

		// set selected image
		// optional param hidden can be set to avoid transition when updating list from fullscreen interaction
		scene.stories.selectNode = function(index) {
//			u.bug("select node")

			// if no selected_node - fresh start, prepare page for initial viewing
			if(!this.selected_node) {
//				u.bug("initial setup")

				// set selected node
				this.selected_node = this.nodes[index];
				this.selected_index = this.selected_node.i;

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

					// position new node for entrance
					u.a.transition(this.scene.stories.selected_node, "none");
					u.a.translate(this.scene.stories.selected_node, u.browserW()*this.scene.direction, 0);
					u.a.setOpacity(this.scene.stories.selected_node, 1);

					// start loading new node
					this.scene.stories.nodeLoad();
				}

				// move node
				// if selection is based on drag, it can have speed - if so, adjust transition
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
			}

			// set bullets
			for(i = 0; node = this.scene.stories.bullets.childNodes[i]; i++) {
				u.rc(node, "selected");
			}
			u.ac(this.scene.stories.bullets.childNodes[this.selected_node.i], "selected");


			// TODO: set prev/next labels
			this.updateButtons(this.selected_node.i);

		}


		// loop through nodes for initial setup
		for(i = 0; node = scene.stories.nodes[i]; i++) {
			node.scene = scene;
			node.i = i;
			node.nodeTitle = u.qs("a", node).innerHTML;
//			u.bug("node.nodeTitle:" + node.nodeTitle);
			u.link(node);

			// default hide all stories
			u.a.transition(node, "none");
			u.a.setOpacity(node, 0);
			u.a.translate(node, u.browserW(), 0);

		}

		// show selected node (selectNode calls back to ready)
		scene.stories.selectNode(0);




		// call content ready class
		scene.ready();
	}
}

Util.Objects["story"] = new function() {
	this.init = function(scene) {

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


		var story = u.qs(".story", scene);
		scene.item_id = u.getIJ(story, "id");
		scene.image_format = u.getIJ(story, "image_format");

		// load bg
		scene.loaded = function(event) {
			u.as(this, "backgroundImage", "url("+event.target.src+")");
			// node is ready
			u.ac(this, "ready");

			// enter node
			this.ready();
		}
		u.i.load(scene, Tuborg.stories_image_path + "/" + scene.item_id + "/story_frontend." + scene.image_format);

		


		// call content ready class
//		scene.ready();
	}
}

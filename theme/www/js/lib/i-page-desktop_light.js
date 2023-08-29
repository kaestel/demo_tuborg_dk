Util.Objects["page"] = new function() {
	this.init = function(page, event) {

		if(!page.initialized && u.hc(page, "i:page")) {
//			u.bug("init page")

			var i, node, nav_node;


	// 		var errorSwitch = function() {
	// //			return false;
	// //			location.href = "/error";
	// 		}
	// 		window.onerror = errorSwitch;


			u.rc(page, "i:page");
			page.initialized = true;

			// first wipe on needs to be reversed direction
			page.first_run = true;


			// MAIN ELEMENTS
			// header element
			page.hN = u.qs("#header", page);
			page.hN.page = page;

			// content element
			page.cN = u.qs("#content", page);
			page.cN.page = page;
			// by default content is hidden
			u.a.setOpacity(page.cN, 0);

			// navigation element
			page.nN = u.qs("#navigation", page);
			if(page.nN) {
				// move navigation in front of content node in the DOM
				page.nN = page.insertBefore(page.nN, page.cN);
				page.nN.page = page;

				// set navigation links for HASH based navigation
				page.nN.nav_nodes = u.qsa("li", page.nN);
				for(i = 0; nav_node = page.nN.nav_nodes[i]; i++) {
					u.link(nav_node);
					// get url for use with existing js
//					nav_node.url = u.qs("a", nav_node).href;

					nav_node.clicked = function(event) {
						location.href = this.url;
						// if(u.h.getCleanUrl(this.url).match(/http:\/\//)) {
						// }
						// else {
						// 	location.hash = u.h.cleanHash(this.url);
						// }
					}
				}
			}

			// footer element
			page.fN = u.qs("#footer", page);
			page.fN.page = page;


			// page is ready, fade in
			page.ready = function() {
//				u.bug("page ready")

				// enable hash change navigation detection
				u.h.catchEvent(this.cN.navigate, this.cN);

				// update sizes on window resize
				u.e.addEvent(window, "resize", this.resized);

				// page is faded up, go to content entrance
				this.transitioned = function() {
					this.transitioned = null;
					u.a.transition(this, "none");

					// page is ready
					u.addClass(this, "ready");

					// in case content loads faster than page, call content ready controller (content ready does not execute until both content and page is ready)
					this.cN.ready();
				}

				// fade page up
				// if opacity should already be 1, go straight to next step (safety meassure)
				if(u.gcs(this, "opacity") == 1) {
	//				u.bug("quick transition");
					this.transitioned();
				}
				// start fade up transition
				else {
					u.a.transition(this, "all 1.5s ease-in");
					u.a.setOpacity(this, 1);
				}
			}

			// reposition elements on resize
			page.resized = function(event) {
				if(u.browserW() > 960) {
					var page = u.qs("#page");
					u.a.setWidth(page.cN.scene.mask, u.browserW());
					u.as(page.cN.scene, "marginRight", (u.browserW() - page.cN.scene.offsetWidth) / 2 + "px");
					u.as(page.cN.scene, "marginLeft", (u.browserW() - page.cN.scene.offsetWidth) / 2 + "px");
					if(typeof(page.cN.scene.resized) == "function") {
						page.cN.scene.resized();
					}
				}
			}

			// content state controller
			page.cN.ready = function() {
//				u.bug("content ready");

				// if all is good and ready to go - wait for page and content initialization to be finished
				if(this.page.className.match(/ready/) && this.className.match(/ready/) && this.scene) {
//					u.bug("fade content up");

					// set selected navigation item
					this.page.nN.setSelected();

					// wipe-in relies on temporary absolute posititioning, so all heights needs to be declared to maintain elements visible
					// #content height
					u.a.setHeight(this, this.scene.mask.offsetHeight);

					// .mask height and properties
					u.a.setHeight(this.scene.mask, this.scene.mask.offsetHeight);
					u.as(this.scene.mask, "position", "absolute");
					u.as(this.scene.mask, "left", "auto");
					u.as(this.scene.mask, "right", "0");
					u.as(this.scene.mask, "overflow", "hidden");
					u.a.setWidth(this.scene.mask, 0);

					// .scene height and properties
					u.a.setHeight(this.scene, this.scene.offsetHeight);
					u.as(this.scene, "position", "absolute");
					u.as(this.scene, "left", "auto");
					u.as(this.scene, "right", "0");
					u.as(this.scene, "marginRight", (u.browserW() - this.scene.offsetWidth) / 2 + "px");
					u.as(this.scene, "marginLeft", (u.browserW() - this.scene.offsetWidth) / 2 + "px");


					// wipe on needs to be reversed on first run
					if(this.page.first_run) {
						this.page.first_run = false;

						u.as(this.scene.mask, "left", "0");
						u.as(this.scene.mask, "right", "auto");

						u.as(this.scene, "left", "0");
						u.as(this.scene, "right", "auto");
					}

					// scene setup ready - make #content visible - ready to wipe maske off
					u.a.transition(this, "none");
					u.a.setOpacity(this, 1);

					// content has entered
					this.scene.mask.transitioned = function(event) {
//						u.bug("mask transitioned")
						this.transitioned = null;
						u.a.transition(this, "none");

						// allow overflow for scene
						u.as(this, "overflow", "visible");

						// callback to scene - maybe it needs to be built after slide-in
						if(typeof(this.page.cN.scene.go) == "function") {
							this.page.cN.scene.go();
						}
					}

					// transition mask width to show scene
					u.a.transition(this.scene.mask, "all 500ms cubic-bezier(.15,.03,.8,.14)");
					u.a.setWidth(this.scene.mask, u.browserW());
				}
			}

			page.nN.setSelected = function() {
//				u.bug("setSelected")
				var i, nav_node;
				for(i = 0; nav_node = page.nN.nav_nodes[i]; i++) {
					var hash = u.h.getCleanHash(location.hash, 1);
//					u.bug(nav_node.url)
					var url = u.h.getCleanUrl(nav_node.url, 1);
					if(hash == url) {
						u.ac(nav_node, "selected");
					}
					else {
						u.rc(nav_node, "selected");
					}
				}
			}

			// content loader - separeted into own function because it needs to be delayed for best performance
			page.cN.loadContent = function() {
//				u.bug("loadContent")
				// set current base url
				this.current_base_url = u.h.getCleanHash(location.hash, 1);
//				u.bug("navigate request")
				u.Request(this, u.h.getCleanHash(location.hash));
			}

			// navigation - uses HASH to identify selected node
			// navigates only 1st level of hashes - 2nd level is redirected to scene
			page.cN.navigate = function() {
//				u.bug("navigate")

				if(this.current_base_url != u.h.getCleanHash(location.hash, 1) || u.h.getCleanHash(location.hash, 1) == u.h.getCleanHash(location.hash)) {

					// central removal of prev/next buttons
					if(this.scene && this.scene.bn_prev && this.scene.bn_prev.parentNode) {
						this.scene.bn_prev.transitioned = function() {
							this.transitioned = null;
							u.a.transition(this, "none");
							this.parentNode.removeChild(this);
						}
						this.scene.bn_next.transitioned = function() {
							this.transitioned = null;
							u.a.transition(this, "none");
							this.parentNode.removeChild(this);
						}

						u.a.transition(this.scene.bn_prev, "all 0.2s linear");
						u.a.transition(this.scene.bn_next, "all 0.2s linear");
						u.a.setOpacity(this.scene.bn_prev, 0);
						u.a.setOpacity(this.scene.bn_next, 0);
					}


					// content is no longer ready
					u.rc(this, "ready");

					// handle load-response when returned after load and fade back in
					this.Response = function(response) {
		//				u.bug("navigate response")

						// set body class
						var content = u.qs("#content", response);
						u.setClass(this, content.className);

						// replace content
						this.innerHTML = content.innerHTML;

						// set title
						document.title = response.head_title;

						// init content - will callback to cN.ready, when done
						u.init(this);
					}



					// if element is already wiped out
					if(!this.scene || u.gcs(this.scene.mask, "width") == 0) {
		//				u.bug("go directly to loadContent");
						this.loadContent();
					}
					// start wipe out transition
					else {
		//				u.bug("wipe out")

						// capture transition event and load new content, when wipe out is done
						this.scene.mask.transitioned = function(event) {
							this.transitioned = null;
							u.a.transition(this, "none");

							// hide content layer while preparing next node
							u.a.setOpacity(this.page.cN, 0);

							// request new content
							// does not finish transition properly unless I wait a little
							u.t.setTimer(this.page.cN, this.page.cN.loadContent, 100);
						}

						// prepare mask for exit transition
						u.a.transition(this.scene.mask, "none");
						u.as(this.scene.mask, "left", "auto");
						u.as(this.scene.mask, "right", "0");
						u.as(this.scene.mask, "overflow", "hidden");

						u.a.transition(this.scene, "none");
						u.as(this.scene, "left", "auto");
						u.as(this.scene, "right", "0");

						// wipe out
	//					u.a.transition(this.scene.mask, "all 500ms cubic-bezier(.15,.03,.8,.14)");
						u.a.transition(this.scene.mask, "all 500ms ease-in-out");
						u.a.setWidth(this.scene.mask, 0);
					}

				}
				else {
					// forward navigation event to scene
					if(typeof(this.scene.navigate) == "function") {
						this.scene.navigate();
					}
				}

			}


			// start content/HASH initialization process - all required setup must be complete before this step

			// set default hash if no hash value is present
			// no furter navigation - initialize content
			if(location.hash.length < 2) {
				location.hash = u.h.getCleanUrl(location.href);
				u.init(page.cN);
			}
			// if different hash and url, load content based on hash
			else if(u.h.getCleanHash(location.hash) != u.h.getCleanUrl(location.href)) {
				page.cN.navigate();
			}
			// hash and url is aligned - init existing content
			else {
				u.init(page.cN);
			}

			// page ready needs to be delayed to avoid double hash
			u.t.setTimer(page, page.ready, 50);

			// call page ready
//			page.ready();
		}

	}
}




u.e.addEvent(window, "load", function(event) {u.o.page.init(u.qs("#page"), event);})

Util.Objects["about"] = new function() {
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

				// show when ready
			if(!this.page.cN.className.match(/ready/)) {
				u.ac(this.page.cN, "ready");
				this.page.cN.ready();
			}

		}

		// do what ever is needed 

		// preload heavy bgs
		scene.loaded = function(event) {
			this.loaded = function(event) {

				// call content ready class
				this.ready();

			}
			u.i.load(scene, "/img/bg_about_fondet.png");
		}
		u.i.load(scene, "/img/bg_about.png");

	}
}

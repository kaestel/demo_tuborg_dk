Util.Objects["content"] = new function() {
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
//			u.bug("inner content ready")
			// check sub elements
//			if(u.qsa(".ready", this).length != u.qsa("li", this).length || this.initiated) {
//				return;
//			}
			// all ready - go
//			else {
//				u.bug("content is ready")

				// show when ready
				u.ac(this.page.cN, "ready");
				this.page.cN.ready();

//				this.initiated = true;
//			}
		}

		// do what ever is needed 



		// call content ready class
		scene.ready();
	}
}

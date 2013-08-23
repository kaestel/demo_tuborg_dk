Util.Objects["tubklub"] = new function() {
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


		// initialize mailchimp form
		scene._form = u.qs("form", scene);
		scene._form.scene = scene;
		u.f.init(scene._form);

		scene._form.submitted = function() {
			
			this.Response = function(response) {

				var content = u.qs("#content", response);
				if(content) {
					u.qs(".signup", this.scene).innerHTML = content.innerHTML;
				}
				else {
					u.qs(".signup", this.scene).innerHTML = "<p>Unknown error</p>";
				}

			}
			u.Request(this, this.action, u.f.getParams(this), this.method);
		}


		// preload heavy bgs
		scene.loaded = function(event) {
			this.loaded = function(event) {

				// call content ready class
				this.ready();

			}
			u.i.load(scene, "/img/bg_tubklub_fb.png");
		}
		u.i.load(scene, "/img/bg_tubklub.png");

	}
}



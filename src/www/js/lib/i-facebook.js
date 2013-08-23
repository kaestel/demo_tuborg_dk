Util.Objects["facebook"] = new function() {
	this.init = function(scene) {

		// page reference
		scene.page = u.qs("#page");
		scene.page.cN.scene = scene;

		// inject mask
		scene.mask = u.ae(scene.page.cN, "div", "mask");
		scene.mask.appendChild(scene);
		scene.mask.page = scene.page;

		scene.go = function() {
			var i, facebook_page;
			this.pages = u.qsa(".pages li", this);
			for(i = 0; facebook_page = this.pages[i]; i++) {
				var url = u.qs("a", facebook_page).href;
				u.qs(".iframe", facebook_page).innerHTML += '<iframe src="//www.facebook.com/plugins/likebox.php?href=' + url + '&amp;width=292&amp;height=215&amp;colorscheme=light&amp;show_faces=true&amp;border_color&amp;header=true" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:292px; height:215px;" allowTransparency="true"></iframe>';
			}
		}

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

Util.Objects["agecheck"] = new function() {
	this.init = function(form) {

		u.f.init(form);

		form.submitted = function() {
			var now = new Date().getTime();

			if(
				(this.fields["yyyy"].value < new Date().getFullYear()-18)
			 	|| 
				(
					this.fields["yyyy"].value == new Date().getFullYear()-18 
					&& 
					this.fields["mm"].value < new Date().getMonth()+1
				)
				||
				(
					this.fields["yyyy"].value == new Date().getFullYear()-18 
					&& 
					this.fields["mm"].value == new Date().getMonth()+1
					&&
					this.fields["dd"].value <= new Date().getDate()
				)
			) {
				this.submit();

				u.rc(this, "error");
				u.rc(this, "underage");
			}
			else {
				u.rc(this, "error");
				u.ac(this, "underage");
			}
		}

		var dd = form.fields["dd"];
		var mm = form.fields["mm"];
		var yyyy = form.fields["yyyy"];


		dd.onfocus = function() {
			if(this.value == u.qs("label", this.field).innerHTML) {
				this.value = "";
			}
		}
		dd.onblur = function() {
			if(this.value == "") {
				this.value = u.qs("label", this.field).innerHTML;
			}
		}
		dd.onblur();

		form.fields["dd"].updated = function() {
			if(this.value > 0 && this.value <= 31) {
				u.f.fieldCorrect(this);
			}
			else {
				u.f.fieldError(this);
			}
		}

		mm.onfocus = function() {
			if(this.value == u.qs("label", this.field).innerHTML) {
				this.value = "";
			}
		}
		mm.onblur = function() {
			if(this.value == "") {
				this.value = u.qs("label", this.field).innerHTML;
			}
		}
		mm.onblur();

		form.fields["mm"].updated = function() {
			if(this.value > 0 && this.value <= 12) {
				u.f.fieldCorrect(this);
			}
			else {
				u.f.fieldError(this);
			}
		}

		yyyy.onfocus = function() {
			if(this.value == u.qs("label", this.field).innerHTML) {
				this.value = "";
			}
		}
		yyyy.onblur = function() {
			if(this.value == "") {
				this.value = u.qs("label", this.field).innerHTML;
			}
		}
		yyyy.onblur();

		form.fields["yyyy"].updated = function() {
			if(this.value > 0 && this.value <= new Date().getFullYear()) {
				u.f.fieldCorrect(this);
			}
			else {
				u.f.fieldError(this);
			}
		}

		form.validationFailed = function() {
			u.ac(this, "error");
		}
		form.updated = function() {
			u.rc(this, "underage");

			if(u.qs(".field.error")) {
				u.ac(this, "error");
			}
			else {
				u.rc(this, "error");
			}
		}

	}
}
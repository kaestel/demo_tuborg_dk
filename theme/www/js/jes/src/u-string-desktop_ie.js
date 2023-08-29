// no trim in IE8
//alert("test" + typeof(String.prototype.trim))

if(String.prototype.trim == undefined) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, "");
	};
}

// no textContent in IE8
if(Object.prototype.textContent == undefined && Object.defineProperty) {
	Object.defineProperty(Element.prototype, "textContent",
		{get: function() {
			return this.innerText;
			}
		}
	);
}

// IE 7
else if(Object.prototype.textContent == undefined) {
//	Object.prototype.__getter__ = function() {
//		return this.innerText;
//	}
}


// bad substr in IE8 and less
if(String.prototype.substr == undefined || "ABC".substr(-1,1) == "A") {
	String.prototype.substr = function(start_index, length) {
		
		// convert negative values
		start_index = start_index < 0 ? this.length + start_index : start_index;
		// still negative? (if negative value is larger that length)
		start_index = start_index < 0 ? 0 : start_index;
		// convert length to end index
		length = length ? start_index + length : this.length;

//		u.bug("IE subst:" + start_index + ":" + length)

		return this.substring(start_index, length);
	};
}


var ScribbleController = Controller.extend({
	init: function(element) {	
		this._super(element);
		var self = this;
		this.visible = true;
		this.scribbles = [];
		this.scribblePad = new ScribblePad(this.element.find("canvas")[0]);
		this.scribblePad.saveScribbleCallback = function() {
			self.saveScribble();
		}

		//events
		this.bindClickEvents({
			'.jsNewButton': self.newScribble,
			'.jsViewAllButton': self.viewAllScribbles,
			'.jsDeleteButton': self.deleteScribble,
			'.jsSaveButton': self.saveScribble,
			'.jsPrevButton': self.prevScribble,
			'.jsNextButton': self.nextScribble,
			'.jsCameraButton': self.takePhoto
		});
		this.deviceCheck();
		this.load();
	},
	deviceCheck: function() {
		if (!browser.isMobile || (PhoneGap.available && navigator.device.platform != "iPhone")) {
			x$(".jsCameraButton")[0].parentNode.style.display = "none";
		}
	},
	updatePagination: function() {
		x$('.jsCurrentIndex')[0].innerHTML = parseInt(this.currentIndex) + 1;
		x$('.jsTotal')[0].innerHTML = this.scribbles.length;

		if (this.currentIndex == 0) {
			x$(".jsPrevButton").setStyle("display", "none");
		} else {
			x$(".jsPrevButton").setStyle("display", "block");
		}
		if (this.scribbles.length == this.currentIndex + 1) {
			x$(".jsNextButton").setStyle("display", "none");
		} else {
			x$(".jsNextButton").setStyle("display", "block");
		}
		this.printStatus();
	},
	load: function() {
		var self = this;
		this.newScribble();
		Scribble.data.get(function(data) {
			self.scribbles = data;
			self.scribbles.push(self.currentScribble);
			self.currentIndex = self.scribbles.length - 1;
			self.updatePagination();
		});
	},
	printStatus: function() {
		debug.log("CurrentIndex: "+this.currentIndex);
		debug.log("Total Scribbles: "+this.scribbles.length);
	},
	prevScribble: function() { 
		this.loadScribbleByIndex(this.currentIndex - 1);
		this.printStatus();
	},
	nextScribble: function() {
		if (this.scribbles.length > this.currentIndex) {
			this.loadScribbleByIndex(this.currentIndex + 1);
		}
	
		this.printStatus();
	},
	loadScribbleByIndex: function(index) {
		this.show();
		if (this.currentIndex == index) {
			return;
		} else if (this.scribbles.length == 0 || index > this.scribbles.length - 1) {
			this.newScribble();
		} else {
			this.currentIndex = index;
			this.currentScribble = this.scribbles[this.currentIndex];
			this.scribblePad.loadScribble(this.currentScribble);
			this.updatePagination();
		}
	},
	newScribble: function() {
		this.show();
		this.currentScribble = new Scribble();
		this.scribbles.push(this.currentScribble);
		this.currentIndex = this.scribbles.length - 1;
		this.scribblePad.loadScribble(this.currentScribble);
		this.updatePagination();
	},
	saveScribble: function() {
		var self = this;
		debug.log("save data");
		Scribble.data.save(this.currentScribble, function(r) {
			self.currentScribble.id = r.key;
		});
		this.updateBadge();
	},
	deleteScribble: function() {
		var self = this;
		var del = function() {
			Scribble.data.remove(self.currentScribble);
			var index = self.currentIndex;
			self.currentIndex = -2;
			self.scribbles.splice(index, 1);
			self.updateBadge();
			if (index == self.scribbles.length) {
				index--;
			}
			self.loadScribbleByIndex(index);
		}
		if (PhoneGap.available) {
			var delegate = navigator.notification.alert("Are you sure you want to delete this Scribble?", "Delete","Cancel,OK") 
			delegate.onAlertDismissed = function(index, label) {
				if (index == 1) {
					del();
				}
			}
		} else {
			if (confirm("Are you sure you want to delete this Scribble?")) {
				del();
			}
		}
	},
	viewAllScribbles: function() {
		this.hide();
		new ViewAllController(x$("#ViewAll"), this.scribbles, this);
	},
	updateBadge: function() {
		if (PhoneGap.available) {
			var count = this.scribbles.length;
			plugins.badge.set(count);
		}
	},
	takePhoto: function() {
		var self = this;
		var onSuccess = function(imageData) {
			var data = "data:image/jpeg;base64," + imageData;
			self.currentScribble.photoData = data;
			self.scribblePad.loadScribble(self.currentScribble);
		}
		var onFail = function(message) {
			alert(message);
		}
		var source = (browser.isMobile && navigator.device.platform == "iPad")?0:1
		navigator.camera.getPicture(onSuccess, onFail, { quality: 10, sourceType: source });
	},
	hide: function() {
		this.visible = false;
		var w = this.element.getStyle("width");
		this._animate("-"+w);
	},
	show: function() {
		if (!this.visible)
			this._animate("0");	
	},
	_animate: function(width) {
		var self = this;
		var end = function( event ) { 
			console.log("end");
			self.element.removeClass("AnimateSheet");
			self.element[0].removeEventListener("webkitTransitionEnd", end, false);
		}
		this.element.addClass("AnimateSheet").setStyle("webkitTransform", "translate("+width+", 0)")[0].addEventListener( 'webkitTransitionEnd', end, false );
	}
});

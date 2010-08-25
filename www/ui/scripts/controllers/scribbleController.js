var ScribbleController = Controller.extend({
	init: function(element) {	
		var self = this;
		this.element = element;
		this.scribbles = [];
		this.saveTimeout;
		this.scribblePad = new ScribblePad(this.element.find("canvas")[0]);
		this.scribblePad.drawEndCallback = function() {
			self.saveScribble();
		}

		//events
		this.bindClickEvents({
			'.jsNewButton': function() { self.newScribble();},
			'.jsViewAllButton': function() { self.viewAllScribbles(); },
			'.jsDeleteButton': function() { self.deleteScribble(); },
			'.jsSaveButton': function() { self.saveScribble(); },
			'.jsPrevButton': function() { self.prevScribble(); },
			'.jsNextButton': function() { self.nextScribble(); },
			'.jsCameraButton': function() { self.takePhoto(); },
		});

		this.deviceCheck();
		this.load();
	},
	deviceCheck: function() {
		if (!navigator.device.platform == "iPhone") {
			$(".jsCameraButton").setStyle("display", "none");
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
	prevScribble: function() { 
		this.loadScribbleByIndex(this.currentIndex - 1);
	},
	nextScribble: function() {
		if (this.scribbles.length > this.currentIndex) {
			this.loadScribbleByIndex(this.currentIndex + 1);
		}
	
	},
	loadScribbleByIndex: function(index) {
		this.element.setStyle("display", "block");
		if (index > this.scribbles.length - 1) {
			this.newScribble();
		} else {
			this.currentIndex = index;
			this.currentScribble = this.scribbles[this.currentIndex];
			this.scribblePad.loadScribble(this.currentScribble);
			this.updatePagination();
		}
	},
	newScribble: function() {
		this.currentScribble = new Scribble();
		this.scribbles.push(this.currentScribble);
		this.currentIndex = this.scribbles.length - 1;
		this.scribblePad.loadScribble(this.currentScribble);
		this.updatePagination();
	},
	saveScribble: function() {
		var self = this;
		if (this.saveTimeout)
			clearTimeout(this.saveTimeout);
		this.saveTimeout = setTimeout(function() {
			Scribble.data.save(self.currentScribble, function(r) {
				self.currentScribble.id = r.key;
			});
			self.updateBadge();
		}, 1000);
	},
	deleteScribble: function() {
		Scribble.data.remove(this.currentScribble);
		this.scribbles.remove(this.currentIndex);
		this.updateBadge();
		this.loadScribbleByIndex(this.currentIndex);
	},
	viewAllScribbles: function() {
		this.element.setStyle("display", "none");
		new ViewAllController(x$("#ViewAll"), this);
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
		navigator.camera.getPicture(onSuccess, onFail, { quality: 10, sourceType: 1 });
	}
});

var ScribbleController = Controller.extend({
	init: function(element) {	
		var self = this;
		this.element = element;
		this.scribbles = [];
		this.scribblePad = new ScribblePad(this.element.find("canvas")[0]);
		this.scribblePad.saveScribbleCallback = function() {
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
		if (navigator.device.platform != "iPhone") {
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
		debug.log("next");
		if (this.scribbles.length > this.currentIndex) {
			this.loadScribbleByIndex(this.currentIndex + 1);
		}
	
		this.printStatus();
	},
	loadScribbleByIndex: function(index) {
		this.element.setStyle("display", "block");
		if (this.currentIndex == index) {
			return;
		} else if (index > this.scribbles.length - 1) {
			this.newScribble();
		} else {
			this.currentIndex = index;
			this.currentScribble = this.scribbles[this.currentIndex];
			this.scribblePad.loadScribble(this.currentScribble);
			this.updatePagination();
		}
	},
	newScribble: function() {
		this.element.setStyle("display", "block");
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
		Scribble.data.remove(this.currentScribble);
		this.scribbles.remove(this.currentIndex);
		this.updateBadge();
		this.loadScribbleByIndex(this.currentIndex);
	},
	viewAllScribbles: function() {
		this.element.setStyle("display", "none");
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
		var source = (navigator.device.platform == "iPad")?0:1
		navigator.camera.getPicture(onSuccess, onFail, { quality: 10, sourceType: source });
	}
});

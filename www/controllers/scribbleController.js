var ScribbleController = ui.Controller.extend({
	init: function(element) {	
		this._super(element);
		var self = this;
		this.currentIndex = 0;
		this.scribbles = [];
		this.loadedScribble = null;
		var container = this.view.find("#draw");
		this.scribblePad = new ScribbleView(container);
		this.scribblePad.bind("drawEnd", function() {
			if (!self.loadedScribble) {
				self.loadedScribble = new Scribble();
			}
			self.loadedScribble.path = this.strokes;
			self.loadedScribble.photoData = this.photo;
			self.loadedScribble.imageData = this.strokeImage;
			self.saveScribble(self.loadedScribble);
		});
		this._buttonFadeTimeout = null;
        /*
		this.scribblePad.bind({
			"saveScribble": function(scribble) {
				self.saveScribble(scribble);
			},
			"drawStart2": function() {
				if (self._buttonFadeTimeout) {
					clearTimeout(self._buttonFadeTimeout);
                }
				self.view.find(".Button").style.opaicty = 0;
			},
			"drawEnd2": function() {
                
			}
		});
		*/
		this.deviceCheck();
		this.load();
	},
	deviceCheck: function() {
		if (!ui.browser.isMobile || (PhoneGap.available && navigator.device.platform != "iPhone")) {
			this.view.find(".jsCameraButton").style.display = "none";
		}
	},
	updatePagination: function() {
		var index = this.currentIndex;
		var count = (this.loadedScribble)?this.scribbles.length:this.scribbles.length+1;
		if (index === 0) {
            this.view.find(".jsPrevButton").style.display = "none";
		} else {
            this.view.find(".jsPrevButton").style.display = "block";
		}
		if (count == index + 1) {
            this.view.find(".jsNextButton").style.display = "none";
		} else {
            this.view.find(".jsNextButton").style.display = "block";
		}

		this.view.find('.jsCurrentIndex').innerHTML = "<span>"+(parseInt(index, 10) + 1)+"</span>";
		this.view.find('.jsTotal').innerHTML = "<span>"+count+"</span>";
		this.printStatus();
		this.updateNewButton();
	},
	updateNewButton: function() {
		if (this.loadedScribble) {
			this.view.find(".jsNewButton").style.visibility = "visible";
		} else {
			this.view.find(".jsNewButton").style.visibility = "hidden";
		}
	},
	load: function() {
		var self = this;
		this.newScribble();
		Scribble.data.find(function(data) {
			console.log(data);
			self.scribbles = data;
			/*self.scribbles.push(self.currentScribble);*/
			self.currentIndex = self.scribbles.length;
			setTimeout(function() {
				self.updatePagination();
			}, 200);
			self.updateBadge();
		});
	},
	printStatus: function() {
		console.log("CurrentIndex: "+this.currentIndex);
		console.log("Total Scribbles: "+this.scribbles.length);
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
			var s = this.scribbles[this.currentIndex];
			this.loadedScribble = s;
			this.scribblePad.load(s.path, null, s.imageData, s.photoData);
			this.updatePagination();
		}
	},
	newScribble: function() {
		this.show();
		this.scribblePad.clear();
		if (this.loadedScribble || this.scribblePad.isDirty) {
			console.log("create");
			this.currentIndex = this.scribbles.length;
			this.loadedScribble = null;
			this.updatePagination();
		}
	},
	saveScribble: function(scribble) {
		var self = this;
		console.log("save data");
		console.log(scribble.key);
		console.log("scribble loaded: "+this.loadedScribble);
		if (!scribble.key) {
			this.scribbles.push(scribble);
		}
		Scribble.data.save(scribble, function(r) {
			scribble.key = r.key;
			self.updateNewButton();
		});

		this.updateBadge();
	},
	deleteScribble: function() {
		var self = this;
		var del = function() {
			var index = self.currentIndex;
			self.currentIndex = -2;
			self.scribbles.splice(index, 1);
			self.updateBadge();

			if (self.loadedScribble) {
				Scribble.data.remove(self.loadedScribble);
			}
			if (index == self.scribbles.length) {
				index--;
			}
			self.loadScribbleByIndex(index);
		};
		if (ui.browser.isPhoneGap) {
			var delegate = navigator.notification.alert("Are you sure you want to delete this Scribble?", "Delete","Cancel,OK");
			delegate.onAlertDismissed = function(index, label) {
				if (index == 1) {
					del();
				}
			};
		} else {
			if (confirm("Are you sure you want to delete this Scribble?")) {
				del();
			}
		}
	},
	viewAllScribbles: function() {
		new ViewAllController("ViewAll", this.scribbles, this);
	},
	updateBadge: function() {
		var self = this;
		console.log("Badge: "+self.scribbles.length);
		if (ui.browser.isPhoneGap) {
			plugins.preferences.boolForKey("show_badge", function(key, value) {
				console.log("update badge: "+value);
				if (value) {
					var count = self.scribbles.length;
					/*if (!self.scribbles[count-1].isDirty) {*/
					/*}*/
					plugins.badge.set(count);
				} else {
					plugins.badge.set('');
				}
			});
		}
	},
	takePhoto: function() {
		var self = this;
		var onSuccess = function(imageData) {
			var data = "data:image/jpeg;base64," + imageData;
			self.currentScribble.photoData = data;
			self.scribblePad.loadScribble(self.currentScribble);
		};
		var onFail = function(message) {
			alert(message);
		};
		var source = (browser.isMobile && navigator.device.platform == "iPad")?0:1
		navigator.camera.getPicture(onSuccess, onFail, { quality: 10, sourceType: source });
	}
	/*hide: function() {*/
	/*this.visible = false;*/
	/*var h = this.element.getStyle("height");*/
	/*this._animate("-"+h);*/
/*},*/
/*show: function() {*/
/*if (!this.visible)*/
/*this._animate("0");	*/
	/*},*/
	/*_animate: function(height) {*/
	/*this.element.setStyle("webkitTransform", "translate(0, "+height+")");*/
	/*this.animateWithClass("AnimateSheet");*/
	/*}*/
});

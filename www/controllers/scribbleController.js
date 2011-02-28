var ScribbleController = ui.Controller.extend({
	init: function(element) {	
		this._super(element);
		var self = this;
		this.currentIndex = 0;
		this.scribbles = [];
		//this.scribblePad = new ScribblePad(this.view.find("canvas"));
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
                
				self._buttonFadeTimeout = setTimeout(function() {
                    self.view.find(".Button").style.opaicty = 0.6;
				}, 1500);
			}
		});
        */
		//events
        /*
		this.bindClickEvents({
			'.jsNewButton': self.newScribble,
			'.jsViewAllButton': self.viewAllScribbles,
			'.jsDeleteButton': self.deleteScribble,
			'.jsSaveButton': self.saveScribble,
			'.jsPrevButton': self.prevScribble,
			'.jsNextButton': self.nextScribble,
			'.jsCameraButton': self.takePhoto
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
        return; //TODO: remove
		var index = this.currentIndex;
		console.log(this.scribblePad.scribble);
		var count = (this.scribblePad.scribble.key)?this.scribbles.length:this.scribbles.length+1;
		debug.log("update pag");
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
		if (this.scribblePad.scribble.key) {
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
			this.scribblePad.loadScribble(this.scribbles[this.currentIndex]);
			this.updatePagination();
		}
	},
	newScribble: function() {
		this.show();
        return;
        //TODO add back in
		if (!this.scribblePad.scribble || this.scribblePad.scribbledLoaded || this.scribblePad.isDirty) {
			debug.log("create");
			this.currentIndex = this.scribbles.length;
			this.scribblePad.clear();
			this.updatePagination();
		}
	},
	saveScribble: function(scribble) {
		var self = this;
		debug.log("save data");
		debug.log(scribble.key);
		debug.log("scribble loaded: "+this.scribblePad.scribbleLoaded);
		if (!scribble.key)
			this.scribbles.push(scribble);
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

			if (self.scribblePad.scribble.key) {
				Scribble.data.remove(self.scribblePad.scribble);
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
				debug.log("update badge: "+value);
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

var ScribbleController = Class.extend({
	init: function(element) {	
		var self = this;
		this.element = element;
		this.saveTimeout;
		this.currentIndex = scribbleData.get().length;
		this.scribblePad = new ScribblePad(this.element.find("canvas")[0]);
		this.scribblePad.drawEndCallback = function() {
			self.saveScribble();
		}

		x$(".jsNewButton").on("click", function() {	self.newScribble();	});

		x$(".jsViewAllButton").on("click", function() {
			self.viewAllScribbles();
		});

		x$(".jsDeleteButton").on("click", function() { self.deleteScribble(); });
	
		x$(".jsSaveButton").on("click", function() {
			self.saveScribble();
		});
	},
	loadScribbleByIndex: function(index) {
		this.element.setStyle("display", "block");
		this.currentIndex = index;
		this.scribblePad.load(scribbleData.get()[index]);
	},
	newScribble: function() {
		this.scribblePad.clear();
		this.currentIndex = scribbleData.get().length;
	},
	saveScribble: function() {
		var self = this;
		if (this.saveTimeout)
			clearTimeout(this.saveTimeout);
		this.saveTimeout = setTimeout(function() {
			console.log("save");
			var data = self.scribblePad.getData();
			scribbleData.updateItem(self.currentIndex, data);
			self.updateBadge();
		}, 1000);
	},
	deleteScribble: function() {
		console.log(this.currentIndex);
		scribbleData.deleteItemByIndex(this.currentIndex);
		this.loadScribbleByIndex(this.currentIndex);
		this.updateBadge();
	},
	viewAllScribbles: function() {
		this.element.setStyle("display", "none");
		new ViewAllController(x$("#ViewAll"), this);
	},
	updateBadge: function() {
		if (PhoneGap.available) {
			var count = scribbleData.get().length;
			plugins.badge.set(count);
		}
	}
});

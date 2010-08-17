var ScribbleController = Class.extend({
	init: function(element) {	
		var self = this;
		this.element = element;
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
		console.log("save");
		var data = this.scribblePad.getData();
		scribbleData.updateItem(this.currentIndex, data);
	},
	deleteScribble: function() {
		console.log(this.currentIndex);
		scribbleData.deleteItemByIndex(this.currentIndex);
		this.loadScribbleByIndex(this.currentIndex);
	},
	viewAllScribbles: function() {
		this.element.setStyle("display", "none");
		new ViewAllController(x$("#ViewAll"), this);
	}
});

var ViewAllController = Controller.extend({
	init: function(element, scribbles, parentController) {
		var self = this;
		this.element = element
		this.parentController = parentController;
		this.scribbles = scribbles;
		this._render();
		this.element.find("img").on("click", function() {
			var id = this.id.split("_")[1];
			self.element.setStyle("display", "none");
			controller.loadScribbleByIndex(parseInt(id));
		});
		this.bindClickEvents({
		/*"img": function() { self.loadScribble.call(this) },*/
			".jsNewButton2": function() { self.newScribble(); }
		});
	},
	_render: function() {
		var htmlArr = [];
		for (var i = 0; i < this.scribbles.length; i++) {
			htmlArr.push("<li><img id='ViewImage_"+i+"' src='"+this.scribbles[i].imageData+"'/></li>");
		}
		this.element.find("ul.ImageList").html(htmlArr.join(""));	
		this.element.setStyle("display", "block");
	},
	loadScribble: function() {
		debug.log(this);
		var id = this.id.split("_")[1];
		this.element.setStyle("display", "none");
		this.parentController.loadScribbleByIndex(parseInt(id));
	},
	newScribble: function() {
		this.element.setStyle("display", "none");
		this.parentController.newScribble();
	}
});

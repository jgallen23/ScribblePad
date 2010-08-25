var ViewAllController = Class.extend({
	init: function(element, controller) {
		var self = this;
		this.element = element
		this.controller = controller;
		Scribble.data.get(function(data) {
			self.scribbles = data;
			self._render();
			self.element.find("img").on("click", function() {
				var id = this.id.split("_")[1];
				self.element.setStyle("display", "none");
				controller.loadScribbleByIndex(id);
			});
		});
	},
	_render: function() {
		var htmlArr = [];
		for (var i = 0; i < this.scribbles.length; i++) {
			htmlArr.push("<li><img id='ViewImage_"+i+"' src='"+this.scribbles[i].imageData+"'/></li>");
		}
		this.element.find("ul.ImageList").html(htmlArr.join(""));	
		this.element.setStyle("display", "block");
	}
});

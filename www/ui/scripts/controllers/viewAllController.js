var ViewAllController = Class.extend({
	init: function(element, controller) {
		var self = this;
		this.element = element
		this.controller = controller;
		this._render();
		this.element.find("img").on("click", function() {
			var id = this.id.split("_")[1];
			self.element.setStyle("display", "none");
			controller.loadScribbleByIndex(id);
		});
	},
	_render: function() {
		var scribbles = scribbleData.get();
		var htmlArr = [];
		for (var i = 0; i < scribbles.length; i++) {
			htmlArr.push("<li><img id='ViewImage_"+i+"' src='"+scribbles[i]+"'/></li>");
		}
		this.element.find("ul").setStyle("display", "block").html(htmlArr.join(""));	
		this.element.setStyle("display", "block");
	}
});

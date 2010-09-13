var ViewAllController = Controller.extend({
	init: function(element, scribbles, parentController) {
		var self = this;
		this.element = element
		this.parentController = parentController;
		this.scribbles = scribbles;
		this._render();
		this.element.find("img").on("click", function() {
			var id = this.id.split("_")[1];
			self.hide()
			self.parentController.loadScribbleByIndex(parseInt(id));
		});
		this.bindClickEvents({
		/*"img": function() { self.loadScribble.call(this) },*/
			".jsNewButton2": function() { self.newScribble(); }
		});
	},
	_render: function() {
		var htmlArr = [];
		for (var i = 0; i < this.scribbles.length; i++) {
            if (this.scribbles[i].imageData) {
                htmlArr.push("<li><img id='ViewImage_"+i+"' src='"+this.scribbles[i].imageData+"'/></li>");
            }
		}
		this.element.find("ul.ImageList").html(htmlArr.join(""));	
		this.show();
	},
	loadScribble: function() {
		debug.log(this);
		var id = this.id.split("_")[1];
		this.hide();
		this.parentController.loadScribbleByIndex(parseInt(id));
	},
	newScribble: function() {
		this.hide();
		this.parentController.newScribble();
	},
	show: function() {
		var h = parseInt(this.element.getStyle("height")) + 20;
        this.element.setStyle("top", "-"+h+"px");
        var self = this;
		this.animate({
			'webkitTransform': 'translateY('+h+'px)'
        });
	},
	hide: function() {
		var self = this;
		var h = parseInt(this.element.getStyle("height")) + 20;
		this.animate({
			'webkitTransform': 'translateY(-'+h+'px)'
		});
		
	}
});

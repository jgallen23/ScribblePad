var ViewAllController = Controller.extend({
	init: function(element, scribbles, parentController) {
		var self = this;
		this.element = element
		this.currentPage = 0;
		this.itemsPerPage = 0;
		this.parentController = parentController;
		this.scribbles = scribbles;
		this._updateContainerLimits();
		this._render();
		window.addEventListener("resize", function() { self._updateContainerLimits(); });

		this.bindClickEvents({
		/*"img": function() { self.loadScribble.call(this) },*/
			".jsNewButton2": self.newScribble,
			".jsNextButton2": self.next,
			".jsPrevButton2": self.prev
		});
		this.show();
	},
	_updateContainerLimits: function() { 
		var container = this.element.find(".container");
		var h = parseInt(container.getStyle("height"));
		var w = parseInt(container.getStyle("width"));
		var itemsH = Math.floor(h/120);
		var itemsW = Math.floor(w/120);
		this.itemsPerPage = itemsH*itemsW;
		this.totalPages = Math.ceil(this.scribbles.length/this.itemsPerPage);
		this._render();
	},
	_render: function() {
		var self = this;
		var htmlArr = [];
		var count = (this.totalPages == (this.currentPage + 1))?this.scribbles.length:this.itemsPerPage;
		for (var i = (this.currentPage * this.itemsPerPage); i < count; i++) {
            if (this.scribbles[i].imageData) {
                htmlArr.push("<li><img id='ViewImage_"+i+"' src='"+this.scribbles[i].imageData+"'/></li>");
            }
		}
		this.element.find("ul.ImageList").html(htmlArr.join(""));	
		this.element.find("img").on("click", function() {
			var id = this.id.split("_")[1];
			self.hide()
			self.parentController.loadScribbleByIndex(parseInt(id));
		});
		this.updatePagination();
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
		
	},
	updatePagination: function() {
		if (this.currentPage == 0) {
			x$(".jsPrevButton2").setStyle("display", "none");
		} else {
			x$(".jsPrevButton2").setStyle("display", "block");
		}
		if (this.scribbles.length <= ((this.currentPage + 1) * this.itemsPerPage)) {
			x$(".jsNextButton2").setStyle("display", "none");
		} else {
			x$(".jsNextButton2").setStyle("display", "block");
		}
	},
	next: function() {
		this.currentPage++;
		this._render();
	},
	prev: function() {
		this.currentPage--;
		this._render();
	}
});

var ViewAllController = ui.Controller.extend({
	init: function(element, scribbles, parentController) {
		var self = this;
		this._super(element);
		this.currentPage = 0;
		this.itemsPerPage = 0;
		this.parentController = parentController;
		this.scribbles = scribbles;
		this._updateContainerLimits();
		this._render();
		window.addEventListener("resize", function() { self._updateContainerLimits(); });
		/*
		this.bindClickEvents({
			".jsNewButton2": self.newScribble,
			".jsNextButton2": self.next,
			".jsPrevButton2": self.prev
		});
		*/
		this.show();
	},
	_updateContainerLimits: function() { 
		var container = this.view.find(".container");
		var h = parseInt(container.clientHeight, 10);
		var w = parseInt(container.clientWidth, 10);
		var itemsH = Math.floor(h/120);
		var itemsW = Math.floor(w/120);
		debugger;
		this.itemsPerPage = itemsH*itemsW;
		this.totalPages = Math.ceil(this.scribbles.length/this.itemsPerPage);
		this._render();
	},
	_render: function() {
		var self = this;
		var htmlArr = [];
		var start = (this.currentPage * this.itemsPerPage);
		var count = (this.totalPages == (this.currentPage + 1))?this.scribbles.length:this.itemsPerPage+start;
		for (var i = start; i < count; i++) {
            if (this.scribbles[i].imageData) {
                htmlArr.push("<li id='ViewImage_"+i+"'><img src='"+this.scribbles[i].imageData+"'/></li>");
			} else {
				htmlArr.push("<li id='ViewImage_"+i+"'><img src='ui/images/pixel.png'/></li>");
			}
		}
		this.view.find("ul.ImageList").innerHTML = htmlArr.join("");	
		
		this.view.find("ul.ImageList li").addEventListener("click", function() {
			var id = this.id.split("_")[1];
			self.hide();
			self.parentController.loadScribbleByIndex(parseInt(id, 10));
		});
		this.updatePagination();
	},
	loadScribble: function() {
		debug.log(this);
		var id = this.id.split("_")[1];
		this.hide();
		this.parentController.loadScribbleByIndex(parseInt(id, 10));
	},
	newScribble: function() {
		this.hide();
		this.parentController.newScribble();
	},
	show: function() {
		debugger;
		var h = parseInt(this.view.element.clientHeight, 10) + 20;
        this.view.element.style.top = "-"+h+"px";
		this.view.animate("translateY(-"+h+"px");
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
			this.view.find(".jsPrevButton2").style.visibility = "hidden";
		} else {
			this.view.find(".jsPrevButton2").style.visibility = "visible";
		}
		if (this.scribbles.length <= ((this.currentPage + 1) * this.itemsPerPage)) {
			this.view.find(".jsNextButton2").style.visibility = "hidden";
		} else {
			this.view.find(".jsNextButton2").style.visibility = "visible";
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

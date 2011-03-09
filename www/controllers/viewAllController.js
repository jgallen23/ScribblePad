var ViewAllController = ui.Controller.extend({
	init: function(element, scribbles, parentController) {
		var self = this;
		this._super(element);
		this.currentPage = 0;
		this.itemsPerPage = 0;
		this.parentController = parentController;
		this.scribbles = scribbles;
		var container = this.view.find(".container");
		container.parentNode.style.top = "-"+container.clientHeight+"px";
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
		this.itemsPerPage = itemsH*itemsW;
		this.totalPages = Math.ceil(this.scribbles.length/this.itemsPerPage);
		this._render();
	},
	_render: function() {
		var self = this;
		var htmlArr = [];
		var start = (this.currentPage * this.itemsPerPage);
		var count = (this.totalPages == (this.currentPage + 1))?this.scribbles.length:this.itemsPerPage+start;
		var imgHeight = 100;
		var imgWidth = 100;
		var sizeStyle = "style='width:"+imgWidth+"px; height:"+imgHeight+"px'";
		var pathScribbles = [];
		for (var i = start; i < count; i++) {
			console.log(this.scribbles[i]);
            if (this.scribbles[i].imageData) {
                htmlArr.push("<li><img "+sizeStyle+" id='ViewImage_"+i+"' data-action='viewScribble' src='"+this.scribbles[i].imageData+"'/></li>");
			} else {
				htmlArr.push("<li "+sizeStyle+" ><canvas id='ViewImage_"+i+"' data-action='viewScribble'></canvas></li>");
				pathScribbles.push(i);
			}
		}
		this.view.find("ul.ImageList").innerHTML = htmlArr.join("");	
		this.drawScribbles(pathScribbles);
		this.updatePagination();
	},
	drawScribbles: function(indexes) {
		var self = this;
		indexes.forEach(function(item, i) {
			var task = self.scribbles[item];
			var elem = document.getElementById("ViewImage_"+item).parentNode;
			var s = new ScribbleView(elem, true);

			var taskScaleX = 100/task.width;
			var taskScaleY = 100/task.height;
			s.scale(taskScaleX, taskScaleY);
			s.load(task.path);
		});
	},
	viewScribble: function(e) {
		var id = e.target.getAttribute("id").split("_")[1];
		this.hide();
		this.parentController.loadScribbleByIndex(parseInt(id, 10));
	},
	loadScribble: function() {
		var id = this.id.split("_")[1];
		this.hide();
		this.parentController.loadScribbleByIndex(parseInt(id, 10));
	},
	newScribble: function() {
		this.hide();
		this.parentController.newScribble();
	},
	show: function() {
		/*var h = parseInt(this.view.element.clientHeight, 10) + 20;*/
		/*this.view.element.style.top = "-"+h+"px";*/
		var h = this.view.find(".container").clientHeight;
		this.view.animate("translateY("+h+"px)");
	},
	hide: function() {
		var h = this.view.find(".container").clientHeight;
		this.view.animate("translateY(-"+h+"px)");
		
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

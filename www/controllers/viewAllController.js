var ViewAllController = Fidel.extend({
  actionEvent: inputEventName, 
  events: {
    //'viewScribble': inputEventName + ' '
  },
  init: function() {
    var self = this;
    this.currentPage = 0;
    this.itemsPerPage = 0;
    this.el.css("top","-"+this.el.height()+"px");
    window.addEventListener("resize", function() { self._updateContainerLimits(); });
    /*ui.resize(function() { self._updateContainerLimits(); });*/
    /*ui.orientationChanged(function() { self._updateContainerLimits(); });*/
    /*
    this.bindClickEvents({
      ".jsNewButton2": self.newScribble,
      ".jsNextButton2": self.next,
      ".jsPrevButton2": self.prev
    });
    */
    this.show();
    this._updateContainerLimits();
    //this._render();
  },
  _updateContainerLimits: function() { 
    var h = parseInt(this.container.height(), 10);
    var w = parseInt(this.container.width(), 10);
    var paddingX = (w > 900)?60:20;
    var paddingY = (h > 600)?30:20;
    var itemsWide = (w > 900)?3:2;
    var itemsHigh = (h > 600)?3:2;

    this.itemWidth = Math.floor((w-(itemsWide*paddingX))/itemsWide);
    this.itemHeight = Math.floor((h-(itemsHigh*paddingY))/itemsHigh);

    this.itemsPerPage = itemsWide*itemsHigh;
    this.totalPages = Math.ceil(this.scribbles.length/this.itemsPerPage);
    this._render();
  },
  _render: function() {
    var self = this;
    var htmlArr = [];
    var start = (this.currentPage * this.itemsPerPage);
    var count = (this.totalPages == (this.currentPage + 1))?this.scribbles.length:this.itemsPerPage+start;
    var sizeStyle = "style='width:"+this.itemWidth+"px; height:"+this.itemHeight+"px'";
    var pathScribbles = [];
    for (var i = start; i < count; i++) {
      if (this.scribbles[i].imageData) {
        htmlArr.push("<li data-id='"+i+"'><img "+sizeStyle+" src='"+this.scribbles[i].imageData+"'/></li>");
      } else {
        htmlArr.push("<li data-id='"+i+"' "+sizeStyle+" ><canvas></canvas></li>");
        pathScribbles.push(i);
      }
    }
    this.find("ul.ImageList").html(htmlArr.join(""));
    var items = this.find("ul.ImageList li").bind(inputEventName, this.proxy(this.viewScribble));
    this.drawScribbles(items);
    this.updatePagination();
  },
  drawScribbles: function(indexes) {
    var self = this;
    indexes.forEach(function(elem, i) {
      var task = self.scribbles[i];
      var s = new Scribble({ el: $(elem), readonly: true });

      var scale = 1;
      /*if (self.itemWidth > self.itemHeight) {*/
        scaleX = self.itemWidth / task.width;
        scaleX = (scaleX > 1)?1:scaleX;
        scaleY = self.itemHeight / task.height;
        scaleY = (scaleY > 1)?1:scaleY;
        /*} else {*/
        /*}*/
        /*scale = (scale > 1)?1:(Math.round(scale*1000)/1000);*/
        /*console.log(scale);*/

      s.clear();
      s.scale(scaleX, scaleY);
      s.load(task.path, task.bounds[0]);
    });
  },
  viewScribble: function(e) {
    var id = e.target.parentNode.getAttribute("data-id");
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
    /*this.view.element.style.top = "-"+h+"px";*/
    var h = this.el.height();
    /*self.view.element.style.top = "-10000px";*/
    //this.view.animate("translateY("+h+"px)");
    this.el.anim({ translateY: h+"px" }, 1, 250);
    //this.el.css("top", "0px");
  },
  hide: function() {
    var h = this.el.height();
    var self = this;
    this.el.anim({ translateY: "-"+h+"px" }, 1, 500, function() {
      //self.view.element.style.top = "-10000px";
      //self.destroy();
    });
  },
  updatePagination: function() {
    if (this.currentPage == 0) {
      this.prevButton.css("visibility", "hidden");
    } else {
      this.prevButton.css("visibility", "visible");
    }
    if (this.scribbles.length <= ((this.currentPage + 1) * this.itemsPerPage)) {
      this.nextButton.css("visibility", "hidden");
    } else {
      this.nextButton.css("visibility", "visible");
    }
  },
  next: function() {
    this.currentPage++;
    this._render();
  },
  prev: function() {
    this.currentPage--;
    this._render();
  },
  deleteScribbles: function() {
    var self = this;
    var del = function(x) {
      if (x != 1)
        return;

      var s = (self.currentPage * self.itemsPerPage);
      var e = (self.totalPages == (self.currentPage+1))?self.scribbles.length:self.itemsPerPage;
      for (var i = s, c = e; i < c; i++) {
        var item = self.scribbles[i];
        console.log(item);
        scribbleData.remove(item);
        //self.scribbles.splice(index, 1);
      }
    };
    var msg = "Are you sure you want to delete these Scribbles?";
    if (isPhoneGap) {
      navigator.notification.confirm(msg, del);
    } else {
      if (confirm(msg)) {
        del(1);
      }
    }
  }
});

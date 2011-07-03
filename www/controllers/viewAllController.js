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
    this.pagie = new Pagie(this.scribbles, 4);
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
    var paddingX = 10;
    var paddingY = 10;
    var itemsWide = 2;
    var itemsHigh = 2;

    this.itemWidth = Math.floor((w-(itemsWide*paddingX))/itemsWide);
    this.itemHeight = Math.floor((h-(itemsHigh*paddingY))/itemsHigh);
    console.log(this.itemWidth, this.itemHeight);

    this._render();
  },
  _render: function() {
    var self = this;
    var htmlArr = [];
    var sizeStyle = "style='width:"+this.itemWidth+"px; height:"+this.itemHeight+"px'";
    var scribbles = this.pagie.getCurrentPageItems();
    var imgList = this.find("ul.ImageList").html('');
    for (var i = 0, c = scribbles.length; i < c; i++) {
      var scribble = scribbles[i];
      if (scribble.imageData) {
        imgList.append("<li data-id='"+i+"'><img "+sizeStyle+" src='"+scribble.imageData+"'/></li>");
      } else {
        var elem = $("<li data-id='"+i+"' "+sizeStyle+" ><canvas></canvas></li>");
        imgList.append(elem);

        var s = new Scribble({ el: $("[data-id='"+i+"']"), readonly: true });

        var scale = 1;
        var scaleX = self.itemWidth / scribble.width;
        scaleX = (scaleX > 1)?1:scaleX;
        var scaleY = self.itemHeight / scribble.height;
        scaleY = (scaleY > 1)?1:scaleY;

        s.clear();
        s.scale(scaleX, scaleY);
        s.load(scribble.path, scribble.bounds[0]);
      }

    }
    this.find("ul.ImageList li").bind(inputEventName, this.proxy(this.viewScribble));
    this.updatePagination();
  },
  viewScribble: function(e) {
    var id = e.target.parentNode.getAttribute("data-id");
    var index = ((this.pagie.currentPageNumber-1)*this.pagie.itemsPerPage)+parseInt(id, 10);
    this.hide();
    this.parentController.loadScribbleByIndex(index);
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
    if (this.pagie.isFirstPage()) {
      this.prevButton.css("visibility", "hidden");
    } else {
      this.prevButton.css("visibility", "visible");
    }
    if (this.pagie.isLastPage()) {
      this.nextButton.css("visibility", "hidden");
    } else {
      this.nextButton.css("visibility", "visible");
    }
  },
  next: function() {
    this.pagie.nextPage();
    this._render();
  },
  prev: function() {
    this.pagie.previousPage();
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

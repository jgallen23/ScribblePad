var ViewAllController = Fidel.ViewController.extend({
  actionEvent: inputEventName, 
  events: {
    //'viewScribble': inputEventName + ' '
  },
  init: function() {
    var self = this;
    this.currentPage = 0;
    this.itemsPerPage = 0;
    this.el.css("top",this.el.height()+"px");
    this.scroller = new iScroll(this.container[0], { checkDOMChanges: false });
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
    this._render();
  },
  _render: function() {
    var self = this;
    console.log(this.scribbles.length);
    if (this.scribbles.length === 0) {
      this.parentController.newScribble();
      this.hide();
      return;
    }
    var htmlArr = [];
    var w = parseInt(this.container.width(), 10);
    var h = 150;
    var sizeStyle = "style='height:"+(h+10)+"px'";
    var imgList = this.find("ul.ImageList").html('');
    for (var i = 0, c = this.scribbles.length; i < c; i++) {
      var scribble = this.scribbles[i];
      if (scribble.imageData) {
        imgList.append("<li data-index='"+i+"'><img "+sizeStyle+" src='"+scribble.imageData+"'/></li>");
      } else {
        var elem = $("<li data-index='"+i+"' "+sizeStyle+" data-action='viewScribble'><canvas></canvas><button class='Button DeleteButton' data-action='deleteScribble'></button></li>");
        imgList.append(elem);

        var s = new Scribble({ el: $("[data-index='"+i+"']"), readonly: true });

        var scale = 1;
        var scaleX = w / scribble.width;
        scaleX = (scaleX > 1)?1:scaleX;
        var scaleY = h / scribble.height;
        scaleY = (scaleY > 1)?1:scaleY;

        s.clear();
        s.scale(scaleX, scaleY);
        s.load(scribble.path, scribble.bounds[0]);
      }

    }
    console.log(this.container[0].clientHeight);
    setTimeout(function() { self.scroller.refresh(); });
  },
  viewScribble: function(el) {
    var index = el.attr("data-index");
    this.hide();
    this.parentController.loadScribbleByIndex(index);
  },
  deleteScribble: function(el) {
    var self = this;
    var del = function(i) {
      if (i != 1)
        return;
      var index = el.parent().attr('data-index');

      self.scribbles.splice(index, 1);
      scribbleData.remove(self.scribbles[index]);
      self._render();
    };

    var msg = "Are you sure you want to delete this Scribble?";
    if (isPhoneGap) {
      plugins.preferences.boolForKey("confirm_delete", function(key, value) {
        if (value)
          navigator.notification.confirm(msg, del);
        else
          del(1);
      });
    } else {
      if (confirm(msg)) {
        del(1);
      }
    }
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
    this.el.anim({ translateY: "-"+h+"px" }, 1, 250);
    //this.el.css("top", "0px");
  },
  hide: function() {
    var h = this.el.height();
    var self = this;
    this.el.anim({ translateY: h+"px" }, 1, 500, function() {
      //self.view.element.style.top = "-10000px";
      //self.destroy();
    });
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

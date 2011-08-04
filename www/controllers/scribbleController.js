var ScribbleController = Fidel.ViewController.extend({
  actionEvent: inputEventName,
  init: function() {  
    var self = this;

    this.currentIndex = 0;
    this.scribbles = [];
    this.loadedScribble = null;
    document.addEventListener("resume", function() {
      if (isPhoneGap) {
        plugins.preferences.boolForKey("new_scribble", function(key, value) {
          if (value)
            self.newScribble();
        });
      }
    });

    window.addEventListener("resize", this.proxy(this.resize));
    this.resize();

    this.scribblePad = new Scribble({ el: this.scribblePadContainer });
    this.scribblePad.bind("end", function() {
      if (!self.loadedScribble) {
        self.loadedScribble =  {};
      }
      self.loadedScribble.path = this.strokes;
      self.saveScribble(self.loadedScribble);
    });

    this.deviceCheck();
    this.watchOrientation();
    this.load();
  },
  watchOrientation: function() {
    if (isPhoneGap) {
      var self = this;
      self.allowLandscape = true;
      plugins.preferences.boolForKey("allow_landscape", function(key, value) {
        self.allowLandscape = value;
      });
      window.shouldRotateToOrientation = function(deg) {
        return (self.allowLandscape || (deg == 0 || deg == 180));
      };
    }
  },
  show: function() {
      this.el.css("display", "-webkit-box");
  },
  resize: function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    if (this.loadedScribble) {
      var i = this.currentIndex;
      this.currentIndex = -1;
      this.scribblePad.clear();
      this.loadScribbleByIndex(i);
    }
  },
  deviceCheck: function() {
    return;
    if (isPhoneGap || navigator.device.platform != "iPhone") {
      this.find(".jsCameraButton").style.display = "none";
    }
  },
  updatePagination: function() {
    var index = this.currentIndex;
    var count = (this.loadedScribble)?this.scribbles.length:this.scribbles.length+1;
    if (index === 0) {
      this.prevButton.hide();
    } else {
      this.prevButton.show();
    }
    if (count == index + 1) {
      this.nextButton.hide();
    } else {
      this.nextButton.show();
    }

    this.currentIndexNode.html("<span>"+(parseInt(index, 10) + 1)+"</span>");
    this.totalNode.html("<span>"+count+"</span>");
    this.updateNewButton();
  },
  updateNewButton: function() {
    if (this.loadedScribble) {
      this.newButton.css("visibility", "visible");
    } else {
      this.newButton.css("visibility", "hidden");
    }
  },
  load: function() {
    var self = this;
    this.newScribble();
    scribbleData.find(function(data) {
      self.scribbles = data;
      /*self.scribbles.push(self.currentScribble);*/
      self.currentIndex = self.scribbles.length;
      setTimeout(function() {
        self.updatePagination();
      }, 200);
      self.updateBadge();
      //tmp
      //self.viewAllScribbles();
    });
  },
  prevScribble: function() { 
    this.loadScribbleByIndex(this.currentIndex - 1);
  },
  nextScribble: function() {
    if (this.scribbles.length > this.currentIndex) {
      this.loadScribbleByIndex(this.currentIndex + 1);
    }
  
  },
  loadScribbleByIndex: function(index) {
    this.show();
    if (this.currentIndex == index) {
      return;
    } else if (this.scribbles.length == 0 || index > this.scribbles.length - 1) {
      this.newScribble();
    } else {
      this.currentIndex = index;
      var s = this.scribbles[this.currentIndex];
      this.loadedScribble = s;
      this.scribblePad.clear();
      this.scribblePad.load(s.path, null, s.imageData, s.photoData);
      this.updatePagination();
    }
  },
  newScribble: function() {
    this.show();
    this.scribblePad.clear();
    if (this.loadedScribble || this.scribblePad.isDirty) {
      this.currentIndex = this.scribbles.length;
      this.loadedScribble = null;
      this.updatePagination();
    }
  },
  saveScribble: function(scribble) {
    var self = this;
    if (!scribble.key) {
      this.scribbles.push(scribble);
    }
    scribbleData.save(scribble, function(r) {
      scribble.key = r.key;
      self.updateNewButton();
    });

    this.updateBadge();
  },
  deleteScribble: function() {
    var self = this;
    var del = function(i) {
      if (i != 1)
        return;
      var index = self.currentIndex;
      self.currentIndex = -2;
      self.scribbles.splice(index, 1);
      self.updateBadge();

      if (self.loadedScribble) {
        scribbleData.remove(self.loadedScribble);
      }
      if (index == self.scribbles.length) {
        index--;
      }
      self.loadScribbleByIndex(index);
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
  viewAllScribbles: function() {
    var viewAll = new ViewAllController({ el: $("#ViewAll"), scribbles: this.scribbles, parentController: this });
  },
  updateBadge: function() {
    var self = this;
    console.log("Badge: "+self.scribbles.length);
    if (isPhoneGap) {
      plugins.preferences.boolForKey("show_badge", function(key, value) {
        console.log("update badge: "+value);
        if (value) {
          var count = self.scribbles.length;
          plugins.badge.set(count);
        } else {
          plugins.badge.clear();
        }
      });
    }
  },
  takePhoto: function() {
    var self = this;
    var onSuccess = function(imageData) {
      var data = "data:image/jpeg;base64," + imageData;
      self.currentScribble.photoData = data;
      self.scribblePad.loadScribble(self.currentScribble);
    };
    var onFail = function(message) {
      alert(message);
    };
    var source = (browser.isMobile && navigator.device.platform == "iPad")?0:1
    navigator.camera.getPicture(onSuccess, onFail, { quality: 10, sourceType: source });
  }
});

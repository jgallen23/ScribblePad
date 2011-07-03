var App = function() {
  var self = this;
  var ready = function() {
    document.addEventListener("touchmove", function(e) { e.preventDefault(); }, false);



    self.data = new ScribbleData();

    self.scribble = new ScribbleController({ el: $("#Scribble") });

    self.scribble.bind("viewAll", function() {
      self.viewAll = new ViewAllController({ el: $("#ViewAll"), scribbles: this.scribbles, parentController: this });
    });



    self.data.find(function(scribbles) {
      self.scribble.load(scribbles);

    });


  };






  if (isPhoneGap)
    document.addEventListener("deviceready", ready);
  else
    ready();
};
window.app = new App();

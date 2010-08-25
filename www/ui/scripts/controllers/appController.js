var AppController = Class.extend({
	init: function() {

		this._preventScroll();
		this._resize();

		this.scribbleController = new ScribbleController(x$("#Scribble"));

	},
	_preventScroll: function() {
		//prevent scroll
		function preventBehavior(e) { 
		  e.preventDefault(); 
		};
		document.addEventListener("touchmove", preventBehavior, false);
	},
	_resize: function() {
		var resize = function() {
			var toolbarHeight = parseInt(x$(".Toolbar").getStyle("height"));
			var w = window.innerWidth;
			var h = window.innerHeight;
			x$("canvas")[0].setAttribute("width", w);
			x$("canvas")[0].setAttribute("height", h - toolbarHeight);
			x$("#ViewAll .container").setStyle("height", (h - toolbarHeight)+"px");
		};
		x$("body").on("orientationchange", resize);
		resize();
	},
	dataTest: function() {
		Scribble.data.get(function(data) {
			var s = data[0];
			for (var i = 0; i < 40; i++) {
				s.id = "";
				Scribble.data.save(s);
			}
		});
	}
});

var AppController = Class.extend({
	init: function() {
		var self = this;
		this._preventScroll();
		this._resize();

		this.scribbleController = new ScribbleController(x$("#Scribble"));
		document.addEventListener("applicationActive", function() {
			self._applicationActivate();
		}, false);
	},
	_applicationActivate: function() {
		this.scribbleController.newScribble();
	},
	_preventScroll: function() {
		if (browser.isMobile) {
			//prevent scroll
			function preventBehavior(e) { 
			  e.preventDefault(); 
			};
			document.addEventListener("touchmove", preventBehavior, false);
		}
	},
	_resize: function() {
		var resize = function() {
			var toolbarHeight = parseInt(x$(".Toolbar").getStyle("height"));
			var w = window.innerWidth - 10;
			var h = window.innerHeight - 10;
			x$(".Sheet").setStyle("width", w+"px");
			x$(".Sheet").setStyle("height", h+"px");
			x$("canvas")[0].setAttribute("width", w);
			x$("canvas")[0].setAttribute("height", h - toolbarHeight);
			x$("#ViewAll .container").setStyle("height", (h - toolbarHeight)+"px");
		};
		if (browser.isMobile) {
			x$("body").on("orientationchange", resize);
		}
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

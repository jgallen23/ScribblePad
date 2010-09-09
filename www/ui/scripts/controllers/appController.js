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
		var resize = function(event) {
			var toolbarHeight = parseInt(x$(".Toolbar").getStyle("height"));
			var w = window.innerWidth - 10;
			var h = window.innerHeight - 10;
			alert(w)
			x$(".Sheet").setStyle("width", w+"px");
			x$(".Sheet").setStyle("height", h+"px");

			x$("#ViewAll .container").setStyle("height", (h - toolbarHeight)+"px");
			var o = (PhoneGap.available)?event.orientation:window.orientation;
			debug.log(o);
			if (o == -90 || o == 90) {
				x$("body").addClass("Landscape");
				x$("canvas")[0].setAttribute("width", w - toolbarHeight);
				x$("canvas")[0].setAttribute("height", h );
			} else {
				x$("body").removeClass("Landscape");
				x$("canvas")[0].setAttribute("width", w);
				x$("canvas")[0].setAttribute("height", h - toolbarHeight);
			}
		};
		if (browser.isMobile) {
			/*x$("body").on("orientationchange", resize);*/
			document.addEventListener("orientationChanged", resize, false);
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

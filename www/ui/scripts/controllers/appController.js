var AppController = Class.extend({
	init: function() {
		var self = this;
		this._preventScroll();
		this._resize();
		this.scribbleController = new ScribbleController(x$("#Scribble"));
		if (browser.isPhoneGap) {
			this.iAdController = new iAdController();
		}
		document.addEventListener("applicationActive", function() {
			window.plugins.preferences.boolForKey("new_scribble", function(key, value) {
				if (value) {
					self._applicationActivate();
				}
			});
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
			debug.log("resize");
			var toolbarHeight = parseInt(x$(".Toolbar").getStyle("height"));
			var w = window.innerWidth - 10;
			var h = window.innerHeight - 5;
			x$(".Sheet").setStyle("width", w+"px");
			x$(".Sheet").setStyle("height", h+"px");

			x$("#ViewAll .container").setStyle("height", (h - toolbarHeight)+"px");
			/*x$("canvas")[0].setAttribute("width", w);*/
			/*x$("canvas")[0].setAttribute("height", h);*/
		};
		window.addEventListener("resize", resize, false);
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

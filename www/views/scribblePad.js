var ScribblePad = ui.View.extend({
	init: function(canvas) {
		this.isDrawing = false;
		this._drawMove = false;
		this.scribbledLoaded = false;
		this.isDirty = false;
		this.needsResize = false;
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.saveScribbleCallback = false;
		this.startX = 0;
		this.startY = 0;
		this.saveTimeout = null;
		var self = this;

		//events
		x$(canvas).on(INPUT_START_EVENT, function(ev) { self._onDrawStart(ev); });
		x$(canvas).on(INPUT_MOVE_EVENT, function(ev) { self._onDraw(ev); });
		x$(canvas).on(INPUT_END_EVENT, function(ev) { self._onDrawEnd(ev); });
		x$(window).on(INPUT_END_EVENT, function(ev) { self._onDrawEnd(ev); });

		window.addEventListener("resize", function() { self._resize(); });
		self._resize();
	},
	_resize: function() {
		if (!this.isDrawing) {
			this.needsResize = false;
			console.log("resize pad");
			var w = window.innerWidth - 10;
			var h = window.innerHeight - 5;
			x$("canvas")[0].setAttribute("width", w);
			x$("canvas")[0].setAttribute("height", h);
			if (this.scribble)
				this.loadScribble(this.scribble);
		} else {
			this.needsResize = true;
		}
	},
	_getXY: function(ev) {
		var x,y;
		if (ev.touches) {
			x = ev.touches[0].pageX - this.canvas.offsetLeft;
			y = ev.touches[0].pageY - this.canvas.offsetTop;
		} else {
			/*x = ev.clientX - frame.left;*/
			/*y = ev.clientY - frame.top;*/
			x = ev.pageX - this.canvas.offsetLeft;
			y = ev.pageY - this.canvas.offsetTop;
		}
		return [x, y];
	},
	_onDrawStart: function(ev) {
		if (ev.touches && ev.touches.length != 1) {
			cls.clearCanvas();
		}
		ev.preventDefault();
		var xy = this._getXY(ev);
		this.isDrawing = true;
		this.context.strokeStyle = "#000";
		this.context.lineWidth = 1;
		this.startX = xy[0];
		this.startY = xy[1];
		this.trigger("drawStart");
	},
	_onDraw: function(ev) {
		var xy = this._getXY(ev);
		if (this.isDrawing) {
			this._drawMove = true;
			if (this.saveTimeout)
				clearTimeout(this.saveTimeout);
			this.isDirty = true;
			this.context.beginPath();
			this.context.moveTo(this.startX, this.startY);
			this.context.lineTo(xy[0], xy[1])
			this.context.closePath();
			this.context.stroke();
		}
		this.startX = xy[0];
		this.startY = xy[1];
	},
	_onDrawEnd: function(ev) {
		var self = this;
		this.isDrawing = false;
		var delay = (PhoneGap.available && navigator.device.platform.indexOf("iPad") != -1)?700:300;
		if (this._drawMove && this.isDirty) {
			if (this.saveTimeout)
				clearTimeout(this.saveTimeout);
			this.saveTimeout = setTimeout(function() {
				debug.log("save");
				self.scribble.imageData = self.canvas.toDataURL();
				self.scribble.modifiedOn = new Date();
				self.scribble.height = self.canvas.height;
				self.scribble.width = self.canvas.width;
				self.trigger("saveScribble", [self.scribble]);
				if (self.saveScribbleCallback) {
					self.saveScribbleCallback();
				}
				if (self.needsResize) self._resize();
			}, delay);
		}
		this._drawMove = false;
		this.trigger("drawEnd");
	},
	loadScribble: function(scribble) {
		console.log(scribble);
		this.clear();
		var self = this;
		var img = new Image();
		var photo = new Image();
		this.scribble = scribble;
		if (scribble.photoData) {
			this.scribbledLoaded = true;
			photo.onload = function() { 
				self.context.drawImage(photo, 0, 0, self.canvas.width, self.canvas.height);
			}
			photo.src = scribble.photoData;
		}
		if (scribble.imageData) {
			this.scribbledLoaded = true;
			img.onload = function() { 
				self.context.drawImage(img, 0, 0, scribble.width, scribble.height);
			}
			img.src = scribble.imageData;
		}
	},
	clear: function() {
		this.scribbledLoaded = false;
		this.isDirty = false;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.scribble = new Scribble();
	},
	getData: function() {
		var data = this.canvas.toDataURL();
		return data;
	}
});

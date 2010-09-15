var ScribblePad = View.extend({
	init: function(canvas) {
		this.isDrawing = false;
		this._drawMove = false;
		this.scribbledLoaded = false;
		this.isDirty = false;
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.saveScribbleCallback = false;
		this.startX = 0;
		this.startY = 0;
		this.saveTimeout;
		var self = this;

		//events
		x$(canvas).on(INPUT_START_EVENT, function(ev) { self._onDrawStart(ev); });
		x$(canvas).on(INPUT_MOVE_EVENT, function(ev) { self._onDraw(ev); });
		x$(canvas).on(INPUT_END_EVENT, function(ev) { self._onDrawEnd(ev); });
		x$(window).on(INPUT_END_EVENT, function(ev) { self._onDrawEnd(ev); });

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
		this.context.strokeStyle = "#666";
		/*context.lineWidth = 1;*/
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
				self.trigger("saveScribble");
				if (self.saveScribbleCallback) {
					self.saveScribbleCallback();
				}
			}, delay);
		}
		this._drawMove = false;
		this.trigger("drawEnd");
	},
	loadScribble: function(scribble) {
		this.clear();
		var self = this;
		var img = new Image();
		var photo = new Image();
		this.scribble = scribble;
		if (scribble.photoData) {
			this.scribbledLoaded = true;
			photo.src = scribble.photoData;
			photo.onload = function() { 
				self.context.drawImage(photo, 0, 0, self.canvas.width, self.canvas.height);
			}
		}
		if (scribble.imageData) {
			this.scribbledLoaded = true;
			img.src = scribble.imageData;
			img.onload = function() { 
				self.context.drawImage(img, 0, 0, self.canvas.width, self.canvas.height);
			}
		}
	},
	clear: function() {
		this.scribbledLoaded = false;
		this.isDirty = false;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	getData: function() {
		var data = this.canvas.toDataURL();
		return data;
	}
});

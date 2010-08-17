var ScribblePad = Class.extend({
	init: function(canvas) {
		this.isDrawing = false;
		this.isDirty = false;
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.drawEndCallback = false;
		this.startX = 0;
		this.startY = 0;
		var self = this;

		//events
		x$(canvas).on("mousedown", function(ev) { self._onDrawStart(ev); });
		x$(canvas).on("mousemove", function(ev) { self._onDraw(ev); });
		x$(canvas).on("mouseup", function(ev) { self._onDrawEnd(ev); });
		x$(window).on("mouseup", function(ev) { self._onDrawEnd(ev); });

		x$(canvas).on("touchstart", function(ev) { self._onDrawStart(ev); }); 
		x$(canvas).on("touchmove", function(ev) { self._onDraw(ev); });
		x$(canvas).on("touchend", function(ev) { self._onDrawEnd(ev); });
		x$(window).on("touchend", function(ev) { self._onDrawEnd(ev); });

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
		console.log("start");
		console.log(ev);
		/*console.log(ev.touches.length);*/
		if (ev.touches && ev.touches.length != 1) {
			cls.clearCanvas();
		}
		ev.preventDefault();
		var xy = this._getXY(ev);
		this.isDrawing = true;
		/*context.lineWidth = 1;*/
		this.startX = xy[0];
		this.startY = xy[1];
		console.log(this.startX + ", " + this.startY);
	},
	_onDraw: function(ev) {
		var xy = this._getXY(ev);
		if (this.isDrawing) {
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
		this.isDrawing = false;
		if (this.isDirty && this.drawEndCallback) {
			this.drawEndCallback();
		}
	},
	load: function(scribbleData) {
		this.clear();
		var self = this;
		var img = new Image();
		img.src = scribbleData;
		img.onload = function() { 
			self.context.drawImage(img, 0, 0);
		}
	},
	clear: function() {
		this.isDirty = false;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	getData: function() {
		var data = this.canvas.toDataURL();
		return data;
	}
});

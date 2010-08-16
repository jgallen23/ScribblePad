var Scribble = function(canvas) {
	var self;
	var isDrawing = false;
	var context = canvas.getContext('2d');
	var frame = canvas.getBoundingClientRect();
	var startX, startY;

	var getXY = function(ev) {
		var x,y;
		if (ev.touches) {
			x = ev.touches[0].pageX - canvas.offsetLeft;
			y = ev.touches[0].pageY - canvas.offsetTop;
		} else {
			/*x = ev.clientX - frame.left;*/
			/*y = ev.clientY - frame.top;*/
			x = ev.pageX - canvas.offsetLeft;
			y = ev.pageY - canvas.offsetTop;
		}
		return [x, y];
	}

	var drawStart = function(ev) {
		console.log("start");
		console.log(ev);
		/*console.log(ev.touches.length);*/
		if (ev.touches && ev.touches.length != 1) {
			cls.clearCanvas();
		}
		ev.preventDefault();
		var xy = getXY(ev);
		isDrawing = true;
		/*context.lineWidth = 1;*/
		startX = xy[0];
		startY = xy[1];
		console.log(startX + ", " + startY);
	};

	var draw = function(ev) {
		var xy = getXY(ev);
		if (isDrawing) {
			context.beginPath();
			context.moveTo(startX, startY);
			context.lineTo(xy[0], xy[1])
			context.closePath();
			context.stroke();
		}
		startX = xy[0];
		startY = xy[1];
	};

	var drawEnd = function(ev) {
		console.log("end");
		isDrawing = false;
	};


	//events
	x$(canvas).on("mousedown", drawStart); 
	x$(canvas).on("mousemove", draw);
	x$(canvas).on("mouseup", drawEnd);
	x$(window).on("mouseup", drawEnd);

	x$(canvas).on("touchstart", drawStart); 
	x$(canvas).on("touchmove", draw);
	x$(canvas).on("touchend", drawEnd);
	x$(window).on("touchend", drawEnd);


	self = {
		clearCanvas: function() {
			context.clearRect(0, 0, canvas.width, canvas.height);
		},
		save: function() {
			var data = canvas.toDataURL();
			return data;
		}
	};
	return self;
}

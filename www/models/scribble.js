var Scribble = ui.Model.extend({
	init: function(initial) {
		this._data = {
			key: '',
			createdOn: new Date(),
			modifiedOn: '',
			imageData: '',
			photoData: '',
            path: [],
			height: 0,
			width: 0
		};
		this._super(initial);
		if (this.path && this.height === 0) {
			this._updateDimensions();
		}
	},
	_propertySet: function(prop, value, oldValue) {
		this._data.modifiedOn = new Date().getTime();
		this._super(prop, value);
		if (prop == "path") {
			this._updateDimensions();
		}
	},
	_getBounds: function(path) {
		var minX = 999, maxX = 0, minY = 999, maxY = 0;
		path.forEach(function(stroke) {
			stroke.forEach(function(point) {
				if (point[0] < minX)
					minX = point[0];
				if (point[0] > maxX)
					maxX = point[0];
				if (point[1] < minY)
					minY = point[1];
				if (point[1] > maxY)
					maxY = point[1];
			});
		});
		var bounds = [[minX, minY], [maxX, maxY]];
		return bounds;
	},
	_updateDimensions: function() {
		console.log("update dim");
		var b = this._getBounds(this._data.path);
		this._data.height = b[1][1] - b[0][1];
		this._data.width = b[1][0] - b[0][0];
		//this.save();
	}
});
Scribble.data = new ScribbleData();

var ScribbleData = LawnchairData.extend({
	init: function() {
		this._super('scribbles');
	},
	find: function(cb) {
		var scribbles = [];
		this._super(function(r) {
			for (var i = 0; i < r.length; i++) {
				var s = new Scribble(r[i]);
				scribbles.push(s);
			}
			cb(scribbles);
		});
	},
	findById: function(id, cb) {
	},
	save: function(scribble, cb) {
		this.data.save(scribble._data, cb);
	}
});

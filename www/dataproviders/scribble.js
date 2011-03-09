var ScribbleData = ui.Class.extend({
	init: function() {
		this.provider = new Lawnchair({ table: 'scribbles', adaptor: 'webkit' });
	},
	find: function(cb) {
		this.provider.all(function(data) {
			var scribbles = [];
			data.forEach(function(obj) {
				var s = new Scribble(obj);
				scribbles.push(s);
			});
			cb(scribbles);
		});
	},
	save: function(scribble, cb) {
		var data = scribble._data;
		var update = true;
		if (!scribble.key) {
			update = false;
			delete data.key;
		}
		this.provider.save(data, function(data) {
			if (!update) {
				scribble.key = data.key;
			}
			if (cb) cb(scribble);
		});
	},
	remove: function(scribble, cb) {
		this.provider.remove(scribble.key, cb);
	}
});

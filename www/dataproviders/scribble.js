var ScribbleData = LawnchairData.extend({
	init: function() {
		this._super('scribbles');
	},
	get: function(cb) {
		var scribbles = [];
		this._super(function(r) {
			for (var i = 0; i < r.length; i++) {
				var s = new Scribble();
				s.modifiedOn = r[i].modifiedOn;
				s.createdOn = r[i].createdOn;
				s.imageData = r[i].imageData;
				s.photoData = r[i].photoData;
				s.height = r[i].height;
				s.width = r[i].width;
				s.id = r[i].key;
				scribbles.push(s);
			}
			cb(scribbles);
		});
	},
	getById: function(id, cb) {
	},
	save: function(scribble, cb) {
		var obj = { 'createdOn': scribble.createdOn,
					'modifiedOn': scribble.modifiedOn,
					'imageData': scribble.imageData,
					'photoData': scribble.photoData,
					'height': scribble.height || 0,
					'width': scribble.width || 0
				}
		if (scribble.id != '')
			obj.key = scribble.id
		this.data.save(obj, cb);
	}
});

var Scribble = Model.extend({
	init: function() {
		this._super();
		this.createdOn = new Date();
		this.modifiedOn = '';
		this.imageData = '';
		this.photoData = '';
	}
});
Scribble.data = new ScribbleData();

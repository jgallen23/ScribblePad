var Scribble = Model.extend({
	init: function(initial) {
		this._data = {
			key: '',
			createdOn: new Date(),
			modifiedOn: '',
			imageData: '',
			photoData: '',
			height: 0,
			width: 0

		}
		this._super(initial);
	}
});
Scribble.data = new ScribbleData();

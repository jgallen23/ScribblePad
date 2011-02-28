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

		}
		this._super(initial);
	}
});
Scribble.data = new ScribbleData();

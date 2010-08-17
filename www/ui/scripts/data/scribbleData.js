var scribbleData = function() {
	var key = "scribbles";
	var _scribbles;
	return {
		get: function() {
			if (!_scribbles) {
				var d = localStorage.getItem(key);
				_scribbles = (d)?d.split("||"):[];
			}
			return _scribbles;
		},
		saveItem: function(scribble) {
			this.get();
			_scribbles.push(scribble);
			this.save();
		},
		updateItem: function(index, scribble) {
			if (_scribbles.length > index) {
				_scribbles[index] = scribble;
				this.save();
			} else {
				this.saveItem(scribble);
			}
		},
		deleteItemByIndex: function(index) {
			this.get().remove(parseInt(index));
			this.save();
		},
		save: function() {
			var data = this.get();
			localStorage.setItem(key, data.join("||"));
		},
		clearAll: function() {
			_scribbles = [];
			localStorate.clear();
		}
	}
}();

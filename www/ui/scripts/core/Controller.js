var Controller = Class.extend({
	bindClickEvents: function(obj) {
		for (var key in obj) {
			x$(key).on(INPUT_EVENT, obj[key]);
		}
	}
});

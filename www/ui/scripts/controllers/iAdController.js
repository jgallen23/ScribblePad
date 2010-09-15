var iAdController = Class.extend({
	init: function() {
		var self = this;
		document.addEventListener("iAdBannerViewDidLoadAdEvent", function() { self._iAdBannerViewDidLoadAdEventHandler(); }, false);
		// listen for the "iAdBannerViewDidFailToReceiveAdWithErrorEvent" that is sent by the iAdPlugin
		document.addEventListener("iAdBannerViewDidFailToReceiveAdWithErrorEvent", function() { self._iAdBannerViewDidFailToReceiveAdWithErrorEventHandler(); }, false);
		
		var adAtBottom = true; 
		setTimeout(function() {
			window.plugins.iAdPlugin.prepare(adAtBottom); // by default, ad is at Top
		}, 500);

	},
	_iAdBannerViewDidFailToReceiveAdWithErrorEventHandler: function(evt) {
		debug.log(evt.error);
		window.plugins.iAdPlugin.showAd(false);
	},
	_iAdBannerViewDidLoadAdEventHandler: function(evt) {
		window.plugins.iAdPlugin.showAd(true);
	},
	showAd: function(enabled) {
		window.plugins.iAdPlugin.showAd(enabled);
	}
});

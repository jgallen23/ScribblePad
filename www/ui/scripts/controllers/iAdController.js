var iAdController = Class.extend({
	init: function() {
		var self = this;

		document.addEventListener('orientationChanged', function(e) { self._orientationChanged(e); }, false);

		document.addEventListener("iAdBannerViewDidLoadAdEvent", function() { self._iAdBannerViewDidLoadAdEventHandler(); }, false);
		// listen for the "iAdBannerViewDidFailToReceiveAdWithErrorEvent" that is sent by the iAdPlugin
		document.addEventListener("iAdBannerViewDidFailToReceiveAdWithErrorEvent", function() { self._iAdBannerViewDidFailToReceiveAdWithErrorEventHandler(); }, false);
		
		var adAtBottom = true; 
		setTimeout(function() {
			window.plugins.iAdPlugin.prepare(adAtBottom); // by default, ad is at Top
		}, 1000);

	},
	_orientationChanged: function(e) {
		plugins.iAdPlugin.showAd(false);
		return;
		if (e.orientation == 90 || e.orientation == -90) {
			plugins.iAdPlugin.showAd(false);
		} else {
			setTimeout(function() {
				plugins.iAdPlugin.showAd(true);
			}, 2000);
		}
	},
	_iAdBannerViewDidFailToReceiveAdWithErrorEventHandler: function(evt) {
		debug.log(evt.error);
		window.plugins.iAdPlugin.showAd(false);
	},
	_iAdBannerViewDidLoadAdEventHandler: function(evt) {
		debug.log("Ad Loaded");
		window.plugins.iAdPlugin.showAd(true);
	},
	showAd: function(enabled) {
		window.plugins.iAdPlugin.showAd(enabled);
	}
});

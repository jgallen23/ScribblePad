function PreferencesManager() { } 

PreferencesManager.prototype.callback = function(key, value) {
  console.log("callback");
  this.__callback(key, value);
};

PreferencesManager.prototype.boolForKey = function(key, callback) {
  this.__callback = callback;
  PhoneGap.exec("Preferences.boolForKey", key);
};

PreferencesManager.prototype.stringForKey = function(key, callback) {
  this.__callback = callback;
  PhoneGap.exec("Preferences.stringForKey", key);
};

PreferencesManager.prototype.setBoolForKey = function(key, value) {
  PhoneGap.exec("Preferences.setBoolForKey", key, value.toString());
};

PreferencesManager.prototype.setStringForKey = function(key, value) {
  PhoneGap.exec("Preferences.setStringForKey", key, value.toString());
};

PhoneGap.addConstructor(function() {
  if(!window.plugins) {
    window.plugins = {};
  }
  window.plugins.preferences = new PreferencesManager();
});

function PreferencesManager()
{
}

PreferencesManager.prototype.boolForKey = function(key, callback)
{
	PhoneGap.exec("Preferences.boolForKey", key, GetFunctionName(callback));
}

PreferencesManager.prototype.stringForKey = function(key, callback)
{
	PhoneGap.exec("Preferences.stringForKey", key, GetFunctionName(callback));
}

PreferencesManager.prototype.setBoolForKey = function(key, value)
{
	PhoneGap.exec("Preferences.setBoolForKey", key, value.toString());
}

PreferencesManager.prototype.setStringForKey = function(key, value)
{
	PhoneGap.exec("Preferences.setStringForKey", key, value.toString());
}

PhoneGap.addConstructor(function() 
{
	if(!window.plugins)
	{
		window.plugins = {};
	}
    window.plugins.preferences = new PreferencesManager();
});

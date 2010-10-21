//
//  ApplicationStatus.m
//  ScribblePad
//
//  Created by Gregamel on 8/26/10.
//  Copyright 2010 Boeing. All rights reserved.
//

#import "ApplicationStatus.h"


@implementation ApplicationStatus

@synthesize webview = _webview;

- (id)init {
	if (self = [super init]) {
		[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationDidBecomeActive:) name:UIApplicationDidBecomeActiveNotification object:nil];
	}
	return self;
}


- (void)applicationDidBecomeActive:(NSNotification*)notification {
	NSMutableString *jsCallback = [NSMutableString stringWithFormat:@"(function(){ "
								   "setTimeout(function() {"
								   "var e = document.createEvent('Events'); "
								   "e.initEvent('applicationActive'); "
								   "document.dispatchEvent(e); "
								   "}, 500);"
								   "})(); \n"
                                   ];
	[self.webview stringByEvaluatingJavaScriptFromString:jsCallback];
}

- (void)applicationWillEnterForeground:(NSNotification*)notification {
	NSMutableString *jsCallback = [NSMutableString stringWithFormat:@"(function(){ "
								   "setTimeout(function() {"
								   "var e = document.createEvent('Events'); "
								   "e.initEvent('applicationWillEnterForeground'); "
								   "document.dispatchEvent(e); "
								   "}, 1000);"
								   "})(); \n"
                                   ];
	[self.webview stringByEvaluatingJavaScriptFromString:jsCallback];
}

- (void)applicationDidEnterBackground:(NSNotification*)notification {
	/*
	NSMutableString *jsCallback = [NSMutableString stringWithFormat:@"(function(){ "
								   "var e = document.createEvent('Events'); "
								   "e.initEvent('applicationDidEnterBackground', 'false', 'false'); "
								   "document.dispatchEvent(e); "
								   "})(); \n"
                                   ];
	[webView stringByEvaluatingJavaScriptFromString:jsCallback];
	 */
}

- (void)applicationWillTerminate:(NSNotification*)notification {
	NSMutableString *jsCallback = [NSMutableString stringWithFormat:@"(function(){ "
								   "var e = document.createEvent('Events'); "
								   "e.initEvent('applicationWillTerminate', 'false', 'false'); "
								   "document.dispatchEvent(e); "
								   "})(); \n"
                                   ];
	[self.webview stringByEvaluatingJavaScriptFromString:jsCallback];
}

- (void)dealloc {
	[_webview release];
	_webview = nil;
	[[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationDidBecomeActiveNotification object:nil];

	[super dealloc];
}

@end

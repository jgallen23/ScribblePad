//
//  Preferences.m
//  
//
//  Created by shazron on 09-10-01.
//  Copyright 2009 Nitobi Software Inc. All rights reserved.
//

#import "Preferences.h"


@implementation Preferences

- (void) boolForKey:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
	NSUInteger argc = [arguments count];
	if (argc < 2) { // no key and/or callback - just return, no point in continuing
		return;
	}
	
	NSString* key =  [arguments objectAtIndex:0];
	NSString* callback = [arguments objectAtIndex:1];

	NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];  
	BOOL value = [userDefaults boolForKey:key];
	NSString* retVal = value ? @"true" : @"false";
	
	NSString* jsString = [[NSString alloc] initWithFormat:@"%@('%@', %@);", callback, key, retVal];
	[self writeJavascript:jsString];
	[jsString release];
}

- (void) stringForKey:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
	NSUInteger argc = [arguments count];
	if (argc < 2) { // no key and/or callback - just return, no point in continuing
		return;
	}
	
	NSString* key =  [arguments objectAtIndex:0];
	NSString* callback = [arguments objectAtIndex:1];
	
	NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];  
	NSString* retVal = [userDefaults stringForKey:key];
	
	NSString* jsString = [[NSString alloc] initWithFormat:@"%@('%@', '%@');", callback, key, retVal];
    [self writeJavascript:jsString];
	[jsString release];
}


- (void) setBoolForKey:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
	NSUInteger argc = [arguments count];
	
	NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];  
	if (argc >= 2) {
		NSString* key =  [arguments objectAtIndex:0];
		NSString* value = [arguments objectAtIndex:1];
		BOOL boolValue = [value boolValue];
		[userDefaults setBool:boolValue forKey:key]; 
	}
}

- (void) setStringForKey:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
	NSUInteger argc = [arguments count];
	NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];  

	if (argc >= 2) {
		NSString* key =  [arguments objectAtIndex:0];
		NSString* value = [arguments objectAtIndex:1];
		[userDefaults setObject:value forKey:key]; 
	}
}




@end

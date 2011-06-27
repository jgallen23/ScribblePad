//
//  Preferences.h
//  
//
//  Created by shazron on 09-10-01.
//  Copyright 2009 Nitobi Software Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <PhoneGap/PGPlugin.h>

@interface Preferences : PGPlugin {

}

- (void) boolForKey:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) setBoolForKey:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) stringForKey:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) setStringForKey:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;


@end

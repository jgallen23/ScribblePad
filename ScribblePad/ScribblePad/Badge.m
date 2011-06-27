//
//  Badge.m
//
//  Created by Simon Madine on 29/04/2010.
//  Copyright 2010 The Angry Robot Zombie Factory.
//  MIT licensed
//

#import "Badge.h"


@implementation Badge
- (void)setBadge:(NSMutableArray*)badgeNumber withDict:(NSMutableDictionary*)options
{
	int num = [[ badgeNumber objectAtIndex:0] intValue];
	NSLog(@"Badge Set To: %d", num);
	[[UIApplication sharedApplication] setApplicationIconBadgeNumber:num];
}
@end
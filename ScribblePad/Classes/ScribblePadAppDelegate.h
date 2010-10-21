//
//  ScribblePadAppDelegate.h
//  ScribblePad
//
//  Created by Greg Allen on 8/13/10.
//  Copyright __MyCompanyName__ 2010. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "PhoneGapDelegate.h"
#import "ApplicationStatus.h"


@interface ScribblePadAppDelegate : PhoneGapDelegate {
	ApplicationStatus *_applicationStatus;
}

@property (nonatomic, retain) ApplicationStatus *applicationStatus;

@end


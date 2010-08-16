//
//  main.m
//  ScribblePad
//
//  Created by Greg Allen on 8/13/10.
//  Copyright __MyCompanyName__ 2010. All rights reserved.
//

#import <UIKit/UIKit.h>

int main(int argc, char *argv[]) {
    
    NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];
    int retVal = UIApplicationMain(argc, argv, nil, @"ScribblePadAppDelegate");
    [pool release];
    return retVal;
}

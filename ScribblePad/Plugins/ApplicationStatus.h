//
//  ApplicationStatus.h
//  ScribblePad
//
//  Created by Gregamel on 8/26/10.
//  Copyright 2010 Boeing. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ApplicationStatus : NSObject {
	UIWebView *_webview;
}

@property (nonatomic, retain) UIWebView *webview;

- (id)init;
@end

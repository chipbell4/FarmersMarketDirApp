The Farmers' Market Directory App, as presented by 
http://hackforchange.org/challenge/farmers-market-directory-local-and-regional-food-systems
Uses PhoneGap to port JavaScript to Android

All of the android junk has been removed in hopes that PhoneGap build will solve all our
problems. This also keeps a cleaner repository, since there's no need to keep all of that
extra stuff (since some sort of CI server should be able to do this for us, right?).

Things to note:
- This app uses HTML5 WebSQL to store application state (since PhoneGap pretty much sucks at 
	this). However, there are some quota issues that arise for older versions of Android (2.x). 
	To fix this issue would require some shims: 
	[via PhoneGap Source](https://svn.apache.org/repos/asf/incubator/callback/phonegap-android/branches/WebSockets/framework/src/com/phonegap/DroidGap.java) 
	or
	[via a similar shim](http://www.infil00p.org/how-to-implement-html5-storage-on-a-webview-with-android-2-0/). 
	The first option requires using Cordova/PhoneGap to rebuild the project (which I don't really want 
	to mess with) with a new build target (2.2 instead of 4.whatever). The second requires custom Java,
	and mucking about with PhoneGap's internals (yuck). Maybe for another day...

build :
	cordova build android
list :
	$$ANDROID_HOME/emulator/emulator -list-avds
	platforms/android/cordova/lib/list-started-emulators
start_emu :
	$$ANDROID_HOME/emulator/emulator -avd `make list | grep Pixel`
run_emu :
	cordova emulate android --target="emulator-5554"

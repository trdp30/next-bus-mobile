package com.lachit.nextbus

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.views.view.ReactViewManager
import java.util.Collections

class ForegroundServicePackage : ReactPackage {
	// Return a list of native modules that should be available to JavaScript
	override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
		return listOf(ForegroundServiceModule(reactContext))
	}

	// Optional: Return a list of view managers if necessary (in this case, we're not using any)
	override fun createViewManagers(reactContext: ReactApplicationContext): List<ReactViewManager> {
		return Collections.emptyList()
	}
}

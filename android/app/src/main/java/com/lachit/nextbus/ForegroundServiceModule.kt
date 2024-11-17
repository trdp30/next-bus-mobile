package com.lachit.nextbus

import android.content.Context
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ForegroundServiceModule(reactContext: ReactApplicationContext) :
	ReactContextBaseJavaModule(reactContext) {

	override fun getName(): String {
		return "ForegroundServiceModule"
	}

	@ReactMethod
	fun startService() {
		Log.d("startService", "called")
		val context: Context = reactApplicationContext
		val intent = Intent(context, LocationService::class.java)
		intent.action = "START"
		context.startService(intent)
		Log.d("startService", "context called")
	}

	@ReactMethod
	fun stopService() {
		val context: Context = reactApplicationContext
		val intent = Intent(context, LocationService::class.java)
		intent.action = "STOP"
		context.startService(intent)
	}
}

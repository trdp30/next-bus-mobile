package com.lachit.nextbus

import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class JSToNativeExecutionModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    // Override the getName method to return the module name
    override fun getName(): String {
        return "JSToNativeExecutionModule"  // This name is used in React Native
    }

    // Native method which React Native will call for a background task
    @ReactMethod
    fun startBackgroundTask(message: String) {
        Log.d("JSToNativeExecutionModule", "Started background task with message: $message")

        val service = Intent(reactApplicationContext, NativeBackgroundTask::class.java)
        val bundle = Bundle()

        bundle.putString("foo", "bar")

        service.putExtras(bundle)

        reactApplicationContext.startService(service)
    }
}

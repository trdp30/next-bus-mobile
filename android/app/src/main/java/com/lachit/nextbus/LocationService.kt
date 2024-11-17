package com.lachit.nextbus

import android.annotation.SuppressLint
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.location.Location
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.google.android.gms.location.LocationServices
import com.google.firebase.auth.FirebaseAuth
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

class LocationService : Service() {

	private val channelId = "LocationServiceChannel"
	private val notificationId = 1

	override fun onCreate() {
		super.onCreate()
		createNotificationChannel()
	}

	override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
		val action = intent?.action
		if (action == "START") {
			startForegroundService()
			fetchAndPostLocation()
		} else if (action == "STOP") {
			stopSelf()
		}
		return START_STICKY
	}

	@SuppressLint("NewApi")
	private fun createNotificationChannel() {
		val channel = NotificationChannel(
			channelId,
			"Location Service",
			NotificationManager.IMPORTANCE_LOW
		)
		val manager = getSystemService(NotificationManager::class.java)
		manager.createNotificationChannel(channel)
	}

	private fun startForegroundService() {
		val notification: Notification = NotificationCompat.Builder(this, channelId)
			.setContentTitle("Location Service")
			.setContentText("Fetching location in background")
			.setSmallIcon(android.R.drawable.ic_menu_mylocation)
			.build()
		startForeground(notificationId, notification)
	}

//	private fun fetchAndPostLocation() {
//		// Fetch the location here (replace with your own location logic)
//		val location = mapOf("latitude" to 12.34, "longitude" to 56.78)
//
//		// Fetch the Firebase token
//		val firebaseUser = FirebaseAuth.getInstance().currentUser
//		firebaseUser?.getIdToken(true)?.addOnSuccessListener { tokenResult ->
//			val authToken = "Bearer ${tokenResult.token}"
//
//			// Send location to API
//			postLocationToApi(location, authToken)
//		}
//	}
private fun fetchAndPostLocation() {
	// Initialize the FusedLocationProviderClient
	var fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

	try {
		fusedLocationClient.lastLocation.addOnSuccessListener { location: Location? ->
			if (location != null) {
				// Extract properties from the Location object
				val locationDetails: Map<String, Any> = mapOf(
					"latitude" to location.latitude,
					"longitude" to location.longitude,
					"accuracy" to location.accuracy,
					"altitude" to location.altitude,
					"heading" to location.bearing,
					"speed" to location.speed
				)

				// Wrap in the "location" object
				val payload = mapOf("location" to locationDetails)

				// Fetch the Firebase token
				val firebaseUser = FirebaseAuth.getInstance().currentUser
				firebaseUser?.getIdToken(true)?.addOnSuccessListener { tokenResult ->
					val authToken = "Bearer ${tokenResult.token}"

					// Send location to API
					postLocationToApi(payload, authToken)
				}
			} else {
				// Handle case where location is null
				println("Location is null, unable to fetch location data.")
			}
		}
	} catch (e: SecurityException) {
		e.printStackTrace()
		println("Location permission not granted.")
	}
}

//	private fun postLocationToApi(location: Map<String, Double>, authToken: String) {
//		val client = OkHttpClient()
//		val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()
//		val jsonPayload = JSONObject(location).toString()
//		val body: RequestBody = jsonPayload.toRequestBody(mediaType)
//
//		val request = Request.Builder()
//			.url("${BuildConfig.REST_API_ROOT}/${BuildConfig.REST_API_VERSION}/tracker/log/67399831465e3336a3af09f2")
//			.addHeader("Authorization", authToken)
//			.put(body)
//			.build()
//
//		client.newCall(request).execute().use { response ->
//			if (!response.isSuccessful) {
//				// Handle error
//			}
//		}
//	}

	private fun postLocationToApi(location: Map<String, Any>, authToken: String) {
		val client = OkHttpClient()
		val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()

		// Wrap the location map in a "location" key for the payload structure
		val payload = mapOf("location" to location)

		// Convert the payload map to a JSON string
		val jsonPayload = JSONObject(payload).toString()

		val body: RequestBody = jsonPayload.toRequestBody(mediaType)

		val request = Request.Builder()
			.url("${BuildConfig.REST_API_ROOT}/${BuildConfig.REST_API_VERSION}/tracker/log/67399831465e3336a3af09f2")
			.addHeader("Authorization", authToken)
			.put(body)  // Assuming you're making a PUT request
			.build()

		client.newCall(request).execute().use { response ->
			if (!response.isSuccessful) {
				// Handle error
				println("Request failed: ${response.code}")
			}
		}
	}

	override fun onBind(intent: Intent?): IBinder? = null
}

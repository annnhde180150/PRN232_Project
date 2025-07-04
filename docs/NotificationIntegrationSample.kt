// NotificationIntegrationSample.kt
// Sample implementation for Android notification integration

import com.microsoft.signalr.HubConnection
import com.microsoft.signalr.HubConnectionBuilder
import io.reactivex.rxjava3.core.Single
import kotlinx.coroutines.flow.Flow
import retrofit2.Response
import retrofit2.http.*

// 1. Data Models
data class NotificationDetailsDto(
    val notificationId: Long,
    val recipientUserId: Int?,
    val recipientHelperId: Int?,
    val title: String,
    val message: String,
    val notificationType: String?,
    val referenceId: String?,
    val isRead: Boolean?,
    val readTime: String?,
    val creationTime: String?,
    val sentTime: String?
)

data class NotificationCreateDto(
    val recipientUserId: Int?,
    val recipientHelperId: Int?,
    val title: String,
    val message: String,
    val notificationType: String?,
    val referenceId: String?
)

data class ApiResponse<T>(
    val success: Boolean,
    val message: String,
    val data: T?
)

data class UserStatusDto(
    val userId: String,
    val userType: String,
    val isOnline: Boolean
)

// 2. Retrofit API Interface
interface NotificationApiService {
    @GET("api/notification")
    suspend fun getAllNotifications(): Response<ApiResponse<List<NotificationDetailsDto>>>
    
    @GET("api/notification/{id}")
    suspend fun getById(@Path("id") id: Long): Response<ApiResponse<NotificationDetailsDto>>
    
    @POST("api/notification")
    suspend fun createNotification(@Body notification: NotificationCreateDto): Response<ApiResponse<NotificationDetailsDto>>
    
    @GET("api/notification/user/{userId}")
    suspend fun getByUserId(@Path("userId") userId: Int): Response<ApiResponse<List<NotificationDetailsDto>>>
    
    @GET("api/notification/helper/{helperId}")
    suspend fun getByHelperId(@Path("helperId") helperId: Int): Response<ApiResponse<List<NotificationDetailsDto>>>
    
    @GET("api/notification/user/{userId}/unread")
    suspend fun getUnreadByUserId(@Path("userId") userId: Int): Response<ApiResponse<List<NotificationDetailsDto>>>
    
    @GET("api/notification/helper/{helperId}/unread")
    suspend fun getUnreadByHelperId(@Path("helperId") helperId: Int): Response<ApiResponse<List<NotificationDetailsDto>>>
    
    @GET("api/notification/user/{userId}/unread-count")
    suspend fun getUnreadCountByUserId(@Path("userId") userId: Int): Response<ApiResponse<Int>>
    
    @GET("api/notification/helper/{helperId}/unread-count")
    suspend fun getUnreadCountByHelperId(@Path("helperId") helperId: Int): Response<ApiResponse<Int>>
    
    @PATCH("api/notification/{id}/mark-read")
    suspend fun markAsRead(@Path("id") id: Long): Response<ApiResponse<String>>
    
    @PATCH("api/notification/user/{userId}/mark-all-read")
    suspend fun markAllAsReadByUserId(@Path("userId") userId: Int): Response<ApiResponse<String>>
    
    @PATCH("api/notification/helper/{helperId}/mark-all-read")
    suspend fun markAllAsReadByHelperId(@Path("helperId") helperId: Int): Response<ApiResponse<String>>
    
    @DELETE("api/notification/{id}")
    suspend fun deleteNotification(@Path("id") id: Long): Response<ApiResponse<String>>
}

// 3. SignalR Client
class NotificationSignalRClient(
    private val baseUrl: String,
    private val onNotificationReceived: (NotificationDetailsDto) -> Unit,
    private val onUserStatusChanged: (UserStatusDto) -> Unit,
    private val onConnectionStateChanged: (Boolean) -> Unit
) {
    private var hubConnection: HubConnection? = null
    private var isConnected = false
    
    fun connect(authToken: String) {
        try {
            hubConnection = HubConnectionBuilder.create("$baseUrl/notificationHub")
                .withAccessTokenProvider(Single.fromCallable { authToken })
                .build()
            
            setupEventHandlers()
            
            hubConnection?.start()?.subscribe(
                {
                    isConnected = true
                    onConnectionStateChanged(true)
                    android.util.Log.i("SignalR", "Connected successfully")
                },
                { error ->
                    isConnected = false
                    onConnectionStateChanged(false)
                    android.util.Log.e("SignalR", "Connection failed: ${error.message}")
                }
            )
        } catch (e: Exception) {
            android.util.Log.e("SignalR", "Error setting up connection: ${e.message}")
        }
    }
    
    private fun setupEventHandlers() {
        hubConnection?.apply {
            // Handle incoming notifications
            on("ReceiveNotification", 
                { notification: NotificationDetailsDto ->
                    onNotificationReceived(notification)
                }, NotificationDetailsDto::class.java)
            
            // Handle user status changes
            on("UserStatusChanged",
                { status: UserStatusDto ->
                    onUserStatusChanged(status)
                }, UserStatusDto::class.java)
            
            // Handle connection events
            on("Connected", 
                { message: String ->
                    android.util.Log.i("SignalR", "Server says: $message")
                }, String::class.java)
            
            on("Error",
                { error: String ->
                    android.util.Log.e("SignalR", "Server error: $error")
                }, String::class.java)
            
            // Handle connection closed
            onClosed { error ->
                isConnected = false
                onConnectionStateChanged(false)
                if (error != null) {
                    android.util.Log.e("SignalR", "Connection closed with error: ${error.message}")
                    // Implement reconnection logic here
                    reconnectWithBackoff()
                } else {
                    android.util.Log.i("SignalR", "Connection closed normally")
                }
            }
        }
    }
    
    private fun reconnectWithBackoff() {
        // Implement exponential backoff reconnection
        // This is a simplified version
        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            if (!isConnected) {
                android.util.Log.i("SignalR", "Attempting to reconnect...")
                // You would need to store the auth token to reconnect
                // connect(storedAuthToken)
            }
        }, 5000) // Retry after 5 seconds
    }
    
    fun disconnect() {
        hubConnection?.stop()
        isConnected = false
        onConnectionStateChanged(false)
    }
    
    fun isConnected(): Boolean = isConnected
    
    // Method to join conversation room
    fun joinConversation(conversationId: String) {
        if (isConnected) {
            hubConnection?.invoke("JoinConversation", conversationId)
        }
    }
    
    // Method to send notification to specific user
    fun sendNotificationToUser(targetUserId: String, userType: String, notification: Any) {
        if (isConnected) {
            hubConnection?.invoke("SendNotificationToUser", targetUserId, userType, notification)
        }
    }
}

// 4. Repository
class NotificationRepository(
    private val apiService: NotificationApiService,
    private val signalRClient: NotificationSignalRClient
) {
    
    suspend fun getAllNotifications(): Result<List<NotificationDetailsDto>> {
        return try {
            val response = apiService.getAllNotifications()
            if (response.isSuccessful && response.body()?.success == true) {
                Result.success(response.body()?.data ?: emptyList())
            } else {
                Result.failure(Exception("Failed to fetch notifications: ${response.body()?.message}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getNotificationsByUserId(userId: Int): Result<List<NotificationDetailsDto>> {
        return try {
            val response = apiService.getByUserId(userId)
            if (response.isSuccessful && response.body()?.success == true) {
                Result.success(response.body()?.data ?: emptyList())
            } else {
                Result.failure(Exception("Failed to fetch user notifications: ${response.body()?.message}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getUnreadNotifications(userId: Int): Result<List<NotificationDetailsDto>> {
        return try {
            val response = apiService.getUnreadByUserId(userId)
            if (response.isSuccessful && response.body()?.success == true) {
                Result.success(response.body()?.data ?: emptyList())
            } else {
                Result.failure(Exception("Failed to fetch unread notifications: ${response.body()?.message}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getUnreadCount(userId: Int): Result<Int> {
        return try {
            val response = apiService.getUnreadCountByUserId(userId)
            if (response.isSuccessful && response.body()?.success == true) {
                Result.success(response.body()?.data ?: 0)
            } else {
                Result.failure(Exception("Failed to fetch unread count: ${response.body()?.message}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun markAsRead(notificationId: Long): Result<Boolean> {
        return try {
            val response = apiService.markAsRead(notificationId)
            if (response.isSuccessful && response.body()?.success == true) {
                Result.success(true)
            } else {
                Result.failure(Exception("Failed to mark as read: ${response.body()?.message}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun markAllAsRead(userId: Int): Result<Boolean> {
        return try {
            val response = apiService.markAllAsReadByUserId(userId)
            if (response.isSuccessful && response.body()?.success == true) {
                Result.success(true)
            } else {
                Result.failure(Exception("Failed to mark all as read: ${response.body()?.message}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun createNotification(notification: NotificationCreateDto): Result<NotificationDetailsDto> {
        return try {
            val response = apiService.createNotification(notification)
            if (response.isSuccessful && response.body()?.success == true) {
                Result.success(response.body()?.data!!)
            } else {
                Result.failure(Exception("Failed to create notification: ${response.body()?.message}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    fun connectRealtime(authToken: String) {
        signalRClient.connect(authToken)
    }
    
    fun disconnectRealtime() {
        signalRClient.disconnect()
    }
    
    fun isRealtimeConnected(): Boolean = signalRClient.isConnected()
}

// 5. Use Case / Service Layer
class NotificationService(
    private val repository: NotificationRepository,
    private val userPreferences: UserPreferences // Assume this exists for storing user data
) {
    
    suspend fun loadUserNotifications(): Result<List<NotificationDetailsDto>> {
        val userId = userPreferences.getCurrentUserId()
        return repository.getNotificationsByUserId(userId)
    }
    
    suspend fun loadUnreadNotifications(): Result<List<NotificationDetailsDto>> {
        val userId = userPreferences.getCurrentUserId()
        return repository.getUnreadNotifications(userId)
    }
    
    suspend fun getUnreadCount(): Result<Int> {
        val userId = userPreferences.getCurrentUserId()
        return repository.getUnreadCount(userId)
    }
    
    suspend fun markNotificationAsRead(notificationId: Long): Result<Boolean> {
        return repository.markAsRead(notificationId)
    }
    
    suspend fun markAllNotificationsAsRead(): Result<Boolean> {
        val userId = userPreferences.getCurrentUserId()
        return repository.markAllAsRead(userId)
    }
    
    fun startRealtimeNotifications() {
        val authToken = userPreferences.getAuthToken()
        if (authToken.isNotEmpty()) {
            repository.connectRealtime(authToken)
        }
    }
    
    fun stopRealtimeNotifications() {
        repository.disconnectRealtime()
    }
    
    fun isRealtimeConnected(): Boolean = repository.isRealtimeConnected()
}

// 6. Sample UserPreferences interface (you need to implement this)
interface UserPreferences {
    fun getCurrentUserId(): Int
    fun getAuthToken(): String
    fun getCurrentUserType(): String // "User" or "Helper"
}

// 7. Sample usage in Activity/Fragment
/*
class NotificationActivity : AppCompatActivity() {
    private lateinit var notificationService: NotificationService
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize notification service
        setupNotificationService()
        
        // Start realtime connection
        notificationService.startRealtimeNotifications()
        
        // Load notifications
        loadNotifications()
    }
    
    private fun setupNotificationService() {
        val signalRClient = NotificationSignalRClient(
            baseUrl = "https://your-api-domain.com",
            onNotificationReceived = { notification ->
                // Handle new notification
                runOnUiThread {
                    showNotification(notification)
                    refreshNotificationList()
                }
            },
            onUserStatusChanged = { status ->
                // Handle user status change
                runOnUiThread {
                    updateUserStatus(status)
                }
            },
            onConnectionStateChanged = { isConnected ->
                // Handle connection state change
                runOnUiThread {
                    updateConnectionStatus(isConnected)
                }
            }
        )
        
        val repository = NotificationRepository(apiService, signalRClient)
        notificationService = NotificationService(repository, userPreferences)
    }
    
    private fun loadNotifications() {
        lifecycleScope.launch {
            notificationService.loadUserNotifications().fold(
                onSuccess = { notifications ->
                    // Update UI with notifications
                    updateNotificationList(notifications)
                },
                onFailure = { error ->
                    // Handle error
                    showError(error.message)
                }
            )
        }
    }
    
    override fun onDestroy() {
        super.onDestroy()
        notificationService.stopRealtimeNotifications()
    }
}
*/

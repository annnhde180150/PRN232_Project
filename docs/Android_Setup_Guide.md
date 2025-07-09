# Android Setup Guide - Notification System Integration

## 1. Dependencies Setup

### 1.1 Module-level build.gradle (app/build.gradle)

```gradle
android {
    compileSdk 34
    
    defaultConfig {
        minSdk 24
        targetSdk 34
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    
    kotlinOptions {
        jvmTarget = '1.8'
    }
}

dependencies {
    // Core Android
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.7.0'
    implementation 'androidx.activity:activity-compose:1.8.2'
    
    // Coroutines
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
    
    // Networking
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.12.0'
    
    // SignalR
    implementation 'com.microsoft.signalr:signalr:7.0.0'
    implementation 'io.reactivex.rxjava3:rxjava:3.1.8'
    implementation 'io.reactivex.rxjava3:rxandroid:3.0.2'
    
    // JSON Processing
    implementation 'com.google.code.gson:gson:2.10.1'
    
    // Dependency Injection (Optional - Hilt)
    implementation 'com.google.dagger:hilt-android:2.48'
    kapt 'com.google.dagger:hilt-compiler:2.48'
    
    // Room Database (for local caching)
    implementation 'androidx.room:room-runtime:2.6.1'
    implementation 'androidx.room:room-ktx:2.6.1'
    kapt 'androidx.room:room-compiler:2.6.1'
    
    // ViewModel and LiveData
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0'
    implementation 'androidx.lifecycle:lifecycle-livedata-ktx:2.7.0'
    
    // Work Manager (for background sync)
    implementation 'androidx.work:work-runtime-ktx:2.9.0'
    
    // Notification
    implementation 'androidx.core:core-ktx:1.12.0'
}
```

### 1.2 Project-level build.gradle

```gradle
buildscript {
    dependencies {
        classpath 'com.google.dagger:hilt-android-gradle-plugin:2.48'
    }
}

plugins {
    id 'kotlin-kapt'
    id 'dagger.hilt.android.plugin'
}
```

## 2. Permissions

### 2.1 AndroidManifest.xml

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Network permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Notification permissions (Android 13+) -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    
    <!-- Wake lock for background processing -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    
    <application
        android:name=".MyApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme">
        
        <!-- Activities -->
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
        <!-- Notification Service -->
        <service
            android:name=".services.NotificationBackgroundService"
            android:enabled="true"
            android:exported="false" />
            
        <!-- Work Manager -->
        <provider
            android:name="androidx.startup.InitializationProvider"
            android:authorities="${applicationId}.androidx-startup"
            android:exported="false"
            tools:node="merge">
            <meta-data
                android:name="androidx.work.WorkManagerInitializer"
                android:value="androidx.startup" />
        </provider>
        
    </application>
</manifest>
```

## 3. Network Configuration

### 3.1 Network Security Config (network_security_config.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">your-api-domain.com</domain>
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
</network-security-config>
```

Add to AndroidManifest.xml application tag:
```xml
<application
    android:networkSecurityConfig="@xml/network_security_config">
```

### 3.2 API Configuration

```kotlin
// ApiConfig.kt
object ApiConfig {
    const val BASE_URL = "https://your-api-domain.com/"
    const val SIGNALR_HUB_URL = "${BASE_URL}notificationHub"
    const val CONNECT_TIMEOUT = 30L
    const val READ_TIMEOUT = 30L
    const val WRITE_TIMEOUT = 30L
}

// NetworkModule.kt (Hilt)
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(ApiConfig.CONNECT_TIMEOUT, TimeUnit.SECONDS)
            .readTimeout(ApiConfig.READ_TIMEOUT, TimeUnit.SECONDS)
            .writeTimeout(ApiConfig.WRITE_TIMEOUT, TimeUnit.SECONDS)
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = if (BuildConfig.DEBUG) {
                    HttpLoggingInterceptor.Level.BODY
                } else {
                    HttpLoggingInterceptor.Level.NONE
                }
            })
            .addInterceptor { chain ->
                val request = chain.request().newBuilder()
                    .addHeader("Content-Type", "application/json")
                    .build()
                chain.proceed(request)
            }
            .build()
    }
    
    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl(ApiConfig.BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    
    @Provides
    @Singleton
    fun provideNotificationApiService(retrofit: Retrofit): NotificationApiService {
        return retrofit.create(NotificationApiService::class.java)
    }
}
```

## 4. Local Database Setup (Room)

### 4.1 Entity

```kotlin
@Entity(tableName = "notifications")
data class NotificationEntity(
    @PrimaryKey val notificationId: Long,
    val recipientUserId: Int?,
    val recipientHelperId: Int?,
    val title: String,
    val message: String,
    val notificationType: String?,
    val referenceId: String?,
    val isRead: Boolean?,
    val readTime: String?,
    val creationTime: String?,
    val sentTime: String?,
    val syncStatus: String = "SYNCED" // SYNCED, PENDING, FAILED
)
```

### 4.2 DAO

```kotlin
@Dao
interface NotificationDao {
    @Query("SELECT * FROM notifications ORDER BY creationTime DESC")
    fun getAllNotifications(): Flow<List<NotificationEntity>>
    
    @Query("SELECT * FROM notifications WHERE isRead = 0 ORDER BY creationTime DESC")
    fun getUnreadNotifications(): Flow<List<NotificationEntity>>
    
    @Query("SELECT COUNT(*) FROM notifications WHERE isRead = 0")
    fun getUnreadCount(): Flow<Int>
    
    @Query("SELECT * FROM notifications WHERE notificationId = :id")
    suspend fun getById(id: Long): NotificationEntity?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(notifications: List<NotificationEntity>)
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(notification: NotificationEntity)
    
    @Update
    suspend fun update(notification: NotificationEntity)
    
    @Query("UPDATE notifications SET isRead = 1, readTime = :readTime WHERE notificationId = :id")
    suspend fun markAsRead(id: Long, readTime: String)
    
    @Query("UPDATE notifications SET isRead = 1, readTime = :readTime WHERE isRead = 0")
    suspend fun markAllAsRead(readTime: String)
    
    @Query("DELETE FROM notifications WHERE notificationId = :id")
    suspend fun deleteById(id: Long)
    
    @Query("DELETE FROM notifications")
    suspend fun deleteAll()
}
```

### 4.3 Database

```kotlin
@Database(
    entities = [NotificationEntity::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun notificationDao(): NotificationDao
}

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    
    @Provides
    @Singleton
    fun provideAppDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "app_database"
        ).build()
    }
    
    @Provides
    fun provideNotificationDao(database: AppDatabase): NotificationDao {
        return database.notificationDao()
    }
}
```

## 5. Notification Channel Setup

### 5.1 Notification Manager

```kotlin
class NotificationChannelManager(private val context: Context) {
    
    companion object {
        const val CHANNEL_ID_GENERAL = "general_notifications"
        const val CHANNEL_ID_MESSAGES = "message_notifications"
        const val CHANNEL_ID_BOOKINGS = "booking_notifications"
        const val CHANNEL_ID_SYSTEM = "system_notifications"
    }
    
    fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channels = listOf(
                NotificationChannel(
                    CHANNEL_ID_GENERAL,
                    "General Notifications",
                    NotificationManager.IMPORTANCE_DEFAULT
                ).apply {
                    description = "General app notifications"
                },
                NotificationChannel(
                    CHANNEL_ID_MESSAGES,
                    "Messages",
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "New message notifications"
                    enableVibration(true)
                    setShowBadge(true)
                },
                NotificationChannel(
                    CHANNEL_ID_BOOKINGS,
                    "Bookings",
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "Booking related notifications"
                    enableVibration(true)
                    setShowBadge(true)
                },
                NotificationChannel(
                    CHANNEL_ID_SYSTEM,
                    "System",
                    NotificationManager.IMPORTANCE_LOW
                ).apply {
                    description = "System notifications"
                }
            )
            
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            channels.forEach { channel ->
                notificationManager.createNotificationChannel(channel)
            }
        }
    }
    
    fun showNotification(notification: NotificationDetailsDto) {
        val channelId = getChannelIdForType(notification.notificationType)
        
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            putExtra("notification_id", notification.notificationId)
        }
        
        val pendingIntent = PendingIntent.getActivity(
            context, 
            notification.notificationId.toInt(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        val builder = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(notification.title)
            .setContentText(notification.message)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setStyle(NotificationCompat.BigTextStyle().bigText(notification.message))
        
        val notificationManager = NotificationManagerCompat.from(context)
        if (ActivityCompat.checkSelfPermission(
                context,
                Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            notificationManager.notify(notification.notificationId.toInt(), builder.build())
        }
    }
    
    private fun getChannelIdForType(type: String?): String {
        return when (type?.uppercase()) {
            "MESSAGE" -> CHANNEL_ID_MESSAGES
            "BOOKING" -> CHANNEL_ID_BOOKINGS
            "SYSTEM" -> CHANNEL_ID_SYSTEM
            else -> CHANNEL_ID_GENERAL
        }
    }
}
```

## 6. Application Class Setup

```kotlin
@HiltAndroidApp
class MyApplication : Application() {
    
    override fun onCreate() {
        super.onCreate()
        
        // Initialize notification channels
        NotificationChannelManager(this).createNotificationChannels()
        
        // Initialize other components
        setupWorkManager()
    }
    
    private fun setupWorkManager() {
        val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()
            
        val syncWork = PeriodicWorkRequestBuilder<NotificationSyncWorker>(15, TimeUnit.MINUTES)
            .setConstraints(constraints)
            .build()
            
        WorkManager.getInstance(this).enqueueUniquePeriodicWork(
            "notification_sync",
            ExistingPeriodicWorkPolicy.KEEP,
            syncWork
        )
    }
}
```

## 7. Background Sync Worker

```kotlin
@HiltWorker
class NotificationSyncWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted workerParams: WorkerParameters,
    private val notificationRepository: NotificationRepository,
    private val userPreferences: UserPreferences
) : CoroutineWorker(context, workerParams) {
    
    override suspend fun doWork(): Result {
        return try {
            val userId = userPreferences.getCurrentUserId()
            if (userId > 0) {
                notificationRepository.syncNotifications(userId)
                Result.success()
            } else {
                Result.failure()
            }
        } catch (e: Exception) {
            Log.e("NotificationSync", "Sync failed", e)
            Result.retry()
        }
    }
    
    @AssistedFactory
    interface Factory {
        fun create(context: Context, params: WorkerParameters): NotificationSyncWorker
    }
}
```

## 8. Proguard Rules (proguard-rules.pro)

```proguard
# SignalR
-keep class com.microsoft.signalr.** { *; }
-keep class io.reactivex.rxjava3.** { *; }

# Gson
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapter
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# Your DTOs
-keep class your.package.name.dto.** { *; }

# Retrofit
-keepattributes Signature, InnerClasses, EnclosingMethod
-keepattributes RuntimeVisibleAnnotations, RuntimeVisibleParameterAnnotations
-keepclassmembers,allowshrinking,allowobfuscation interface * {
    @retrofit2.http.* <methods>;
}
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
-dontwarn javax.annotation.**
-dontwarn kotlin.Unit
-dontwarn retrofit2.KotlinExtensions
-dontwarn retrofit2.KotlinExtensions$*
```

## 9. Testing Setup

### 9.1 Test Dependencies

```gradle
testImplementation 'junit:junit:4.13.2'
testImplementation 'org.mockito:mockito-core:5.7.0'
testImplementation 'org.mockito.kotlin:mockito-kotlin:5.2.1'
testImplementation 'org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3'
testImplementation 'androidx.arch.core:core-testing:2.2.0'

androidTestImplementation 'androidx.test.ext:junit:1.1.5'
androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
androidTestImplementation 'com.squareup.okhttp3:mockwebserver:4.12.0'
```

### 9.2 Sample Test

```kotlin
@RunWith(MockitoJUnitRunner::class)
class NotificationRepositoryTest {
    
    @Mock
    private lateinit var apiService: NotificationApiService
    
    @Mock
    private lateinit var signalRClient: NotificationSignalRClient
    
    private lateinit var repository: NotificationRepository
    
    @Before
    fun setup() {
        repository = NotificationRepository(apiService, signalRClient)
    }
    
    @Test
    fun `getUnreadCount should return success when API call succeeds`() = runTest {
        // Given
        val userId = 123
        val expectedCount = 5
        val response = Response.success(ApiResponse(true, "Success", expectedCount))
        whenever(apiService.getUnreadCountByUserId(userId)).thenReturn(response)
        
        // When
        val result = repository.getUnreadCount(userId)
        
        // Then
        assertTrue(result.isSuccess)
        assertEquals(expectedCount, result.getOrNull())
    }
}
```

Với setup này, bạn đã có đầy đủ cấu hình cần thiết để tích hợp hệ thống thông báo vào ứng dụng Android.

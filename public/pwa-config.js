// PWA Configuration and Constants
export const PWA_CONFIG = {
  CACHE_VERSION: "v1.0.4",
  APP_NAME: "QuitTracker",
  CACHE_NAMES: {
    STATIC: "quittracker-static-v1.0.4",
    DYNAMIC: "quittracker-dynamic-v1.0.4",
  },
  UPDATE_CHECK_INTERVAL: 30 * 60 * 1000, // 30 minutes
  NOTIFICATION_AUTO_HIDE_DELAY: 30000, // 30 seconds
  STATIC_FILES: [
    "/",
    "/manifest.json",
    "/logo.png",
    "/favicon.ico",
    "/icon-192.png",
    "/icon-512.png",
  ],
};

export const OFFLINE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuitTracker - Offline</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container { 
            text-align: center; 
            max-width: 400px;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .title { 
            font-size: 24px; 
            font-weight: bold; 
            color: #111827; 
            margin-bottom: 16px; 
        }
        .message { 
            color: #6b7280; 
            margin-bottom: 24px;
            line-height: 1.5;
        }
        .button {
            background: #16a34a;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .button:hover {
            background: #15803d;
        }
        .offline-indicator {
            background: #fbbf24;
            color: #92400e;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            margin-bottom: 20px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="offline-indicator">📱 Offline Mode</div>
        <div class="title">QuitTracker</div>
        <div class="message">
            You're currently offline, but your data is safely stored locally. 
            The app will work normally once you're back online.
        </div>
        <button class="button" onclick="window.location.reload()">
            Try Again
        </button>
    </div>
    <script>
        // Check if online and reload
        window.addEventListener('online', () => {
            window.location.reload();
        });
        
        // Load cached data if available
        if (localStorage.getItem('quitTrackerItems')) {
            document.querySelector('.message').innerHTML = 
                'Your quit tracking data is available offline. The app will sync when you reconnect.';
        }
    </script>
</body>
</html>
`;

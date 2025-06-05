// PWA Manager - Handles all PWA related functionality
class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.updateInterval = null;
    this.init();
  }

  init() {
    if ("serviceWorker" in navigator) {
      this.registerServiceWorker();
      this.setupEventListeners();
      this.startUpdateChecker();
      this.checkInstallStatus();
      this.debugManifest();
    }
  }

  // Service Worker Registration
  registerServiceWorker() {
    const isProduction =
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1" &&
      !window.location.hostname.includes("vercel.app") &&
      window.location.protocol === "https:";

    if (isProduction || localStorage.getItem("force-sw") === "true") {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("✅ SW registered successfully");
            console.log("📍 Scope: ", registration.scope);

            registration.addEventListener("updatefound", () => {
              console.log("🔄 SW update found");
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "installed") {
                    console.log("🆕 New content available");
                    if (navigator.serviceWorker.controller) {
                      this.showUpdateNotification();
                    }
                  }
                });
              }
            });
          })
          .catch((registrationError) => {
            console.error("❌ SW registration failed: ", registrationError);
          });
      });
    } else {
      console.log("🔧 Development mode - Service Worker registration skipped");
      console.log(
        '💡 To force SW in dev: localStorage.setItem("force-sw", "true") and reload'
      );

      // Unregister existing service workers in development
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
          registration.unregister();
          console.log("🗑️ Unregistered existing SW");
        }
      });
    }
  }

  // Event Listeners Setup
  setupEventListeners() {
    // Service worker messages
    navigator.serviceWorker.addEventListener("message", (event) => {
      console.log("📨 SW message:", event.data);
    });

    // Service worker controller change
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("🔄 SW controller changed - reloading page");
      window.location.reload();
    });

    // PWA install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("🚀 beforeinstallprompt fired");
      e.preventDefault();
      this.deferredPrompt = e;
      window.dispatchEvent(
        new CustomEvent("pwa-install-available", { detail: e })
      );
    });

    // PWA installed
    window.addEventListener("appinstalled", () => {
      console.log("✅ PWA installed successfully");
      this.deferredPrompt = null;
      window.dispatchEvent(new CustomEvent("pwa-installed"));
    });

    // Network status
    window.addEventListener("online", () => {
      console.log("🌐 Back online");
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "NETWORK_ONLINE",
        });
      }
    });

    window.addEventListener("offline", () => {
      console.log("📱 Gone offline");
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "NETWORK_OFFLINE",
        });
      }
    });

    // Page visibility change
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (this.updateInterval) clearInterval(this.updateInterval);
      } else {
        this.startUpdateChecker();
      }
    });
  }

  // Update Management
  checkForUpdates() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update();
          console.log("🔄 Manually checking for updates...");
        }
      });
    }
  }

  startUpdateChecker() {
    this.updateInterval = setInterval(() => {
      if (!document.hidden) {
        this.checkForUpdates();
      }
    }, 30 * 60 * 1000); // 30 minutes
  }

  // Install Status Check
  checkInstallStatus() {
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isInWebAppiOS = window.navigator.standalone === true;
    const isInstalled = isStandalone || isInWebAppiOS;

    if (isInstalled) {
      window.dispatchEvent(new CustomEvent("pwa-already-installed"));
    }

    return isInstalled;
  }

  // Update Notification
  showUpdateNotification() {
    // Remove existing update banners
    const existingBanner = document.querySelector(".update-banner");
    if (existingBanner) {
      existingBanner.remove();
    }

    // Create update notification
    const updateBanner = document.createElement("div");
    updateBanner.className = "update-banner";
    updateBanner.innerHTML = `
      <div style="
        position: fixed; 
        top: 20px; 
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
        color: white; 
        padding: 16px 24px; 
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(22, 163, 74, 0.4);
        z-index: 10000;
        font-family: system-ui, -apple-system, sans-serif;
        max-width: 400px;
        width: 90%;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        animation: slideDown 0.3s ease-out;
      ">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 20px;">🆕</div>
          <div style="flex: 1;">
            <div style="font-weight: 600; margin-bottom: 4px;">New version available!</div>
            <div style="font-size: 14px; opacity: 0.9;">Update now to get the latest features and improvements.</div>
          </div>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 12px;">
          <button onclick="window.location.reload()" style="
            background: white; 
            color: #16a34a; 
            border: none; 
            padding: 8px 16px; 
            border-radius: 6px; 
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Update Now
          </button>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
            background: transparent; 
            color: white; 
            border: 1px solid rgba(255, 255, 255, 0.3); 
            padding: 8px 16px; 
            border-radius: 6px; 
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          " onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.1)'" onmouseout="this.style.backgroundColor='transparent'">
            Later
          </button>
        </div>
      </div>
    `;

    // Add CSS animation
    if (!document.querySelector("#pwa-animations")) {
      const style = document.createElement("style");
      style.id = "pwa-animations";
      style.textContent = `
        @keyframes slideDown {
          from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(updateBanner);

    // Auto-hide after 30 seconds
    setTimeout(() => {
      if (updateBanner.parentElement) {
        updateBanner.style.animation = "slideDown 0.3s ease-out reverse";
        setTimeout(() => updateBanner.remove(), 300);
      }
    }, 30000);
  }

  // Debug Manifest
  debugManifest() {
    fetch("/manifest.json")
      .then((response) => {
        if (response.ok) {
          console.log("✅ Manifest loaded successfully");
          return response.json();
        }
        throw new Error("Manifest load failed");
      })
      .then((manifest) => {
        console.log("📋 Manifest content:", manifest);
      })
      .catch((error) => {
        console.error("❌ Manifest error:", error);
      });
  }

  // Public API
  install() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        this.deferredPrompt = null;
      });
    }
  }

  getInstallStatus() {
    return this.checkInstallStatus();
  }
}

// Initialize PWA Manager
window.pwaManager = new PWAManager();

// Expose useful functions globally
window.checkForUpdates = () => window.pwaManager.checkForUpdates();
window.installPWA = () => window.pwaManager.install();

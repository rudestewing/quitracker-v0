// Development Cache Clear Utility
// This script helps clear all caches during development

class DevCacheClear {
  constructor() {
    this.init();
  }

  init() {
    if (this.isDevelopment()) {
      console.log("🧹 Development Cache Clear Utility Loaded");
      // this.clearAllCaches();
      // this.setupHotkeys();
      // this.addClearButton();
    }
  }

  isDevelopment() {
    return (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.port === "3000" ||
      window.location.hostname.includes("dev") ||
      window.location.hostname.includes("local")
    );
  }

  async clearAllCaches() {
    try {
      // Clear Cache API
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        console.log("🧹 Clearing Cache API caches:", cacheNames);
        await Promise.all(
          cacheNames.map((cacheName) => {
            console.log("❌ Deleting cache:", cacheName);
            return caches.delete(cacheName);
          })
        );
      }

      // Clear localStorage
      console.log("🧹 Clearing localStorage");
      localStorage.clear();

      // Clear sessionStorage
      console.log("🧹 Clearing sessionStorage");
      sessionStorage.clear();

      // Clear IndexedDB (basic)
      if ("indexedDB" in window) {
        console.log("🧹 Attempting to clear IndexedDB");
        // This is a simplified clear - in practice you'd need to know the DB names
      }

      console.log("✅ All development caches cleared!");

      // Show notification
      this.showNotification("Development caches cleared! 🧹");
    } catch (error) {
      console.error("❌ Error clearing caches:", error);
    }
  }

  setupHotkeys() {
    document.addEventListener("keydown", (event) => {
      // Ctrl+Shift+R for hard refresh + cache clear
      if (event.ctrlKey && event.shiftKey && event.key === "R") {
        event.preventDefault();
        console.log("🔄 Hard refresh + cache clear triggered");
        this.clearAllCaches().then(() => {
          window.location.reload(true);
        });
      }

      // Ctrl+Shift+C for cache clear only
      if (event.ctrlKey && event.shiftKey && event.key === "C") {
        event.preventDefault();
        console.log("🧹 Manual cache clear triggered");
        this.clearAllCaches();
      }
    });
  }

  addClearButton() {
    // Add a floating clear cache button for development
    const button = document.createElement("button");
    button.innerHTML = "🧹";
    button.title = "Clear Development Caches (Ctrl+Shift+C)";
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      background: #ff4444;
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      transition: all 0.2s ease;
    `;

    button.addEventListener("mouseenter", () => {
      button.style.transform = "scale(1.1)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "scale(1)";
    });

    button.addEventListener("click", () => {
      this.clearAllCaches();
    });

    document.body.appendChild(button);

    // Hide button after 10 seconds, show on hover over corner
    setTimeout(() => {
      button.style.opacity = "0.3";
      button.style.transform = "scale(0.8)";
    }, 10000);

    // Show on hover over top-right corner
    const cornerZone = document.createElement("div");
    cornerZone.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      z-index: 9998;
    `;

    cornerZone.addEventListener("mouseenter", () => {
      button.style.opacity = "1";
      button.style.transform = "scale(1)";
    });

    document.body.appendChild(cornerZone);
  }

  showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease-out;
    `;

    // Add CSS animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = "slideIn 0.3s ease-out reverse";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Method to manually unregister service worker
  async unregisterServiceWorker() {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log("🧹 Unregistering service workers:", registrations.length);

      for (const registration of registrations) {
        console.log("❌ Unregistering SW:", registration.scope);
        await registration.unregister();
      }

      this.showNotification("Service Workers unregistered! 🔄");
    }
  }
}

// Auto-initialize in development
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.devCacheClear = new DevCacheClear();
  });
} else {
  window.devCacheClear = new DevCacheClear();
}

// Make it globally available for console use
window.clearDevCaches = () => {
  if (window.devCacheClear) {
    window.devCacheClear.clearAllCaches();
  }
};

window.unregisterSW = () => {
  if (window.devCacheClear) {
    window.devCacheClear.unregisterServiceWorker();
  }
};

console.log("🛠️ Development Cache Utilities:");
console.log("  - clearDevCaches() - Clear all caches");
console.log("  - unregisterSW() - Unregister service workers");
console.log("  - Ctrl+Shift+C - Clear caches");
console.log("  - Ctrl+Shift+R - Clear caches + hard reload");

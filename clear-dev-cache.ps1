# PowerShell script to clear all development caches for QuitTracker
Write-Host "🧹 QuitTracker Development Cache Clear" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Clear Next.js cache
Write-Host "`n1. Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item ".next" -Recurse -Force
    Write-Host "   ✅ .next directory cleared" -ForegroundColor Green
} else {
    Write-Host "   ℹ️ No .next directory found" -ForegroundColor Blue
}

# Clear node_modules/.cache if it exists
Write-Host "`n2. Clearing node_modules cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.cache") {
    Remove-Item "node_modules\.cache" -Recurse -Force
    Write-Host "   ✅ node_modules/.cache cleared" -ForegroundColor Green
} else {
    Write-Host "   ℹ️ No node_modules/.cache found" -ForegroundColor Blue
}

# Clear pnpm cache
Write-Host "`n3. Clearing pnpm cache..." -ForegroundColor Yellow
try {
    pnpm store prune 2>$null
    Write-Host "   ✅ pnpm store pruned" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️ Could not prune pnpm store (not critical)" -ForegroundColor Yellow
}

# Instructions for browser cache
Write-Host "`n4. Browser Cache Instructions:" -ForegroundColor Yellow
Write-Host "   🌐 Open your browser's Developer Tools (F12)" -ForegroundColor White
Write-Host "   🔄 Right-click the refresh button and select 'Empty Cache and Hard Reload'" -ForegroundColor White
Write-Host "   📱 Or use the floating cache clear button in the app (top-right corner)" -ForegroundColor White
Write-Host "   ⌨️ Or press Ctrl+Shift+C in the browser to clear app caches" -ForegroundColor White

# Show service worker instructions
Write-Host "`n5. Service Worker Instructions:" -ForegroundColor Yellow
Write-Host "   🔧 Open DevTools → Application → Service Workers" -ForegroundColor White
Write-Host "   🗑️ Click 'Unregister' for the service worker" -ForegroundColor White
Write-Host "   🧹 Or use the browser console command: unregisterSW()" -ForegroundColor White

Write-Host "`n🎉 Cache clearing complete!" -ForegroundColor Green
Write-Host "💡 Now restart your development server with: pnpm dev:clean" -ForegroundColor Cyan

# Ask if user wants to start dev server
$response = Read-Host "`nWould you like to start the development server now? (y/N)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "`n🚀 Starting development server..." -ForegroundColor Green
    pnpm dev:clean
}

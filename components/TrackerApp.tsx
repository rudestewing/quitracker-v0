"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Calendar, Wifi, WifiOff, Download, Smartphone, Clock, DollarSign } from "lucide-react"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import relativeTime from "dayjs/plugin/relativeTime"

// Extend dayjs with plugins
dayjs.extend(duration)
dayjs.extend(relativeTime)

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface QuitItem {
  id: string
  name: string
  description?: string
  quitDate: string
  benefitType?: "time" | "money"
  benefitAmount?: number // per day
  benefitUnit?: string // for time: "minutes" | "hours", for money: currency symbol
}

interface TimeElapsed {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface BenefitCalculation {
  totalAmount: number
  dailyAmount: number
  unit: string
  type: "time" | "money"
}

export default function QuitTracker() {
  const [items, setItems] = useState<QuitItem[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<QuitItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quitDate: "",
    benefitType: "" as "time" | "money" | "",
    benefitAmount: "",
    benefitUnit: "",
  })
  const [currentTime, setCurrentTime] = useState(dayjs())
  const [isOnline, setIsOnline] = useState(true)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [canInstall, setCanInstall] = useState(false)
  const [swRegistered, setSwRegistered] = useState(false)
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<QuitItem | null>(null)

  // Load items from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem("quitTrackerItems")
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    }
  }, [])

  // Save items to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("quitTrackerItems", JSON.stringify(items))
  }, [items])

  // Update current time every second for live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // PWA and Service Worker detection
  useEffect(() => {
    // Handle online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOnline(navigator.onLine)

    // PWA Install Events
    const handlePWAInstallAvailable = (e: any) => {
      console.log("🚀 PWA install available")
      setInstallPrompt(e.detail)
      setCanInstall(true)
    }

    const handlePWAInstalled = () => {
      console.log("✅ PWA installed")
      setIsInstalled(true)
      setCanInstall(false)
      setInstallPrompt(null)
    }

    const handlePWAAlreadyInstalled = () => {
      console.log("✅ PWA already installed")
      setIsInstalled(true)
      setCanInstall(false)
    }

    window.addEventListener("pwa-install-available", handlePWAInstallAvailable)
    window.addEventListener("pwa-installed", handlePWAInstalled)
    window.addEventListener("pwa-already-installed", handlePWAAlreadyInstalled)

    // Check Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => {
        console.log("✅ Service Worker is ready")
        setSwRegistered(true)
      })
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("pwa-install-available", handlePWAInstallAvailable)
      window.removeEventListener("pwa-installed", handlePWAInstalled)
      window.removeEventListener("pwa-already-installed", handlePWAAlreadyInstalled)
    }
  }, [])

  const handleInstallPWA = async () => {
    if (installPrompt) {
      console.log("🚀 Triggering install prompt")
      installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      console.log("👤 User choice:", outcome)

      if (outcome === "accepted") {
        setCanInstall(false)
        setInstallPrompt(null)
      }
    } else {
      console.log("❌ No install prompt available")
    }
  }

  const calculateTimeElapsed = (quitDate: string): TimeElapsed => {
    const quit = dayjs(quitDate)
    const now = currentTime
    const diff = dayjs.duration(now.diff(quit))

    const days = Math.floor(diff.asDays())
    const hours = diff.hours()
    const minutes = diff.minutes()
    const seconds = diff.seconds()

    return { days, hours, minutes, seconds }
  }

  const calculateBenefit = (item: QuitItem): BenefitCalculation | null => {
    if (!item.benefitType || !item.benefitAmount) return null

    const timeElapsed = calculateTimeElapsed(item.quitDate)
    const totalDays = Math.max(0, timeElapsed.days + timeElapsed.hours / 24)

    if (item.benefitType === "time") {
      const dailyMinutes = item.benefitAmount
      const totalMinutes = totalDays * dailyMinutes

      if (totalMinutes >= 60) {
        const hours = Math.floor(totalMinutes / 60)
        const minutes = Math.floor(totalMinutes % 60)
        return {
          totalAmount: totalMinutes,
          dailyAmount: dailyMinutes,
          unit: hours > 0 ? `${hours}h ${minutes}m` : `${Math.floor(totalMinutes)}m`,
          type: "time",
        }
      } else {
        return {
          totalAmount: totalMinutes,
          dailyAmount: dailyMinutes,
          unit: `${Math.floor(totalMinutes)}m`,
          type: "time",
        }
      }
    } else if (item.benefitType === "money") {
      const totalAmount = totalDays * item.benefitAmount
      return {
        totalAmount,
        dailyAmount: item.benefitAmount,
        unit: `${item.benefitUnit || "$"}${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        type: "money",
      }
    }

    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) return

    const newItem: QuitItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      quitDate: formData.quitDate || dayjs().format("YYYY-MM-DDTHH:mm"),
      benefitType: formData.benefitType || undefined,
      benefitAmount: formData.benefitAmount ? Number.parseFloat(formData.benefitAmount) : undefined,
      benefitUnit: formData.benefitUnit || undefined,
    }

    if (editingItem) {
      setItems(items.map((item) => (item.id === editingItem.id ? newItem : item)))
    } else {
      setItems([...items, newItem])
    }

    resetForm()
  }

  const handleEdit = (item: QuitItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description || "",
      quitDate: item.quitDate,
      benefitType: item.benefitType || "",
      benefitAmount: item.benefitAmount?.toString() || "",
      benefitUnit: item.benefitUnit || "",
    })
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (item: QuitItem) => {
    setDeleteConfirmItem(item)
  }

  const handleConfirmDelete = () => {
    if (deleteConfirmItem) {
      setItems(items.filter((item) => item.id !== deleteConfirmItem.id))
      setDeleteConfirmItem(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteConfirmItem(null)
  }

  const formatTimeElapsed = (time: TimeElapsed): string => {
    if (time.days > 0) {
      return `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`
    } else if (time.hours > 0) {
      return `${time.hours}h ${time.minutes}m ${time.seconds}s`
    } else if (time.minutes > 0) {
      return `${time.minutes}m ${time.seconds}s`
    } else {
      return `${time.seconds}s`
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      quitDate: "",
      benefitType: "",
      benefitAmount: "",
      benefitUnit: "",
    })
    setEditingItem(null)
    setIsDialogOpen(false)
  }

  const handleBenefitTypeChange = (value: "time" | "money") => {
    setFormData({
      ...formData,
      benefitType: value,
      benefitUnit: value === "time" ? "minutes" : "$",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-screen-md mx-auto">
        {/* Header with status indicators */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              {isOnline ? <Wifi className="w-5 h-5 text-green-600" /> : <WifiOff className="w-5 h-5 text-red-600" />}
              <span className="text-sm text-gray-600">{isOnline ? "Online" : "Offline"}</span>
              {swRegistered && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">SW Ready</span>
              )}
              {isInstalled && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">
                  <Smartphone className="w-3 h-3 inline mr-1" />
                  Installed
                </span>
              )}
            </div>
            {canInstall && installPrompt && !isInstalled && (
              <Button onClick={handleInstallPWA} variant="outline" size="sm" className="text-xs">
                <Download className="w-4 h-4 mr-1" />
                Install App
              </Button>
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">QuitTracker</h1>
          <p className="text-gray-600">Track your journey to freedom from bad habits</p>
          {!isOnline && <p className="text-sm text-amber-600 mt-2">You're offline, but your data is saved locally!</p>}
        </div>

        <div className="flex justify-center mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Quit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Quit" : "Add New Quit"}</DialogTitle>
                <DialogDescription>
                  {editingItem ? "Update your quit details." : "Add a new habit you want to track quitting."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Smoking, Social Media, Coffee..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Why did you quit? What motivated you?"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quitDate">Quit Date</Label>
                    <Input
                      id="quitDate"
                      type="datetime-local"
                      value={formData.quitDate}
                      onChange={(e) => setFormData({ ...formData, quitDate: e.target.value })}
                    />
                  </div>

                  {/* Benefit Tracking Section */}
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">Benefit Tracking (optional)</Label>
                    <div className="grid gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="benefitType">Benefit Type</Label>
                        <Select value={formData.benefitType} onValueChange={handleBenefitTypeChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select benefit type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="time">Time Saved</SelectItem>
                            <SelectItem value="money">Money Saved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.benefitType && (
                        <>
                          <div className="grid gap-2">
                            <Label htmlFor="benefitAmount">
                              {formData.benefitType === "time" ? "Minutes per day" : "Amount per day"}
                            </Label>
                            <Input
                              id="benefitAmount"
                              type="number"
                              step={formData.benefitType === "money" ? "0.01" : "1"}
                              placeholder={formData.benefitType === "time" ? "e.g., 30" : "e.g., 15.00"}
                              value={formData.benefitAmount}
                              onChange={(e) => setFormData({ ...formData, benefitAmount: e.target.value })}
                            />
                          </div>

                          {formData.benefitType === "money" && (
                            <div className="grid gap-2">
                              <Label htmlFor="benefitUnit">Currency</Label>
                              <Select
                                value={formData.benefitUnit}
                                onValueChange={(value) => setFormData({ ...formData, benefitUnit: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="$">USD ($)</SelectItem>
                                  <SelectItem value="Rp">IDR (Rp)</SelectItem>
                                  <SelectItem value="€">EUR (€)</SelectItem>
                                  <SelectItem value="£">GBP (£)</SelectItem>
                                  <SelectItem value="¥">JPY (¥)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingItem ? "Update" : "Add"} Quit
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No quits tracked yet</h3>
            <p className="text-gray-500">Add your first quit to start tracking your progress!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => {
              const timeElapsed = calculateTimeElapsed(item.quitDate)
              const isValid =
                timeElapsed.days >= 0 && timeElapsed.hours >= 0 && timeElapsed.minutes >= 0 && timeElapsed.seconds >= 0
              const benefit = calculateBenefit(item)

              return (
                <Card key={item.id} className="relative group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-1">{item.name}</CardTitle>
                        {item.description && (
                          <CardDescription className="text-sm text-gray-600">{item.description}</CardDescription>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {isValid ? formatTimeElapsed(timeElapsed) : "Invalid date"}
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        {isValid && timeElapsed.days > 0 && (
                          <div className="mb-1">
                            <span className="font-semibold">{timeElapsed.days}</span> day
                            {timeElapsed.days !== 1 ? "s" : ""} clean
                          </div>
                        )}
                        <div>Since {dayjs(item.quitDate).format("MMM D, YYYY [at] h:mm A")}</div>
                      </div>

                      {/* Benefit Display */}
                      {benefit && (
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            {benefit.type === "time" ? (
                              <Clock className="w-4 h-4 text-blue-600" />
                            ) : (
                              <DollarSign className="w-4 h-4 text-green-600" />
                            )}
                            <span className="text-sm font-medium text-gray-700">
                              {benefit.type === "time" ? "Time Saved" : "Money Saved"}
                            </span>
                          </div>
                          <div
                            className={`text-2xl font-bold mb-1 ${
                              benefit.type === "time" ? "text-blue-600" : "text-green-600"
                            }`}
                          >
                            {benefit.unit}
                          </div>
                          <div className="text-xs text-gray-500">
                            {benefit.type === "time"
                              ? `${benefit.dailyAmount} minutes/day`
                              : `${item.benefitUnit}${benefit.dailyAmount}/day`}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirmItem} onOpenChange={() => setDeleteConfirmItem(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Quit Tracker</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{deleteConfirmItem?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

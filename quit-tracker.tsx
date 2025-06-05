"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Calendar } from "lucide-react"

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

interface QuitItem {
  id: string
  name: string
  description?: string
  quitDate: string
}

interface TimeElapsed {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function QuitTracker() {
  const [items, setItems] = useState<QuitItem[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<QuitItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quitDate: "",
  })
  const [currentTime, setCurrentTime] = useState(new Date())

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
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const calculateTimeElapsed = (quitDate: string): TimeElapsed => {
    const quit = new Date(quitDate)
    const now = currentTime
    const diffMs = now.getTime() - quit.getTime()

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.quitDate) return

    const newItem: QuitItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      quitDate: formData.quitDate,
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
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", quitDate: "" })
    setEditingItem(null)
    setIsDialogOpen(false)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-screen-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">QuitTracker</h1>
          <p className="text-gray-600">Track your journey to freedom from bad habits</p>
        </div>

        <div className="flex justify-center mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Quit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
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
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quitDate">Quit Date *</Label>
                    <Input
                      id="quitDate"
                      type="datetime-local"
                      value={formData.quitDate}
                      onChange={(e) => setFormData({ ...formData, quitDate: e.target.value })}
                      required
                    />
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
                          onClick={() => handleDelete(item.id)}
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
                      <div className="text-sm text-gray-500">
                        {isValid && timeElapsed.days > 0 && (
                          <div className="mb-1">
                            <span className="font-semibold">{timeElapsed.days}</span> day
                            {timeElapsed.days !== 1 ? "s" : ""} clean
                          </div>
                        )}
                        <div>
                          Since{" "}
                          {new Date(item.quitDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

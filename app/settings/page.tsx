"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Settings, User, Lock, Save } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [formData, setFormData] = useState({
    currentUsername: "",
    newUsername: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem("lablite_auth")
    if (authStatus !== "authenticated") {
      router.push("/")
      return
    }

    // Load current credentials
    const storedCredentials = localStorage.getItem("lablite_credentials")
    if (storedCredentials) {
      const credentials = JSON.parse(storedCredentials)
      setFormData((prev) => ({
        ...prev,
        currentUsername: credentials.username,
        newUsername: credentials.username,
      }))
    } else {
      // Set default credentials if none stored
      setFormData((prev) => ({
        ...prev,
        currentUsername: "admin",
        newUsername: "admin",
      }))
    }
    setLoading(false)
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      // Validate current credentials
      const storedCredentials = localStorage.getItem("lablite_credentials")
      const currentCreds = storedCredentials
        ? JSON.parse(storedCredentials)
        : { username: "admin", password: "admin123" }

      if (formData.currentUsername !== currentCreds.username || formData.currentPassword !== currentCreds.password) {
        setMessage("Current credentials are incorrect")
        setSaving(false)
        return
      }

      // Validate new password confirmation
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        setMessage("New passwords do not match")
        setSaving(false)
        return
      }

      // Update credentials
      const newCredentials = {
        username: formData.newUsername,
        password: formData.newPassword || currentCreds.password,
      }

      localStorage.setItem("lablite_credentials", JSON.stringify(newCredentials))
      setMessage("Settings updated successfully!")

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (error) {
      setMessage("Error updating settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="grid gap-6 max-w-2xl">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Settings
              </CardTitle>
              <CardDescription>Update your username and password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentUsername">Current Username</Label>
                    <Input
                      id="currentUsername"
                      value={formData.currentUsername}
                      onChange={(e) => setFormData((prev) => ({ ...prev, currentUsername: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newUsername">New Username</Label>
                    <Input
                      id="newUsername"
                      value={formData.newUsername}
                      onChange={(e) => setFormData((prev) => ({ ...prev, newUsername: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
                    <Lock className="h-4 w-4" />
                    Change Password
                  </h3>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password (leave blank to keep current)</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        disabled={!formData.newPassword}
                      />
                    </div>
                  </div>
                </div>

                {message && (
                  <div
                    className={`text-sm p-2 rounded ${
                      message.includes("successfully") ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <Button type="submit" disabled={saving} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

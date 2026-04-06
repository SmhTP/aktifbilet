"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { User, Mail, Phone, MapPin, Calendar, Edit2, Camera, Bell, Shield, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n"

const mockUser = {
  id: "1",
  name: "Ahmet Yilmaz",
  email: "ahmet@example.com",
  phone: "+90 532 123 4567",
  location: "Istanbul, Turkiye",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  memberSince: "2023",
  totalBookings: 12,
  totalReviews: 8,
}

export default function ProfilePage() {
  const { t } = useI18n()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    location: mockUser.location,
  })

  const handleSave = () => {
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">{t("profile.header")}</h1>
          <p className="mt-2 text-muted-foreground">{t("profile.headerDesc")}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden">
                      <Image
                        src={mockUser.avatar}
                        alt={mockUser.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-foreground">{mockUser.name}</h2>
                  <p className="text-muted-foreground">{mockUser.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    {mockUser.memberSince} {t("profile.memberSince")}
                  </Badge>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{mockUser.totalBookings}</p>
                    <p className="text-sm text-muted-foreground">{t("profile.reservations")}</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{mockUser.totalReviews}</p>
                    <p className="text-sm text-muted-foreground">{t("profile.evaluations")}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/etkinliklerim">
                      <Calendar className="mr-2 h-4 w-4" />
                      {t("myEvents.title")}
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("profile.logout")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">{t("profile.personalInfoTitle")}</TabsTrigger>
                <TabsTrigger value="notifications">{t("profile.notificationSettings")}</TabsTrigger>
                <TabsTrigger value="security">{t("profile.security")}</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t("profile.personalInfoTitle")}</CardTitle>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      size="sm"
                      onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                      className={isEditing ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""}
                    >
                      {isEditing ? t("common.save") : <><Edit2 className="mr-2 h-4 w-4" />{t("common.edit")}</>}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {t("profile.fullName")}
                        </Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        ) : (
                          <p className="text-foreground py-2">{formData.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {t("profile.email")}
                        </Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        ) : (
                          <p className="text-foreground py-2">{formData.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {t("profile.phone")}
                        </Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        ) : (
                          <p className="text-foreground py-2">{formData.phone}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {t("common.location")}
                        </Label>
                        {isEditing ? (
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          />
                        ) : (
                          <p className="text-foreground py-2">{formData.location}</p>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex justify-end gap-2 pt-4 border-t border-border">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          {t("common.cancel")}
                        </Button>
                        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          {t("profile.saveChanges")}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      {t("profile.notificationSettings")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{t("profile.emailNotifications")}</p>
                        <p className="text-sm text-muted-foreground">{t("profile.bookingCampaignNotif")}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{t("profile.smsNotifications")}</p>
                        <p className="text-sm text-muted-foreground">{t("profile.bookingReminders")}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{t("profile.campaignNotifications")}</p>
                        <p className="text-sm text-muted-foreground">{t("profile.specialOffers")}</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{t("profile.reviewReminders")}</p>
                        <p className="text-sm text-muted-foreground">{t("profile.reviewRemindersDesc")}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {t("profile.securitySettings")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-foreground mb-2">{t("profile.changePassword")}</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">{t("profile.currentPassword")}</Label>
                            <Input id="current-password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">{t("profile.newPassword")}</Label>
                            <Input id="new-password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">{t("profile.newPasswordRepeat")}</Label>
                            <Input id="confirm-password" type="password" />
                          </div>
                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            {t("profile.updatePassword")}
                          </Button>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-border">
                        <h3 className="font-medium text-foreground mb-2">{t("profile.twoFactorAuth")}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{t("profile.twoFactorDesc")}</p>
                        <Button variant="outline">{t("profile.enable")}</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

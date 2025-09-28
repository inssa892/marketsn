"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import AvatarUploader from "@/components/AvatarUploader";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Settings,
  User,
  Palette,
  Shield,
  Loader as Loader2,
} from "lucide-react";

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    display_name: "",
    phone: "",
    whatsapp_number: "",
    avatar_url: "",
  });

  useEffect(() => {
    setMounted(true);
    if (profile) {
      setProfileData({
        display_name: profile.display_name || "",
        phone: profile.phone || "",
        whatsapp_number: profile.whatsapp_number || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile]);

  // --- Update Profile ---
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: profileData.display_name,
          phone: profileData.phone,
          whatsapp_number: profileData.whatsapp_number,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      refreshProfile?.();
    } catch (err: any) {
      toast.error("Failed to update profile: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // --- Send Password Reset Email ---
  const sendResetPasswordEmail = async () => {
    if (!profile?.email) return toast.error("No email found for user");

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        profile.email
      );
      if (error) throw error;

      toast.success("Password recovery email sent!");
    } catch (err: any) {
      console.error("Reset password error:", err);
      toast.error(
        "Failed to send password recovery email: " + (err.message || err)
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // --- Handle Avatar Upload ---
  const handleAvatarUpload = (url: string) => {
    setProfileData((prev) => ({ ...prev, avatar_url: url }));
  };

  if (!mounted)
    return <div className="flex justify-center py-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <AvatarUploader
                avatarUrl={profileData.avatar_url}
                onUpload={handleAvatarUpload}
              />
            </div>

            <Separator />

            <form onSubmit={updateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={profile?.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label>Account Type</Label>
                <Badge
                  variant={
                    profile?.role === "merchant" ? "default" : "secondary"
                  }
                >
                  {profile?.role === "merchant" ? "Merchant" : "Client"}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input
                  value={profileData.display_name}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      display_name: e.target.value,
                    }))
                  }
                  placeholder="Your display name"
                />
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input
                  value={profileData.whatsapp_number}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      whatsapp_number: e.target.value,
                    }))
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security & Preferences */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label>{theme === "dark" ? "Dark Mode" : "Light Mode"}</Label>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={sendResetPasswordEmail}
                disabled={passwordLoading}
                className="w-full"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <span>Account created</span>
                <span>
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last updated</span>
                <span>
                  {profile?.updated_at
                    ? new Date(profile.updated_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

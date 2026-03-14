import React, { useContext, useEffect, useState } from "react";
import AuthContext, { sanitizeUserDetails } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  updateProfileService,
  uploadProfileImageService,
  changePasswordService,
} from "@/service";

export default function Profile() {
  const { userDetails, setUserDetails } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: userDetails?.username || "",
    email: userDetails?.email || "",
    role: userDetails?.role || "student",
    bio: userDetails?.bio || "",
    phone: userDetails?.phone || "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(userDetails?.profileImage || "");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (userDetails?.profileImage) {
      setImagePreview(userDetails.profileImage);
    }
  }, [userDetails?.profileImage]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleProfileImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingImage(true);
      const result = await uploadProfileImageService(formData);
      if (result?.success) {
        const updated = result.data;
        setUserDetails((prev) => {
          const next = sanitizeUserDetails({
            ...prev,
            profileImage: updated.profileImage,
          });
          localStorage.setItem("userDetails", JSON.stringify(next));
          return next;
        });
        toast.success("Profile picture updated successfully");
      } else {
        toast.error(result?.message || "Failed to upload profile image");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload profile image");
    } finally {
      setUploadingImage(false);
    }
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await updateProfileService({
        username: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
      });

      if (result?.success) {
        const updated = result.data;
        setFormData((prev) => ({
          ...prev,
          name: updated.username || prev.name,
          email: updated.email || prev.email,
          phone: updated.phone || prev.phone,
          bio: updated.bio || prev.bio,
        }));

        // keep context in sync
        setUserDetails((prev) => {
          const next = sanitizeUserDetails({
            ...prev,
            username: updated.username,
            email: updated.email,
            bio: updated.bio,
            phone: updated.phone,
          });
          localStorage.setItem("userDetails", JSON.stringify(next));
          return next;
        });

        toast.success("Profile updated successfully");
      } else {
        toast.error(result?.message || "Failed to update profile");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  const initials =
    formData?.name
      ?.split(" ")
      ?.map((word) => word[0])
      ?.join("")
      ?.toUpperCase()
      ?.slice(0, 2) || "U";

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Profile Summary */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader className="items-center text-center">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={imagePreview || userDetails?.profileImage || ""} alt={formData.name} />
                  <AvatarFallback className="text-lg font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <label className="mt-4 cursor-pointer rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
                  <span>{uploadingImage ? "Uploading..." : "Change photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            <CardTitle className="mt-4 text-2xl">{formData.name || "Your Name"}</CardTitle>
            <CardDescription>{formData.email || "No email available"}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium capitalize">{formData.role}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{formData.phone || "Not added"}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Bio</p>
              <p className="font-medium text-sm">
                {formData.bio || "No bio added yet."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Edit Form */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your personal details here.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    type="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role}
                    disabled
                    className="capitalize"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write something about yourself"
                  className="w-full min-h-[120px] rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className={"cursor-pointer"}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>

            <div className="mt-10 border-t pt-10">
              <h2 className="text-xl font-semibold">Change Password</h2>
              <p className="text-sm text-muted-foreground">
                Update your password. Current password is required.
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    setPasswordLoading(true);
                    const result = await changePasswordService(passwordData);
                    if (result?.success) {
                      toast.success("Password updated successfully");
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    } else {
                      toast.error(result?.message || "Failed to update password");
                    }
                  } catch (error) {
                    console.error(error);
                    toast.error("Failed to update password");
                  } finally {
                    setPasswordLoading(false);
                  }
                }}
                className="space-y-6 mt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Current password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="New password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm password"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={passwordLoading} className={"cursor-pointer"}>
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
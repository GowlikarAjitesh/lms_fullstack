import React, { useContext, useState } from "react";
import AuthContext from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function Profile() {
  const { userDetails } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: userDetails?.username || "",
    email: userDetails?.email || "",
    role: userDetails?.role || "student",
    bio: userDetails?.bio || "",
    phone: userDetails?.phone || "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      setLoading(true);

      // TODO: Replace this with your backend API call
      console.log("Updated profile data = ", formData);

      toast.success("Profile updated successfully");
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
            <Avatar className="h-24 w-24">
              <AvatarImage src={userDetails?.profileImage || ""} alt={formData.name} />
              <AvatarFallback className="text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

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
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
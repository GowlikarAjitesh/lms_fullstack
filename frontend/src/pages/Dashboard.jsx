import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  User,
  LayoutDashboard,
  GraduationCap,
  PlusCircle,
  Settings,
  ArrowRight,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userDetails } = useContext(AuthContext);

  const userName = userDetails?.username || "User";
  const userEmail = userDetails?.email || "No email available";
  const userRole = (userDetails?.role || "student").toLowerCase();

  const initials = useMemo(() => {
    return (
      userName
        ?.split(" ")
        ?.map((word) => word[0])
        ?.join("")
        ?.toUpperCase()
        ?.slice(0, 2) || "U"
    );
  }, [userName]);

  const quickLinks =
    userRole === "instructor"
      ? [
          {
            title: "Instructor Dashboard",
            description: "View teaching stats and course insights.",
            icon: LayoutDashboard,
            action: () => navigate("/instructor"),
          },
          {
            title: "Manage Courses",
            description: "Edit, publish, and organize your courses.",
            icon: BookOpen,
            action: () => navigate("/instructor/courses"),
          },
          {
            title: "Create Course",
            description: "Start building a brand new course.",
            icon: PlusCircle,
            action: () => navigate("/instructor/newCourse"),
          },
          {
            title: "Profile",
            description: "Update your personal details and account info.",
            icon: User,
            action: () => navigate("/profile"),
          },
        ]
      : [
          {
            title: "Explore Courses",
            description: "Discover courses and continue learning.",
            icon: GraduationCap,
            action: () => navigate("/explore-courses"),
          },
          {
            title: "My Learning",
            description: "Open your purchased courses and track progress.",
            icon: BookOpen,
            action: () => navigate("/student-courses"),
          },
          {
            title: "Profile",
            description: "Manage your account and personal information.",
            icon: User,
            action: () => navigate("/profile"),
          },
          {
            title: "Settings",
            description: "Control your account preferences.",
            icon: Settings,
            action: () => navigate("/profile"),
          },
        ];

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Section */}
        <Card className="border shadow-sm">
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                {initials}
              </div>

              <div>
                <h1 className="text-3xl font-bold">Welcome, {userName}</h1>
                <p className="text-muted-foreground mt-1">{userEmail}</p>
                <span className="inline-block mt-3 rounded-full border px-3 py-1 text-xs font-medium capitalize">
                  {userRole}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/profile")}>
                View Profile
              </Button>

              {userRole === "instructor" ? (
                <Button onClick={() => navigate("/instructor/newCourse")}>
                  Create Course
                </Button>
              ) : (
                <Button onClick={() => navigate("/explore-courses")}>
                  Browse Courses
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Quick Access</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Jump into the things you’ll probably need most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.title}
                  className="group cursor-pointer border shadow-sm transition hover:shadow-md"
                  onClick={item.action}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="rounded-lg bg-primary/10 p-3 w-fit">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1" />
                    </div>

                    <CardTitle className="pt-4 text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Role-Based Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
              <CardDescription>
                Basic information about your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{userName}</p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{userEmail}</p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{userRole}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>
                {userRole === "instructor" ? "Instructor Tips" : "Learning Tips"}
              </CardTitle>
              <CardDescription>
                {userRole === "instructor"
                  ? "A few helpful shortcuts for managing your teaching flow."
                  : "Small reminders to keep your learning consistent."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {userRole === "instructor" ? (
                <>
                  <div className="rounded-lg border p-4">
                    <p className="font-medium">Keep courses updated</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Refresh course content regularly so students stay engaged.
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="font-medium">Publish only when ready</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Review lectures, pricing, and metadata before making a course live.
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="font-medium">Track student engagement</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use your instructor dashboard to monitor course performance.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-lg border p-4">
                    <p className="font-medium">Learn a little every day</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Steady progress beats random marathon sessions every time.
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="font-medium">Complete lectures consistently</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Staying regular helps you actually finish what you start.
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="font-medium">Explore new topics</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pick up one new skill at a time and build momentum.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
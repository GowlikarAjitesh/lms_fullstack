import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllCoursesService } from "@/service";
import {
  Plus,
  BookOpen,
  Users,
  IndianRupee,
  DollarSign ,
  Eye,
  PencilLine,
  BadgeCheck,
  Clock3,
} from "lucide-react";

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      const res = await getAllCoursesService();
      if (res?.success) {
        setCourses(res.data || []);
      }
      setLoading(false);
    };

    loadCourses();
  }, []);

  const stats = useMemo(() => {
    const totalCourses = courses.length;

    const publishedCourses = courses.filter((course) => course?.isPublished).length;
    const unpublishedCourses = totalCourses - publishedCourses;

    const totalStudents = courses.reduce(
      (sum, course) => sum + (course?.students?.length || 0),
      0
    );

    const totalRevenue = courses.reduce(
      (sum, course) =>
        sum + (course?.students?.length || 0) * Number(course?.pricing || 0),
      0
    );

    const recentCourses = [...courses].slice(0, 4);

    return {
      totalCourses,
      publishedCourses,
      unpublishedCourses,
      totalStudents,
      totalRevenue,
      recentCourses,
    };
  }, [courses]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Hero Section */}
        <div className="rounded-2xl border bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">Instructor Dashboard</h1>
            <p className="text-muted-foreground max-w-2xl">
              Track your teaching business at a glance — monitor courses,
              publishing status, student reach, and revenue from one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate("/instructor/newCourse")} className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/instructor/courses")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Manage Courses
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">
                Total Courses
              </CardTitle>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <div className="text-3xl font-bold">{stats.totalCourses}</div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">
                Published Courses
              </CardTitle>
              <BadgeCheck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <div className="text-3xl font-bold">{stats.publishedCourses}</div>
              )}
              {!loading && (
                <p className="text-sm text-muted-foreground mt-2">
                  {stats.unpublishedCourses} unpublished
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">
                Total Students
              </CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <div className="text-3xl font-bold">{stats.totalStudents}</div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">
                Total Revenue
              </CardTitle>
              {/* <IndianRupee className="h-5 w-5 text-muted-foreground" /> */}
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <div className="text-3xl font-bold">
                  ${stats.totalRevenue.toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick actions + publishing overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="rounded-2xl lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border p-4 space-y-3">
                <PencilLine className="h-8 w-8" />
                <h3 className="font-semibold">Create a new course</h3>
                <p className="text-sm text-muted-foreground">
                  Start building your next course and publish it when ready.
                </p>
                <Button
                  size="sm"
                  onClick={() => navigate("/instructor/newCourse")}
                >
                  New Course
                </Button>
              </div>

              <div className="rounded-xl border p-4 space-y-3">
                <BookOpen className="h-8 w-8" />
                <h3 className="font-semibold">Manage all courses</h3>
                <p className="text-sm text-muted-foreground">
                  Edit course content, pricing, and publishing settings.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/instructor/courses")}
                >
                  Go to Courses
                </Button>
              </div>

              <div className="rounded-xl border p-4 space-y-3">
                <Eye className="h-8 w-8" />
                <h3 className="font-semibold">Review published courses</h3>
                <p className="text-sm text-muted-foreground">
                  Check what students can currently see in your catalog.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/instructor/courses")}
                >
                  Review Now
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Publishing Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {loading ? (
                <>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-4/5" />
                  <Skeleton className="h-24 w-full" />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Published</span>
                    <span className="font-semibold">{stats.publishedCourses}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Unpublished</span>
                    <span className="font-semibold">{stats.unpublishedCourses}</span>
                  </div>

                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${
                          stats.totalCourses
                            ? (stats.publishedCourses / stats.totalCourses) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {stats.totalCourses === 0
                      ? "No courses yet."
                      : `${stats.publishedCourses} out of ${stats.totalCourses} courses are live.`}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent courses */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-semibold">Recent Courses</h2>
            {!loading && courses.length > 0 && (
              <Button
                variant="outline"
                onClick={() => navigate("/instructor/courses")}
              >
                View All
              </Button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          ) : courses.length === 0 ? (
            <Card className="border-dashed border-2 rounded-2xl">
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">
                  You do not have any courses yet. Create your first one to get started.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => navigate("/instructor/newCourse")}
                >
                  Create Your First Course
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.recentCourses.map((course) => (
                <Card key={course._id} className="rounded-2xl">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          ₹{course.pricing} • {course.students?.length || 0} students
                        </p>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full border ${
                          course.isPublished
                            ? "border-green-500/30 text-green-600"
                            : "border-yellow-500/30 text-yellow-600"
                        }`}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          navigate(`/instructor/editCourse/${course._id}`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => navigate("/instructor/courses")}
                      >
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
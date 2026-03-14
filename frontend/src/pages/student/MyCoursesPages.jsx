import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StudentContext from "@/context/student-context";
import { getStudentBoughtCoursesService } from "@/service";
import AuthContext from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

export default function MyCoursesPage() {
  const navigate = useNavigate();
  const { userDetails } = useContext(AuthContext);
  const studentId = userDetails?.id;
  // console.log("Student Id: ", studentId);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const [isLoading, setIsLoading] = useState(true);

  async function getStudentBoughtCoursesList(studentId) {
    if (!studentId) return;

    setIsLoading(true);
    const result = await getStudentBoughtCoursesService(studentId);

    if (result?.success) {
      setStudentBoughtCoursesList(result?.data?.courses);
      // console.log(result.data);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (!studentId) return;

    // Clear any stale data from previous sessions while fetching
    setStudentBoughtCoursesList([]);
    setIsLoading(true);

    getStudentBoughtCoursesList(studentId);
  }, [studentId]);

  // console.log("Student Bought course: ", studentBoughtCoursesList);

  return (
    <div className="min-h-screen bg-background text-foreground w-full">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground mt-2">
          Continue learning and track your progress.
        </p>
      </div>

      {/* Courses */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : !studentBoughtCoursesList || studentBoughtCoursesList.length === 0 ? (
          <div className="text-center py-20 border border-border rounded-2xl">
            <p className="text-muted-foreground">
              You haven't enrolled in any courses yet.
            </p>
            <Button
              className="mt-4 cursor-pointer"
              onClick={() => navigate("/explore-courses")}
            >
              Explore Courses
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {studentBoughtCoursesList.map((course) => (
              <Card
                key={course.courseId}
                className="flex flex-col md:flex-row overflow-hidden bg-card border-border items-center gap-4"
              >
                {/* Image */}
                <img
                  src={course.courseImage}
                  alt={course.title}
                  className="ml-4 w-full md:w-56 h-48 object-cover"
                />

                {/* Content */}
                <CardContent className="flex-1 p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      by {course.instructorName}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {course.progress ?? 0}%
                      </span>
                    </div>
                    <Progress value={course.progress ?? 0} />
                  </div>

                  <Button onClick={()=>navigate(`/course-progress/${course.courseId}`)} className="w-fit cursor-pointer">Continue Learning</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

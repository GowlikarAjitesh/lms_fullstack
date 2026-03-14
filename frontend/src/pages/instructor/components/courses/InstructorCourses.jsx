import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import React, { useContext, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import InstructorContext from "@/context/instructorContext";
import { getAllCoursesService, togglePublishCourseService } from "@/service";
import { toast } from "react-toastify";
import { Switch } from "@/components/ui/switch";

export function EmptyRow({ message = "No Data found", colSpan = 5 }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center text-muted-foreground">
        {message}
      </TableCell>
    </TableRow>
  );
}

export default function InstructorCourses() {
  const navigate = useNavigate();

  const {
    instructorCoursesList,
    setInstructorCoursesList,
    setEditSingleCourseData,
  } = useContext(InstructorContext);

  async function fetchAllCourses() {
    const coursesList = await getAllCoursesService();
    if (coursesList?.success) {
      setInstructorCoursesList(coursesList.data);
    } else {
      toast.error(coursesList.message || "Failed to fetch courses");
    }
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const handleEdit = (course) => {
    navigate(`/instructor/editCourse/${course._id}`);
  };

  const handleAddNewCourse = () => {
    setEditSingleCourseData(null);
    navigate("/instructor/newCourse");
  };

  const handleTogglePublish = async (course) => {
    const updatedStatus = !course.isPublished;
    console.log(updatedStatus, "status");
    const response = await togglePublishCourseService(course._id, updatedStatus);

    if (response?.success) {
      toast.success(response.message || "Course status updated");

      setInstructorCoursesList((prev) =>
        prev.map((item) =>
          item._id === course._id
            ? { ...item, isPublished: updatedStatus }
            : item
        )
      );
    } else {
      toast.error(response?.message || "Failed to update course status");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Card>
        <CardHeader className="flex justify-between flex-row items-center">
          <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
          <Button onClick={handleAddNewCourse}>
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {instructorCoursesList?.length === 0 ? (
                <EmptyRow />
              ) : (
                instructorCoursesList.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell className="font-medium">
                      {course.title}
                    </TableCell>

                    <TableCell>{course.students?.length || 0}</TableCell>

                    <TableCell>
                      ${(course.students?.length || 0) * Number(course.pricing || 0)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={!!course.isPublished}
                          onCheckedChange={() => handleTogglePublish(course)}
                          className="cursor-pointer"
                        />
                        <span className="text-sm">
                          {course.isPublished ? "Published" : "Unpublished"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(course)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
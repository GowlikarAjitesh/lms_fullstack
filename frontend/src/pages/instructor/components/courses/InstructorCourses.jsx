import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Form, Link, useNavigate } from "react-router-dom";
import InstructorContext from "@/context/instructorContext";
import { getAllCoursesService } from "@/service";
import { toast } from "react-toastify";


export function EmptyRow({ message = "No Data found", colSpan = 4 }) {
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
  const { instructorCoursesList, setInstructorCoursesList, editSingleCourseData, setEditSingleCourseData } =
    useContext(InstructorContext);
  async function fetchAllCourses() {
    const coursesList = await getAllCoursesService();
    if (coursesList?.success) {
      console.log("Courses list from instructorCourses Page: ", coursesList);
      setInstructorCoursesList(coursesList.data);
    } else {
      toast.error(coursesList.message);
    }
  }
  useEffect(() => {
    fetchAllCourses();
  }, []);

  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    students: "",
    revenue: "",
  });

  const handleEdit = (course) => {
    console.log("edit course data = ", course);
    navigate(`/instructor/editCourse/${course._id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      // setCourses(courses.filter((course) => course.id !== id));
      console.log("Delete function need to be implemented...")
    }
  };

  function handleAddNewCourse() {
    setEditSingleCourseData(null);
    navigate("/instructor/newCourse");
  }

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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {instructorCoursesList?.length === 0 ? (
                <EmptyRow />
              ) : (
                instructorCoursesList.map((course, index) => (
                  <TableRow key={course._id}>
                    <TableCell className="font-medium">
                      {course.title}
                    </TableCell>
                    <TableCell>{course.students?.length}</TableCell>
                    <TableCell>
                      ${(course.students?.length || 0) * Number(course.pricing)}
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

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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

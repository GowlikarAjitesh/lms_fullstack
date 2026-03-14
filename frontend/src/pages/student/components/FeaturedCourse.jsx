import { useContext, useEffect } from "react";
import CourseCard from "./CourseCard";
import StudentContext from "@/context/student-context";
import { getAllCoursesToStudentService } from "@/service";


export default function FeaturedCourses() {
  const {studentCoursesList, setStudentCoursesList} = useContext(StudentContext);
  async function fetchAllCoursesList(){
    const coursesList = await getAllCoursesToStudentService();
    // console.log(coursesList);
    if(coursesList.success){
      // console.log("success ",coursesList.data);
      setStudentCoursesList(coursesList?.data);
    }
};

useEffect(()=>{
  fetchAllCoursesList();
}, []);
  return (
    <section className="py-16 container mx-auto px-6">
      <h2 className="text-3xl font-bold mb-8">Featured Courses</h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {studentCoursesList && studentCoursesList.length > 0 ? (studentCoursesList.map((course, index) => (
          <CourseCard key={index} {...{title: course.title, instructor: course.instructor.instructorName, price: course.pricing, image: course.image}} />
        ))) : (<h1>No courses Found</h1>)}
      </div>
    </section>
  );
}

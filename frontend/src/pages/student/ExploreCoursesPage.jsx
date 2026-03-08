import React, { useState, useEffect, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import CourseCard from "@/pages/student/components/CourseCard";
import { filterOptions, sortOptions } from "@/config";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { checkSingleCoursePurchasedService, getAllCoursesToStudentService } from "@/service";
import StudentContext from "@/context/student-context";
import { Dot, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import AuthContext from "@/context/auth-context";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

export default function ExploreCoursesPage() {
  const navigate = useNavigate();
  const [filteredStudentsCoursesList, setFilteredStudentsCoursesList] =
    useState([]);
  const [sort, setSort] = useState("price-lowToHigh");
  const [filters, setFilters] = useState(() => {
  try {
    return JSON.parse(sessionStorage.getItem("filters")) || {};
  } catch {
    return {};
  }
});
  const [searchParams, setSearchParams] = useSearchParams();
  const { studentCoursesList, setStudentCoursesList, globalLoadingState, setGlobalLoadingState } =
    useContext(StudentContext);
  const {userDetails} = useContext(AuthContext);
  function handleFilterChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSeection =
      Object.keys(cpyFilters).indexOf(getSectionId);

    console.log(indexOfCurrentSeection, getSectionId);
    if (indexOfCurrentSeection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };

      console.log(cpyFilters);
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id,
      );

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption.id);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }
  async function fetchCoursesList(filters, sort) {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });
    const coursesList = await getAllCoursesToStudentService(query);
    if (coursesList.success) {
      setStudentCoursesList(coursesList?.data);
      setFilteredStudentsCoursesList(coursesList?.data);
      setGlobalLoadingState(false);
    }
  }


  async function handleCourseNavigate(courseId, studentId){
    console.log("THis is handleCourseNavigate = ", courseId, studentId);
    const result = await checkSingleCoursePurchasedService(courseId, studentId);
    if(result?.success){
      if(result?.data){
        navigate(`/course-progress/${courseId}`);
      }
      else{
        navigate(`/course/details/${courseId}`);
      }
    }else{
      console.log('Hey i came to false condition...')
        navigate(`/course/details/${courseId}`);
      }
  }
// async function fetchCoursesList(currentFilters, currentSort) {
//   const params = {};

//   Object.entries(currentFilters).forEach(([key, value]) => {
//     if (value.length > 0) {
//       params[key] = value.join(",");
//     }
//   });

//   params.sortBy = currentSort;

//   const response = await getAllCoursesToStudentService(params);

//   if (response?.success) {
//     setStudentCoursesList(response.data);
//     setFilteredStudentsCoursesList(response.data);
//   }
// }
  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  // useEffect(() => {
  //   setSort((prev) => prev || "price-lowToHigh");
  //   setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  // }, []);

  useEffect(() => {
    if (filters !== null && sort !== null) fetchCoursesList(filters, sort);
  }, [filters, sort]);

  console.log("Filters = ", filters);
  console.log("coursesList = ", studentCoursesList);
  console.log("UserDetails = ", userDetails);
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Page Wrapper */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Explore Courses</h1>
          <p className="text-muted-foreground mt-2">
            Discover courses from industry experts and upgrade your skills.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="border border-border rounded-xl p-5 bg-card space-y-6">
              <h2 className="font-semibold text-lg">Filters</h2>

              {Object.keys(filterOptions).map((option) => (
                <div key={option} className="space-y-3">
                  <Label className="text-sm font-medium">{option}</Label>

                  <div className="space-y-2">
                    {filterOptions[option].map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <Checkbox
                          id={item.id}
                          onCheckedChange={() =>
                            handleFilterChange(option, item)
                          }
                          checked={
                            (filters &&
                              Object.keys(filters).length > 0 &&
                              filters[option] &&
                              filters[option]?.indexOf(item.id) > -1) ||
                            false
                          }
                          className="cursor-pointer"
                        />
                        <Label
                          htmlFor={item.id}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {item.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFilters({});
                  sessionStorage.removeItem("filters");
                }}
              >
                {" "}
                Reset Filters{" "}
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Top Controls */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div className="w-full md:w-1/3">
                <Input placeholder="Search courses..." />
              </div>
              {/* <div className="overflow-hidden">
                {Object.keys(filtersSelected).map((filterItem) => (
                  <div className="rounded-full">
                    {filterItem}
                    <X />
                  </div>
                ))}
              </div> */}
              <Select>
                <SelectTrigger className="w-50">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="text-sm mb-25">
                {filteredStudentsCoursesList.length} Results
              </span>
            </div>
            {/* Courses Grid */}
            <div className="flex flex-col gap-6">
              {filteredStudentsCoursesList?.length > 0 ? (
                filteredStudentsCoursesList.map((studentCourse) => (
                  <Card
                    onClick={()=>handleCourseNavigate(studentCourse?._id, userDetails?.id)}
                    key={studentCourse._id}
                    className="flex flex-col md:flex-row overflow-hidden border border-border bg-card rounded-xl hover:shadow-lg transition-shadow duration-300 items-center justify-around cursor-pointer"
                  >
                    {/* Left: Image */}
                    <CardHeader className="ml-4 p-2 md:w-60 shrink-0">
                      <img
                        src={studentCourse.image}
                        alt={studentCourse.title || "Course image"}
                        className="w-full h-full md:h-full object-cover"
                        loading="lazy"
                      />
                    </CardHeader>

                    {/* Right: Content */}
                    <CardContent className="flex flex-col justify-between flex-1 p-5 space-y-4">
                      {/* Title + Instructor */}
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold line-clamp-2">
                          {studentCourse.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Created by{": "}
                          <span className="font-bold text-md">
                            {studentCourse.instructor?.instructorName ||
                              "Unknown Instructor"}
                          </span>
                        </p>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>
                          <span className="font-semibold text-foreground">
                            {studentCourse.curriculum?.length || 0}{" "}
                          </span>{" "}
                          {studentCourse.curriculum?.length <= 1
                            ? "Lecture"
                            : "Lectures"}
                        </span>

                        {/* Separator Dot */}
                        <div className="flex">
                          <Dot className="w-4 h-4 text-muted-foreground shrink-0" />

                          <span>
                            <span className="font-semibold text-foreground">
                              {studentCourse.level?.toUpperCase()}
                            </span>{" "}
                            Level
                          </span>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="text-lg font-semibold text-primary">
                        ${studentCourse.pricing}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : globalLoadingState ? (<Skeleton/>) : (
                <div className="text-sm text-muted-foreground py-10 text-center">
                  No courses found
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

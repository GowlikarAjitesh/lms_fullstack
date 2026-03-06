import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AppWindowIcon, LucideBookText, Settings } from "lucide-react";
import CourseCurriculum from "./components/courses/addNewCourse/CourseCurriculum";
import CourseLanding from "./components/courses/addNewCourse/CourseLanding";
import CourseSettings from "./components/courses/addNewCourse/CourseSettings";

import InstructorContext from "@/context/instructorContext";
import AuthContext from "@/context/auth-context";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  createCourseService,
  getSingleCourseService,
  updateCourseService,
} from "@/service";

import {
  courseCuriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";

export default function AddNewCoursePage() {
  const { userDetails } = useContext(AuthContext);
  console.log("This is userDetails from addNewCoursePage = ", userDetails.id);

  const {
    courseLandingFormData,
    setCourseLandingFormData,
    courseCurriculumFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);

  const [editSingleCourseData, setEditSingleCourseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(params?.id);

  // -----------------------------
  // FETCH COURSE (EDIT MODE)
  // -----------------------------
  useEffect(() => {
    async function fetchSingleCourse(id) {
      setLoading(true);

      const result = await getSingleCourseService(id);

      if (result.success) {
        setEditSingleCourseData(result.data);

        // map backend → landing form
        setCourseLandingFormData({
          title: result.data.title || "",
          description: result.data.description || "",
          category: result.data.category || "",
          level: result.data.level || "",
          pricing: result.data.pricing || "",
          image: result.data.image || "",
          welcomeMessage: result.data.welcomeMessage || "",
          objectives: result.data.objectives || "",
        });

        // curriculum
        setCourseCurriculumFormData(
          result.data.curriculum || courseCuriculumInitialFormData
        );
      } else {
        toast.error(result.message);
      }

      setLoading(false);
    }

    if (isEditMode) {
      fetchSingleCourse(params.id);
    } else {
      // reset form for add mode
      setEditSingleCourseData(null);
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCuriculumInitialFormData);
    }
  }, [params?.id]);

  // -----------------------------
  // VALIDATION
  // -----------------------------
  function isEmpty(value) {
    if (Array.isArray(value)) return value.length === 0;
    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) return false;
    }

    let hasFreePreview = false;

    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.public_id) ||
        isEmpty(item.videoUrl)
      ) {
        return false;
      }

      if (item.freePreview) hasFreePreview = true;
    }

    return hasFreePreview;
  }

  // -----------------------------
  // SUBMIT (CREATE / UPDATE)
  // -----------------------------
  async function handleFormSubmit() {
    const formData = {
      instructor: {
        instructorId: userDetails?.id,
        instructorName: userDetails?.username,
        instructorEmail: userDetails?.email,
      },
      ...courseLandingFormData,
      pricing: Number(courseLandingFormData.pricing),
      students: editSingleCourseData?.students || [],
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };

    let result;

    if (isEditMode) {
      result = await updateCourseService(params.id, formData);
    } else {
      result = await createCourseService(formData);
    }

    if (result.success) {
      toast.success(result.message);

      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCuriculumInitialFormData);
      setEditSingleCourseData(null);

      navigate(-1);
    } else {
      toast.error(result.message);
    }
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex justify-between items-center rounded-2xl mb-5">
          <CardTitle className="text-3xl font-extrabold mb-5">
            {isEditMode ? "Edit Course" : "Create a New Course"}
          </CardTitle>

          <Button
            disabled={!validateFormData() || loading}
            onClick={handleFormSubmit}
            className="text-sm tracking-wider font-bold px-8"
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </CardHeader>

        <CardContent>
          <div className="container mx-auto p-4">
            {/* FIXED defaultValue */}
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum">
                  <LucideBookText className="mr-2 h-4 w-4" />
                  Curriculum
                </TabsTrigger>

                <TabsTrigger value="course-landing-page">
                  <AppWindowIcon className="mr-2 h-4 w-4" />
                  Course Landing
                </TabsTrigger>

                <TabsTrigger value="settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>

              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>

              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

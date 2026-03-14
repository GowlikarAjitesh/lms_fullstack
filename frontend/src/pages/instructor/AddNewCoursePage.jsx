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
  // console.log("This is userDetails from addNewCoursePage = ", userDetails.id);

  const {
    courseLandingFormData,
    setCourseLandingFormData,
    courseCurriculumFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);

  const params = useParams();
  const navigate = useNavigate();

  const [editSingleCourseData, setEditSingleCourseData] = useState(null);
  const [draftCourseId, setDraftCourseId] = useState(params.id || null);
  const [loading, setLoading] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [publishError, setPublishError] = useState("");

  const isEditMode = Boolean(params?.id);

  useEffect(() => {
    setDraftCourseId(params.id || null);
  }, [params.id]);

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
          imagePublicId: result.data.imagePublicId || "",
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
    // Basic landing info must be filled in before publishing.
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) return false;
    }

    // Must have at least one valid lecture to publish.
    return canPublishCourse();
  }

  function hasDraftContent() {
    // If the user has entered any basic course metadata OR uploaded media, consider it draftable.
    const hasLandingData = Boolean(courseLandingFormData.title?.trim());
    const hasCurriculumData = courseCurriculumFormData.some(
      (item) =>
        Boolean(item.title?.trim()) || Boolean(item.videoUrl?.trim())
    );

    return hasLandingData || hasCurriculumData;
  }

  function canPublishCourse() {
    // A course is publishable only if at least one lecture has title, video, and is marked as freePreview
    return courseCurriculumFormData.some((lecture) => {
      return (
        Boolean(lecture.title?.trim()) &&
        Boolean(lecture.videoUrl?.trim()) &&
        lecture.freePreview === true
      );
    });
  }

  // Clear the publish error as soon as the course becomes publishable
  useEffect(() => {
    if (publishError && canPublishCourse()) {
      setPublishError("");
    }
  }, [courseCurriculumFormData, publishError]);

  const lastAutoSaveToastRef = React.useRef(0);

  // Auto-save draft when user enters details; runs after a short debounce.
  React.useEffect(() => {
    if (!hasDraftContent()) return;
    if (draftSaving) return;

    const handler = setTimeout(async () => {
      setDraftSaving(true);
      const result = await saveCourse({ publish: false });
      setDraftSaving(false);

      if (result?.success) {
        const now = Date.now();
        // Show toast at most once every 15 seconds for auto-save
        if (now - lastAutoSaveToastRef.current > 15000) {
          toast.success("Draft saved");
          lastAutoSaveToastRef.current = now;
        }
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [courseLandingFormData, courseCurriculumFormData]);

  // -----------------------------
  // SUBMIT (CREATE / UPDATE)
  // -----------------------------
  async function saveCourse({ publish = false } = {}) {
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
      isPublished: publish,
    };

    let result;
    if (draftCourseId) {
      result = await updateCourseService(draftCourseId, formData);
    } else {
      result = await createCourseService(formData);
      if (result?.success) {
        setDraftCourseId(result.data._id);
        navigate(`/instructor/editCourse/${result.data._id}`, { replace: true });
      }
    }

    if (result?.success) {
      setEditSingleCourseData(result.data);
    }

    return result;
  }

  async function handleFormSubmit() {
    setPublishError("");

    if (!canPublishCourse()) {
      setPublishError("You must add at least one lecture with a title and video before publishing.");
      return;
    }

    setLoading(true);
    try {
      const result = await saveCourse({ publish: true });
      if (result?.success) {
        toast.success(result.message);
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCuriculumInitialFormData);
        setEditSingleCourseData(null);
        navigate(-1);
      } else {
        setPublishError(result.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
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

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Button
                disabled={draftSaving || loading}
                variant="outline"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const result = await saveCourse({ publish: false });
                    if (result?.success) {
                      toast.success("Draft saved successfully");
                    } else {
                      toast.error(result?.message || "Failed to save draft");
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
                className="text-sm tracking-wider font-bold px-6"
              >
                Save Draft
              </Button>

              <Button
                disabled={!validateFormData() || loading}
                onClick={handleFormSubmit}
                className="text-sm tracking-wider font-bold px-8"
              >
                {isEditMode ? "Publish" : "Publish"}
              </Button>
            </div>

            {/* Display a clear validation error when publish isn't allowed */}
            {publishError ? (
              <p className="text-sm text-red-600">{publishError}</p>
            ) : !canPublishCourse() && hasDraftContent() ? (<></>
              // <p className="text-sm text-red-600">
              //   You must add at least one lecture with a title and uploaded video before publishing.
              // </p>
            ) : null}
          </div>
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

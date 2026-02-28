import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import StudentContext from "@/context/student-context";
import { getSingleCourseToStudentService } from "@/service";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoPlayer from "@/components/videoPlayer/VideoPlayer";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export default function CourseDetailsPage() {
  const {
    currentCourseDetails,
    setcurrentCourseDetails,
    currentCourseId,
    setCurrentCourseId,
    globalLoadingState,
    setGlobalLoadingState,
  } = useContext(StudentContext);
  const [freePreviewLecturesList, setFreePreviewLecturesList] = useState([]);
  const [freePreviewDetailsDialog, setFreePreviewDetailsDialog] = useState({});
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const { id } = useParams();
  const location = useLocation();

  function handleSetFreePreview(courseItem) {
    setFreePreviewDetailsDialog(courseItem); // store full object
    setShowFreePreviewDialog(true);
  }

  async function fetchCurrentCourseDetails() {
    setGlobalLoadingState(true);
    const courseDetails =
      await getSingleCourseToStudentService(currentCourseId);

    if (courseDetails?.success) {
      setcurrentCourseDetails(courseDetails?.data);
    } else {
      setcurrentCourseDetails({});
    }

    setGlobalLoadingState(false);
  }

  useEffect(() => {
    if (id) setCurrentCourseId(id);
  }, [id]);

  useEffect(() => {
    if (currentCourseId) fetchCurrentCourseDetails();
  }, [currentCourseId]);

  useEffect(() => {
    if (!location.pathname.includes("/course/details")) {
      setcurrentCourseDetails({});
      setCurrentCourseId("");
    }
  }, []);

  useEffect(() => {
    setFreePreviewLecturesList(
      currentCourseDetails?.curriculum?.filter(
        (item) => item.freePreview == true,
      ),
    );
  }, [currentCourseDetails]);

  if (globalLoadingState) return <Skeleton className="h-screen w-full" />;
  console.log(currentCourseDetails, "currentCourseDetails");
  console.log(freePreviewLecturesList, "lectureList");

  const getIndexOfFreePreviewUrl =
    currentCourseDetails != null
      ? currentCourseDetails?.curriculum?.findIndex((item) => item.freePreview)
      : -1;

  console.log(getIndexOfFreePreviewUrl, "url");
  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">
          {currentCourseDetails?.title}
        </h1>
        <p className="text-xl mb-4 text-gray-400">
          {currentCourseDetails?.subtitle}
        </p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span>
            Created By {currentCourseDetails?.instructor?.instructorName}
          </span>
          <span>
            Created On{" "}
            {currentCourseDetails?.createdAt.toLocaleString().split("T")[0]}
          </span>
          <span className="flex items-center">
            <Globe className="h-4 w-4 mr-1" />
            {currentCourseDetails?.primaryLanguage}
          </span>
          <span>
            {currentCourseDetails?.students?.length}{" "}
            {currentCourseDetails?.students?.length > 1
              ? "Students"
              : "Student"}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="grow">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{currentCourseDetails?.description}</p>
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                What you'll Learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentCourseDetails?.objectives
                  .split(",")
                  .map((objectiveItem, index) => (
                    <li key={index} className="flex flex-row items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0" />
                      <span>{objectiveItem}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Course Curriculum
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentCourseDetails?.curriculum?.map(
                (curriculumItem, index) => (
                  <li
                    key={index}
                    className={`${curriculumItem?.freePreview ? "cursor-pointer" : "cursor-not-allowed"} flex items-center mb-4`}
                    onClick={
                      curriculumItem?.freePreview
                        ? () => handleSetFreePreview(curriculumItem)
                        : null
                    }
                  >
                    {curriculumItem?.freePreview ? (
                      <PlayCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    <span>{curriculumItem?.title}</span>
                  </li>
                ),
              )}
            </CardContent>
          </Card>
        </main>

        <aside className="w-full md:w-250">
          <Card className="sticky top-4">
            <CardContent className="p-6 flex flex-col">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl != -1
                      ? currentCourseDetails?.curriculum[
                          getIndexOfFreePreviewUrl
                        ].videoUrl
                      : ""
                  }
                />
              </div>
              <span className="text-3xl font-bold mb-4">
                {"₹"}
                {currentCourseDetails?.pricing}
              </span>
              <Button>BUY NOW</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={(open) => {
          setShowFreePreviewDialog(open);
          if (!open) setFreePreviewDetailsDialog({});
        }}
        className="w-full h-full"
      >
        <DialogContent className="max-w-3xl [&>button]:cursor-pointer">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>

          {/* Dropdown */}
          <Select
            value={freePreviewDetailsDialog?.public_id}
            onValueChange={(value) => {
              const preview = freePreviewLecturesList.find(
                (item) => item.public_id === value,
              );
              setFreePreviewDetailsDialog(preview);
            }}
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder="Select Preview" />
            </SelectTrigger>

            <SelectContent>
              {freePreviewLecturesList?.map((preview) => (
                <SelectItem
                  key={preview.public_id}
                  value={preview.public_id}
                  className="cursor-pointer"
                >
                  {preview.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Video */}
          {freePreviewDetailsDialog?.videoUrl && (
            <div className="mt-4 aspect-video rounded-lg overflow-hidden">
              <VideoPlayer url={freePreviewDetailsDialog.videoUrl} />
            </div>
          )}

          <div className="flex justify-start mt-6">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

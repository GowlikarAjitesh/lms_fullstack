import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCurrentCourseProgressService } from "@/service";
import AuthContext from "@/context/auth-context";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StudentContext from "@/context/student-context";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import VideoPlayer from "@/components/videoPlayer/VideoPlayer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CourseProgressPage() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  const { userDetails } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);

  const [loading, setLoading] = useState(true);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(
      userDetails?.id,
      courseId
    );

    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
        setLoading(false);
        return;
      }

      setStudentCurrentCourseProgress({
        courseDetails: response?.data?.courseDetails,
        progress: response?.data?.progress,
      });

      // const firstLecture = response?.data?.courseDetails?.curriculum?.[0];
      // setCurrentLecture(firstLecture);

      if (response?.data?.completed) {
        setShowCourseCompleteDialog(true);
        setShowConfetti(true);
      }
      if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          console.log("logging here");
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
              lastIndexOfViewedAsTrue + 1
            ]
          );
        }
    }

    setLoading(false);
  }

  useEffect(() => {
    if (userDetails?.id && courseId) {
      fetchCurrentCourseProgress();
    }
  }, [userDetails, courseId]);

  useEffect(() => {
    if (lockCourse) {
      toast.error("You need to purchase this course");
    }
  }, [lockCourse]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  if (loading) return <Skeleton className="h-[70vh] w-full" />;
  console.log(studentCurrentCourseProgress);
  console.log("current Lecture = ", currentLecture);
  return (
    <div className="flex flex-col w-full">

      {showConfetti && <Confetti width={width} height={height} />}

      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          <h1 className="text-lg font-semibold hidden md:block">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <div>
        <Button
        className="hover:bg-transparent bg-transparent"
          variant="ghost"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          >
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
          <span>{`${studentCurrentCourseProgress?.progress.length} %`} Completed</span>
      </div>
      </div>

      {/* MAIN PLAYER AREA */}
      <div className="flex w-full">

        {/* VIDEO SECTION */}
        <div className="flex flex-col flex-1 items-center p-6">

          <div className="w-full max-w-5xl aspect-video bg-black">
            <VideoPlayer
              width="100%"
              height="100%"
              url={currentLecture?.videoUrl}
              onProgressUpdate={setCurrentLecture}
              onProgressData={currentLecture}
            />
          </div>

          <div className="w-full max-w-5xl mt-4 bg-[#1c1d1f] p-6">
            <h2 className="text-2xl font-bold">
              {currentLecture?.title}
            </h2>
          </div>

        </div>

        {/* SIDEBAR */}
        {isSideBarOpen && (
          <div className="w-100 bg-[#1c1d1f] border-l border-gray-700 p-4">
            <Tabs defaultValue="content" className="h-full flex flex-col">
              <TabsList className="grid bg-[#1c1d1f] text-white w-full grid-cols-2 p-0 h-14">
                <TabsTrigger value="content" className="text-white rounded-none h-full">Course Content</TabsTrigger>
                <TabsTrigger value="overview" className="text-white rounded-none h-full">Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="content">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    {
                      studentCurrentCourseProgress?.courseDetails?.curriculum?.map((item) => (
                        <div className="flex items-center space-x-2 text-sm text-white font-semibold cursor-pointer" key={item?._id}>
                          <span>{item?.title}</span>
                        </div>
                      ))
                    }
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="overview" className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="p-4">
                        <h2 className="text-xl font-bold mb-4">About this Course</h2>
                        <p className="text-gray-400">{studentCurrentCourseProgress?.courseDetails?.description}</p>
                      </div>
                    </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* LOCK COURSE DIALOG */}
      <Dialog open={lockCourse}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You can't view this page</DialogTitle>
            <DialogDescription>
              Please purchase this course to get access
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end">
            <DialogClose asChild>
              <Button onClick={() => navigate(`/course/details/${courseId}`)}>
                Go to Course
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* COURSE COMPLETE DIALOG */}
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription className="flex flex-col gap-4">
              <Label>You have completed the course</Label>

              <div className="flex gap-3">
                <Button onClick={() => navigate(`/explore-courses`)}>
                  Browse Courses
                </Button>

                <Button variant="outline">
                  Restart Course
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  );
}
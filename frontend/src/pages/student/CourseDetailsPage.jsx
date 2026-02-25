import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import StudentContext from "@/context/student-context";
import { getSingleCourseToStudentService } from "@/service";
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function CourseDetailsPage() {
  const {
    currentCourseDetails,
    setcurrentCourseDetails,
    currentCourseId,
    setCurrentCourseId,
    globalLoadingState,
    setGlobalLoadingState,
  } = useContext(StudentContext);

  const { id } = useParams();

  async function fetchCurrentCourseDetails() {
    setGlobalLoadingState(true);
    const courseDetails = await getSingleCourseToStudentService(
      currentCourseId
    );

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

  if (globalLoadingState) return <Skeleton className="h-screen w-full" />;

  const {
    title,
    subtitle,
    description,
    image,
    pricing,
    level,
    category,
    instructor,
    curriculum,
    objectives,
    primaryLanguage,
  } = currentCourseDetails || {};

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <div className="bg-gray-900 text-white py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          {/* LEFT CONTENT */}
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-4xl font-bold">{title}</h1>
            <p className="text-lg text-gray-300">{subtitle}</p>

            <div className="flex gap-4 text-sm text-gray-400">
              <span>Category: {category}</span>
              <span>Level: {level}</span>
              <span>Language: {primaryLanguage}</span>
            </div>

            <p className="text-sm">
              Created by{" "}
              <span className="font-semibold text-white">
                {instructor?.instructorName}
              </span>
            </p>
          </div>

          {/* RIGHT CARD */}
          <div className="bg-white text-black rounded-xl shadow-lg p-4">
            <img
              src={image}
              alt={title}
              className="rounded-md mb-4 h-48 w-full object-cover"
            />
            <h2 className="text-2xl font-bold mb-2">₹{pricing}</h2>
            <Button className="w-full mb-2">Enroll Now</Button>
            <Button variant="outline" className="w-full">
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-10 space-y-10">
        {/* Description */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Course Description</h2>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>

        {/* Objectives */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
          <ul className="grid md:grid-cols-2 gap-3">
            {objectives?.split("\n").map((item, index) => (
              <li key={index} className="flex gap-2 text-gray-700">
                <span>✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Curriculum */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Course Content ({curriculum?.length} Lectures)
          </h2>

          <div className="border rounded-lg divide-y">
            {curriculum?.map((lecture, index) => (
              <div
                key={lecture._id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {index + 1}. {lecture.title}
                  </p>
                  {lecture.freePreview && (
                    <span className="text-xs text-green-600">
                      Free Preview Available
                    </span>
                  )}
                </div>

                {lecture.freePreview && (
                  <a
                    href={lecture.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 text-sm"
                  >
                    Watch
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InstructorContext from "@/context/instructorContext";
import { mediaUploadService } from "@/service";
import React, { useContext, useRef } from "react";
import MediaProgressBar from "@/components/mediaProgressLoader/MediaProgressBar";

export default function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    courseMediaProgress,
    courseMediaProgressPercentage,
    setCourseMediaProgress,
    setCourseMediaProgressPercentage,
  } = useContext(InstructorContext);

  const replaceImageInputRef = useRef(null);

  async function handleImageChange(event) {
    const selectedImage = event.target.files[0];

    if (!selectedImage) return;

    const imageFormData = new FormData();
    imageFormData.append("file", selectedImage);

    try {
      setCourseMediaProgress(true);
      const result = await mediaUploadService(
        imageFormData,
        setCourseMediaProgressPercentage,
      );

      if (result.success) {
        setCourseLandingFormData((prev) => ({
          ...prev,
          image: result.data.url,
          imagePublicId: result.data.public_id,
        }));
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setCourseMediaProgress(false);
    }
  }

  async function handleReplaceImage(event) {
    const selectedImage = event.target.files[0];
    if (!selectedImage) return;

    const imageFormData = new FormData();
    imageFormData.append("file", selectedImage);
    imageFormData.append("publicId", courseLandingFormData.imagePublicId);

    try {
      setCourseMediaProgress(true);
      const result = await mediaUploadService(
        imageFormData,
        setCourseMediaProgressPercentage,
      );

      if (result.success) {
        setCourseLandingFormData((prev) => ({
          ...prev,
          image: result.data.url,
          imagePublicId: result.data.public_id,
        }));
      }
    } catch (error) {
      console.log("Error replacing image:", error);
    } finally {
      setCourseMediaProgress(false);
      event.target.value = "";
    }
  }

  function handleReplaceClick() {
    replaceImageInputRef.current?.click();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>

      {courseMediaProgress ? (
        <div className="p-4">
          <MediaProgressBar
            isMediaUploading={courseMediaProgress}
            progress={courseMediaProgressPercentage}
          />
        </div>
      ) : null}

      <CardContent>
        {courseLandingFormData.image ? (
          <div className="relative w-full max-w-md">
            <img
              src={courseLandingFormData.image}
              alt="Course"
              className="w-full h-56 object-cover rounded-lg shadow-md border"
            />

            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={handleReplaceClick} className={"cursor-pointer"}>
                Replace Image
              </Button>
              <input
                type="file"
                ref={replaceImageInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleReplaceImage}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <Input
              type="file"
              accept="image/*"
              className="mb-4"
              onChange={(event) => handleImageChange(event)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

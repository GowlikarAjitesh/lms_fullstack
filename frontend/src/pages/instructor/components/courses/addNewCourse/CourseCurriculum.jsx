import React, { useContext, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, RefreshCw, Upload, UploadIcon } from "lucide-react";
import { mediaUploadService, mediaDeleteService, mediaBulkUploadService } from "@/service/index";
import InstructorContext from "@/context/instructorContext";
import { courseCuriculumInitialFormData } from "@/config";
import MediaProgressBar from "@/components/mediaProgressLoader/MediaProgressBar";
import VideoPlayer from "@/components/videoPlayer/VideoPlayer";

export default function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    courseMediaProgress,
    setCourseMediaProgress,
    courseMediaProgressPercentage,
    setCourseMediaProgressPercentage,
  } = useContext(InstructorContext);

  // Hidden input for the Replace functionality
  const replaceInputRef = useRef(null);
  const bulkUploadInputRef = useRef(null);
  const [currentReplaceIndex, setCurrentReplaceIndex] = useState(null);

  function handleAddNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      { ...courseCuriculumInitialFormData },
    ]);
  }

  function handleInputChange(event, index) {
    let updateCurriculum = [...courseCurriculumFormData];
    updateCurriculum[index].title = event.target.value;
    setCourseCurriculumFormData(updateCurriculum);
  }

  function handleToggleFreePreview(value, index) {
    let updateCurriculum = [...courseCurriculumFormData];
    updateCurriculum[index].freePreview = value;
    setCourseCurriculumFormData(updateCurriculum);
  }

  // --- REPLACING LOGIC ---
  function handleReplaceClick(index) {
    setCurrentReplaceIndex(index);
    if (replaceInputRef.current) {
      replaceInputRef.current?.click();
    }
  }

  async function handleVideoReplace(event) {
    const selectedFile = event.target.files[0];
    const index = currentReplaceIndex;

    if (selectedFile && index !== null) {
      const oldPublicId = courseCurriculumFormData[index].public_id;
      const videoFormData = new FormData();
      // Appending publicId tells the backend to overwrite
      videoFormData.append("publicId", oldPublicId);
      videoFormData.append("file", selectedFile);

      try {
        setCourseMediaProgress(true);
        const result = await mediaUploadService(
          videoFormData,
          setCourseMediaProgressPercentage
        );

        if (result.success) {
          let updateCurriculum = [...courseCurriculumFormData];
          updateCurriculum[index].videoUrl = result.data.url;
          updateCurriculum[index].public_id = result.data.public_id;
          setCourseCurriculumFormData(updateCurriculum);
        }
      } catch (error) {
        console.error("Replace failed", error);
      } finally {
        setCourseMediaProgress(false);
        setCurrentReplaceIndex(null);
        event.target.value = ""; // Clear for future changes
      }
    }
  }

  // --- NEW UPLOAD LOGIC ---
  async function handleVideoUploadChange(event, index) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);
      try {
        setCourseMediaProgress(true);
        const result = await mediaUploadService(
          videoFormData,
          setCourseMediaProgressPercentage
        );
        if (result.success) {
          let updateCurriculum = [...courseCurriculumFormData];
          updateCurriculum[index].public_id = result?.data?.public_id;
          updateCurriculum[index].videoUrl = result?.data?.url;
          setCourseCurriculumFormData(updateCurriculum);
        }
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setCourseMediaProgress(false);
      }
    }
  }

  // --- DELETE LOGIC ---
  async function handleDeleteVideo(index) {
    const publicId = courseCurriculumFormData[index].public_id;
    if (publicId) {
      try {
        setCourseMediaProgress(true);
        const result = await mediaDeleteService(publicId);
        if (result?.success) {
          let updated = [...courseCurriculumFormData];
          updated[index].videoUrl = "";
          updated[index].public_id = "";
          setCourseCurriculumFormData(updated);
        }
      } catch (error) {
        console.error("Delete failed", error);
      } finally {
        setCourseMediaProgress(false);
      }
    }
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return item && item.title?.trim() !== "" && item.videoUrl?.trim() !== "";
    });
  }

    function areAllFieldsOfCourseCuriculumFormDataEmpty(arr) {
      return arr.every((obj)=>{
        return Object.entries(obj).every(([key, value]) => {
          if(typeof value === 'boolean') {
            return true;
          }
          return value == "";
        })
      })
  }


async function handleBulkUploadInputChange(event) {
  const files = event.target.files;
  if (!files?.length) return;

  const formData = new FormData();
  Array.from(files).forEach(file => {
    // console.log("Bulk upload file:", file);
    formData.append("files", file);
  });

  try {
    setCourseMediaProgress(true);

    const response = await mediaBulkUploadService(
      formData,
      setCourseMediaProgressPercentage
    );

    if (!response?.success) return;

    setCourseCurriculumFormData(prevData => {

      const baseData = areAllFieldsOfCourseCuriculumFormDataEmpty(prevData)
        ? []
        : [...prevData];

      const newLectures = response.data.map((file, index) => ({
        title: `Lecture ${baseData.length + index + 1}`,
        videoUrl: file.url,
        freePreview: false,
        public_id: file.public_id,
      }));

      return [...baseData, ...newLectures];
    });

  } catch (error) {
    console.error("Bulk Upload Error:", error);
  } finally {
    setCourseMediaProgress(false);
    event.target.value = "";
  }
}

  function handleBulkUploadButtonClick(){
    bulkUploadInputRef.current?.click();
  }

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
          
      <input
        type="file"
        ref={bulkUploadInputRef}
        className="hidden"
        multiple
        accept="video/*"
        id="bulk-media-upload"
        onChange={handleBulkUploadInputChange}
        // onChange={()=>handleBulkUploadButtonClick()}
      />

          <Button variant="outline" className="cursor-pointer" onClick={()=>handleBulkUploadButtonClick()}><Upload className="w-4 h-4 mr-2"/> Bulk Upload</Button>
        </div>
      </CardHeader>

      {/* Hidden input used for Replace function */}
      <input
        type="file"
        ref={replaceInputRef}
        className="hidden"
        accept="video/*"
        onChange={handleVideoReplace}
      />

      <CardContent>
        <Button
          onClick={handleAddNewLecture}
          disabled={!isCourseCurriculumFormDataValid() || courseMediaProgress}
        >
          <Plus className="mr-2" /> Add Lecture
        </Button>

        {courseMediaProgress && (
          <div className="mt-4">
            <MediaProgressBar
              isMediaUploading={courseMediaProgress}
              progress={courseMediaProgressPercentage}
            />
          </div>
        )}

        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((courseCuriculum, index) => (
            <div className="border p-5 rounded-md" key={index}>
              <div className="flex gap-5 items-center mb-4">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Input
                  placeholder="Enter Lecture title"
                  className="max-w-96"
                  value={courseCuriculum.title || ""}
                  onChange={(event) => handleInputChange(event, index)}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={courseCuriculum.freePreview ?? false}
                    onCheckedChange={(value) => handleToggleFreePreview(value, index)}
                  />
                  <Label>Free Preview</Label>
                </div>
              </div>

              <div className="mt-4">
                {courseCuriculum.videoUrl ? (
                  <div className="flex flex-col gap-3">
                    <div className="max-w-2xl">
                      <VideoPlayer url={courseCuriculum.videoUrl} />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleReplaceClick(index)}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4" /> Replace
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex items-center gap-2 bg-red-700"
                        onClick={() => handleDeleteVideo(index)}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(event) => handleVideoUploadChange(event, index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
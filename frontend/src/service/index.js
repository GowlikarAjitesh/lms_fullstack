import axiosInstance from "@/api/axiosInstance";

export async function mediaUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/api/instructor/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });
  console.log("Media upload service = ", data);
  return data;
}

export async function mediaDeleteService(public_id) {
  const { data } = await axiosInstance.delete(`/api/instructor/media/delete/${public_id}`);
  return data;
}


export async function createCourseService(formData){
  const {data} = await axiosInstance.post(`/api/instructor/course/add`, formData);
  return data;
}


export async function getAllCoursesService(){
  const {data} = await axiosInstance.get(`/api/instructor/course/get`);
  return data;
}


export async function togglePublishCourseService(courseId, isPublished){
  const {data} = await axiosInstance.put(
      `/api/instructor/course/${courseId}/publish`,
      { isPublished },
      { withCredentials: true }
    );

    return data;
}


export async function getSingleCourseService(id){
  const {data} = await axiosInstance.get(`/api/instructor/course/get/${id}`);
  return data;
}

export async function updateCourseService(id, formData){
  
  const {data} = await axiosInstance.put(`/api/instructor/course/update/${id}`, formData);
  return data;
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/api/instructor/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });
  console.log("Media service = ", data);
  return data;
}

export async function getAllCoursesToStudentService(query=""){
  const {data} = await axiosInstance.get(`/api/student/course/get?${query}`);
  return data;
}


export async function getSingleCourseToStudentService(id){
  const {data} = await axiosInstance.get(`/api/student/course/get/${id}`);
  return data;
}


export async function checkSingleCoursePurchasedService(courseId, studentId){
  const {data} = await axiosInstance.get(`/api/student/course/progress/get/${courseId}/${studentId}`);
  return data;
}

export async function getCourseForProgressService(courseId){
  const {data} = await axiosInstance.get(`/api/student/course/progress/${courseId}`);
  return data;
}


export async function createPaymentService(formData){
  const {data} = await axiosInstance.post(`/api/student/order/create/`, formData);
  return data;
}

export async function captureAndFinalizePaymentService(formData){
  const {data} = await axiosInstance.post(`/api/student/order/capture`, formData);
  return data;

}

export async function getStudentBoughtCoursesService(studentId){
  const {data} = await axiosInstance.get(`/api/student/courses-bought/get/${studentId}`);
  return data;

}


export async function getCurrentCourseProgressService(userId, courseId){
  const {data} = await axiosInstance.get(`/api/student/course-progress/get/${userId}/${courseId}`);
  return data;
}


export async function markCurrentCourseLectureAsViewedService(userId, courseId, lectureId){
  const {data} = await axiosInstance.post(`/api/student/course-progress/mark-lecture-viewed`, {
    userId, courseId, lectureId
  });
  return data;
}

export async function resetCurrentCourseProgressService(userId, courseId){
  const {data} = await axiosInstance.post(`/api/student/course-progress/reset-progress`,{
    userId, courseId
  });
  return data;
}

export async function requestInstructorService(body) {
  const { data } = await axiosInstance.post(`/api/user/instructor-request`, body);
  return data;
}

export async function getInstructorRequestsService() {
  const { data } = await axiosInstance.get(`/api/admin/instructor-requests`);
  return data;
}

export async function approveInstructorRequestService(userId) {
  const { data } = await axiosInstance.post(`/api/admin/instructor-requests/${userId}/approve`);
  return data;
}

export async function rejectInstructorRequestService(userId) {
  const { data } = await axiosInstance.post(`/api/admin/instructor-requests/${userId}/reject`);
  return data;
}

export async function getAllUsersService(role) {
  const params = role ? `?role=${encodeURIComponent(role)}` : "";
  const { data } = await axiosInstance.get(`/api/admin/users${params}`);
  return data;
}

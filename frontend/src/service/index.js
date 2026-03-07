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
import React, { createContext, useState } from 'react'

const StudentContext = createContext();
export default StudentContext;

export function StudentProvider({children}) {
    const [studentCoursesList, setStudentCoursesList] = useState([]);
    const [globalLoadingState, setGlobalLoadingState] = useState(true);
    const [currentCourseDetails, setcurrentCourseDetails] = useState({});
    const [currentCourseId, setCurrentCourseId] = useState('');
    const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
    const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] = useState({});

  return (
    <StudentContext.Provider value={{studentCoursesList, setStudentCoursesList, globalLoadingState, setGlobalLoadingState, currentCourseDetails, setcurrentCourseDetails, currentCourseId, setCurrentCourseId, studentBoughtCoursesList, setStudentBoughtCoursesList, studentCurrentCourseProgress, setStudentCurrentCourseProgress}}>{children}</StudentContext.Provider>
  )
}

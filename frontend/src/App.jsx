import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthContext from "@/context/auth-context";
import RouteGuard from "@/components/rotueGuard/index";

import Layout from "@/pages/Layout";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";

// Student Pages
import Home from "@/pages/student/Home";
import ExploreCoursesPage from "./pages/student/ExploreCoursesPage";
import MyCoursesPages from "./pages/student/MyCoursesPages";

// Instructor Pages
import InstructorLayoutPage from "@/pages/instructor/InstructorLayoutPage";
import InstructorDashboard from "@/pages/instructor/components/dashboard/InstructorDashboard";
import InstructorCourses from "@/pages/instructor/components/courses/InstructorCourses";
import AddNewCoursePage from "@/pages/instructor/AddNewCoursePage";

// Common
import NotFoundPage from "@/pages/NotFoundPage";
import { Toaster } from "sonner";
import CourseDetailsPage from "./pages/student/CourseDetailsPage";

function App() {
  const auth = useContext(AuthContext);

  if (auth.loading) return <Toaster/>;

  return (
    <>
      <Routes>

        {/* {public Routes } */}
        <Route path="/" element={<Layout />}>

        {/* 🔐 Global Route Guard */}
        <Route
          element={
            <RouteGuard
              authenticated={auth.isAuth}
              user={auth.userDetails}
            />
          }
        >

          {/* 🌍 Global Layout */}

            {/* 🔓 Auth Routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            {/* <Route path="/" element={<Home />} /> */}



            {/* 🎓 Student Routes */}
            <Route path="/">
              <Route index element={<Home />} />
              <Route path="explore-courses" element={<ExploreCoursesPage/>}/>
              <Route path="my-courses" element={<MyCoursesPages/>}/>
              <Route path="course/details/:id" element={<CourseDetailsPage/>}/>

            </Route>



            {/* 👨‍🏫 Instructor Routes */}
            <Route path="/instructor" element={<InstructorLayoutPage />}>
              <Route index element={<InstructorDashboard />} />
              <Route path="dashboard" element={<InstructorDashboard />} />
              <Route path="courses" element={<InstructorCourses />} />
              <Route path="newCourse" element={<AddNewCoursePage />} />
              <Route path="editCourse/:id" element={<AddNewCoursePage />} />
            </Route>
        </Route>




        <Route path="*" element={<NotFoundPage />} />
        
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );  
}

export default App;

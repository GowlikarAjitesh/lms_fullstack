"use server";

import axios from "axios";
import axiosInstance from "@/api/axiosInstance";
const BACKEND_URL =  "http://localhost:3000";

export function validateRegister(formData) {
  const errors = {};

  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (!username) {
    errors.username = "Username is required";
  } else if (username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm Password is required";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}


export async function registerFormActions(userDetails) {
  // console.log(userDetails);
  try {
    const res = await axiosInstance.post(`/api/auth/register`, userDetails);
    // console.log("Response from server:", res);
    return res.data; // success case
  } catch (err) {
    if (err.response) {
      console.error("Error response:", err.response.data);
      return err.response.data; // <-- return backend error JSON
    } else {
      console.error("Network error:", err.message);
      return { success: false, message: "Network error" };
    }
  }
}

export async function loginFormActions(userDetails) {
  // console.log(userDetails);
  try {
    const res = await axiosInstance.post(`/api/auth/login`, userDetails);
    // console.log("Response from server:", res);
    return res.data; // success case
  } catch (err) {
    if (err.response) {
      console.error("Error response:", err.response.data);
      return err.response.data; // <-- return backend error JSON
    } else {
      console.error("Network error:", err.message);
      return { success: false, message: "Network error" };
    }
  }
}


// ----------------------useActionState Hook-------------------------------------------------------


// export async function registerFormActions(prevState, formData) {
//   let userDetails={
//     "username" : formData.get('username'),
//     "email" : formData.get('email'),
//     "password" : formData.get('password'),
//     "confirmPassword" : formData.get('confirmPassword'),
//   };
//   console.log(userDetails);
//   try {
//     const res = await axios.post(`${BACKEND_URL}/api/auth/register`, userDetails);
//     console.log("Response from server:", res);
//     return res.data; // success case
//   } catch (err) {
//     if (err.response) {
//       console.error("Error response:", err.response.data);
//       return err.response.data; // <-- return backend error JSON
//     } else {
//       console.error("Network error:", err.message);
//       return { success: false, message: "Network error" };
//     }
//   }
// }
// export async function loginFormActions(prevState, formData) {
//     console.log("Previous state: ", prevState);
//   let userDetails={
//     "email" : formData.get('email'),
//     "password" : formData.get('password'),
//   };
  
//   await new Promise((r)=>setTimeout(r, 3000));

//   console.log("user data sent successfully...", userDetails);
// //   return prevState;
// }

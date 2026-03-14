// auth-context.jsx
import { createContext, useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { Toaster } from "sonner";

const AuthContext = createContext(null);
export default AuthContext;

export function sanitizeUserDetails(user) {
  if (!user) return null;

  const { id, _id, username, email, role, profileImage, bio, phone } = user;
  return {
    id: id || _id,
    username,
    email,
    role,
    profileImage,
    bio,
    phone,
  };
}

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error();

        const res = await axiosInstance.get("/api/auth/check-auth");
        const sanitizedUser = sanitizeUserDetails(res.data.data);

        const storedUserDetails = localStorage.getItem("userDetails");
        if (!storedUserDetails) {
          localStorage.setItem("userDetails", JSON.stringify(sanitizedUser));
          setUserDetails(sanitizedUser);
        } else {
          const parsed = JSON.parse(storedUserDetails);
          setUserDetails(sanitizeUserDetails(parsed) || sanitizedUser);
        }

        setIsAuth(true);
      } catch {
        setIsAuth(false);
        setUserDetails(null);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuth, userDetails, setIsAuth, setUserDetails, loading }}
    >
      {loading ? <Toaster/> : children}
    </AuthContext.Provider>
  );
}

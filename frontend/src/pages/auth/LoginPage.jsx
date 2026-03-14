// src/pages/Login.jsx
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { LoginSchema } from "@/common/yupSchema";
import { loginFormActions } from "@/pages/auth/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/PasswordInput";
import AuthContext, { sanitizeUserDetails } from "@/context/auth-context";
export default function LoginPage() {

  const {setIsAuth, setUserDetails} = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    const response = await loginFormActions(values);

    if (response.success) {
      toast.success(response.message || "Login successful!");

      const user = sanitizeUserDetails(response.data);

      localStorage.setItem("accessToken", response.token);
      localStorage.setItem("userDetails", JSON.stringify(user));

      setIsAuth(true);
      setUserDetails(user);

      // Navigate based on user role
      if (user?.role === "instructor" || user?.role === "admin") {
        navigate("/instructor/dashboard", { replace: true });
      } else {
        // Student: navigate to home page or the original destination
        navigate(from || "/", { replace: true });
      }

      // console.log("Navigation = ", user?.role === "instructor");
    } else {
      toast.error(
        response.message ||
          "Login failed. Please check your credentials and try again.",
      );
    }
    setSubmitting(false);
  };
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <Card className="w-100 shadow-xl border border-border bg-card text-foreground">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Login in to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ credential: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="usernameOrEmail">Username or Email</Label>
                  <Field
                    as={Input}
                    id="credential"
                    name="credential"
                    placeholder="Enter username or Email"
                    className="bg-input border-border text-foreground placeholder-muted-foreground"
                  />
                  <ErrorMessage
                    name="credential"
                    component="p"
                    className="text-destructive text-sm"
                  />
                </div>
                {/* Password */}
                <PasswordInput id="password" name="password" label="Password" />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-destructive text-sm"
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                >
                  {isSubmitting ? "Logging In..." : "Login"}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
          <p className="text-center">
            Don’t have an account?{" "}
            <Link
              to="/auth/register"
              className="text-primary hover:underline"
            >
              Register
            </Link>
          </p>
          <p className="text-center">
            <Link to="/auth/forgot-password" className="hover:underline">
              Forgot password?
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

import React, { useActionState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "@/components/PasswordInput"; // your reusable component
import { RegisterSchema } from "@/common/yupSchema"; // your validation schema
import { registerFormActions } from "./auth-actions"; // your server action
import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL =  "http://localhost:3000";

export default function RegisterPage() {
  // const [state, formAction, isPending] = useActionState(registerFormActions, {});
  // console.log("Action State:", state);
  const Navigate = useNavigate();
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <Card className="w-100 shadow-xl border border-border bg-card text-foreground">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create A New Account</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Register to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
              role: "user", // store as "user" on backend (student)
            }}
            validationSchema={RegisterSchema}
            onSubmit={async (values, { setSubmitting }) => {
              console.log("Form submitted:", values);
              setSubmitting(true);
              const response = await registerFormActions(values);
              if (response.success) {
                toast.success(response.message || "Registration successful!");
                Navigate("/auth/login");
              } else {
                toast.error(response.message || "Registration failed. Please try again.");
              }
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Field
                    as={Input}
                    id="username"
                    name="username"
                    placeholder="Enter a Unique username"
                    className="bg-input border-border text-foreground placeholder-muted-foreground"
                  />
                  <ErrorMessage name="username" component="p" className="text-destructive text-sm" />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="bg-input border-border text-foreground placeholder-muted-foreground"
                  />
                  <ErrorMessage name="email" component="p" className="text-destructive text-sm" />
                </div>

                {/* Password */}
                <PasswordInput id="password" name="password" label="Password" />
                <ErrorMessage name="password" component="p" className="text-destructive text-sm" />

                {/* Confirm Password */}
                <PasswordInput id="confirmPassword" name="confirmPassword" label="Confirm Password" />
                <ErrorMessage name="confirmPassword" component="p" className="text-destructive text-sm" />

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Field
                    as="select"
                    id="role"
                    name="role"
                    className="w-full rounded-md border bg-input px-3 py-2 text-foreground"
                  >
                    <option value="user">Student</option>
                    <option value="instructor">Instructor</option>
                  </Field>
                  <ErrorMessage name="role" component="p" className="text-destructive text-sm" />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
          <p className="text-center">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
















// ------------------------------------------ useActionState Hook ------------------------------------------



// import React, { useActionState, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import PasswordInput from "@/components/PasswordInput";
// import { Label } from "@/components/ui/label";
// import { Link } from "react-router-dom";
// import { registerFormActions, validateRegister } from "./auth-actions";

// export default function RegisterPage() {
//   const [state, formAction, isPending] = useActionState(registerFormActions, {});
//   const [errors, setErrors] = useState({});

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const validationErrors = validateRegister(formData);

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     // If no errors, call server action
//     formAction(formData);
//   };

//   return (
//     <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black">
//       <Card className="w-100 shadow-xl border border-gray-700 bg-gray-900 text-white">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-center">Create A New Account</CardTitle>
//           <CardDescription className="text-center text-muted-foreground">
//             Register to continue
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form className="space-y-4" onSubmit={handleSubmit}>
//             {/* Username */}
//             <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 type="text"
//                 name="username"
//                 placeholder="Enter a Unique username"
//                 className="bg-input border-border text-foreground placeholder-muted-foreground"
//               />
//               {errors.username && <p className="text-destructive text-sm">{errors.username}</p>}
//             </div>

//             {/* Email */}
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 name="email"
//                 placeholder="you@example.com"
//                 className="bg-input border-border text-foreground placeholder-muted-foreground"
//               />
//               {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
//             </div>

//             {/* Password */}
//             <PasswordInput id="password" name="password" label="Password" />
//             {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}

//             {/* Confirm Password */}
//             <PasswordInput id="confirmPassword" name="confirmPassword" label="Confirm Password" />
//             {errors.confirmPassword && <p className="text-destructive text-sm">{errors.confirmPassword}</p>}

//             <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
//               {isPending ? "Registering..." : "Register"}
//             </Button>
//           </form>
//         </CardContent>
//         <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
//           <p className="text-center">
//             Already have an account?{" "}
//             <Link to="/auth/login" className="text-primary hover:underline">
//               Login
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
import * as Yup from "yup";
export const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  role: Yup.string()
    .oneOf(["user", "instructor"], "Please select a valid role")
    .required("Role is required"),
});

export const LoginSchema = Yup.object().shape({
  credential: Yup.string()
    .required("Username or Email is required")
    .test("is-username-or-email", "Must be a valid email or username", (value) => {
      if (!value) return false;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameRegex = /^[a-zA-Z0-9._-]{3,}$/; // at least 3 chars, alphanumeric + . _ -

      return emailRegex.test(value) || usernameRegex.test(value);
    }),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

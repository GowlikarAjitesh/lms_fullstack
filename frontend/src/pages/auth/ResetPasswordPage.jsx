// src/pages/auth/ResetPasswordPage.jsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { resetPasswordService } from "@/service";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setToken(params.get("token") || "");
    setEmail(params.get("email") || "");
  }, [location.search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      toast.error("Reset token is missing.");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPasswordService({
        token,
        password,
        confirmPassword,
      });

      if (response.success) {
        toast.success(response.message || "Password reset successfully.");
        navigate("/auth/login");
      } else {
        toast.error(response.message || "Unable to reset password.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <Card className="w-100 shadow-xl border border-border bg-card text-foreground">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Set a New Password</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {email ? `Resetting password for ${email}` : "Enter a new password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="bg-input border-border text-foreground placeholder-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="bg-input border-border text-foreground placeholder-muted-foreground"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
          <p className="text-center">
            Remembered your password?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
          <p className="text-center">
            Don’t have an account?{" "}
            <Link to="/auth/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

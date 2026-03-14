// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-background text-foreground">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-muted-foreground mt-2 mb-6">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
        <Link to="/">Go back Home</Link>
      </Button>
    </div>
  );
}
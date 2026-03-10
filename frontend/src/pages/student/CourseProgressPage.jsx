import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { checkSingleCoursePurchasedService } from "@/service";
import AuthContext from "@/context/auth-context";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
export default function CourseProgressPage() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { userDetails } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPurchase = async () => {
      if (!userDetails?.id || !courseId) return;

      const result = await checkSingleCoursePurchasedService(courseId, userDetails.id);

      if (result?.success && !result?.data) {
        toast.error("You have not purchased this course");
        navigate(`/course/details/${courseId}`);
      }

      setLoading(false);
    };

    checkPurchase();
  }, [courseId, userDetails, navigate]);

  if (loading) return <Skeleton className="h-screen w-full" />;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="font-semibold flex items-center cursor-pointer"
            size="sm"
            onClick={() => navigate("/courses")}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Courses
          </Button>
        </div>
      </div>
    </div>
  );
}
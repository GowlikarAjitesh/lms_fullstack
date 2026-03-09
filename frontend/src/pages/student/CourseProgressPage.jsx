import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { checkSingleCoursePurchasedService } from "@/service";
import AuthContext from "@/context/auth-context";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseProgressPage() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { userDetails } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPurchase = async () => {
      if (!userDetails?.id) return;

      const result = await checkSingleCoursePurchasedService(courseId, userDetails.id);

      if (result?.success && !result?.data) {
        toast.error("You have not purchased this course");
        navigate(`/course/details/${courseId}`);
      }

      setLoading(false);
    };

    checkPurchase();
  }, [courseId, userDetails]);

  if (loading) return <Skeleton className="h-screen w-full" />;

  return (
    <div>
      This is Course Progress Page
    </div>
  );
}
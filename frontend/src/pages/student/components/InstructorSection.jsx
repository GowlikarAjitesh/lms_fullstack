import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAllInstructorsService } from "@/service";

export default function InstructorSection() {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const result = await getAllInstructorsService();
        if (result?.success) {
          setInstructors(result.data || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const handleInstructorClick = (instructorId) => {
    // navigate(`/explore-courses?instructorId=${encodeURIComponent(instructorId)}`);
  };

  const getInitial = (instructor) => {
    const name = instructor?.username || instructor?.name || "I";
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <section className="py-16 border-indigo-500">
<div className="container mx-auto px-6 text-center">
  <h2 className="text-3xl font-bold mb-4">Top Instructors</h2>
  <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
    Learn from passionate instructors who bring real knowledge, practical insights,
    and engaging teaching styles to help you build skills with confidence.
  </p>
        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-muted p-6 rounded-xl shadow-md animate-pulse"
              >
                <div className="w-24 h-24 rounded-full bg-muted mx-auto" />
                <div className="mt-4 h-6 w-24 bg-muted mx-auto" />
                <div className="mt-2 h-4 w-32 bg-muted mx-auto" />
              </div>
            ))
          ) : instructors.length === 0 ? (
            <div className="text-muted-foreground">No instructors found.</div>
          ) : (
            instructors.map((instructor) => (
              <Button
                key={instructor._id}
                variant="outline"
                className="flex flex-col items-center p-6 rounded-xl shadow-md text-left h-auto cursor-pointer"
                onClick={() => handleInstructorClick(instructor._id)}
              >
                {instructor.profileImage ? (
                  <img
                    src={instructor.profileImage}
                    alt={instructor.username || instructor.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center bg-primary text-primary-foreground text-3xl font-bold">
                    {getInitial(instructor)}
                  </div>
                )}

                <h3 className="mt-4 font-semibold">
                  {instructor.username || instructor.name}
                </h3>

                {instructor.bio && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                    {instructor.bio}
                  </p>
                )}
              </Button>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
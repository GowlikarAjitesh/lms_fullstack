import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  IndianRupee,
  MonitorPlay,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

export default function TeachOnLMSPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Create engaging courses",
      description:
        "Build structured lessons with videos, descriptions, and curriculum that students can follow easily.",
    },
    {
      icon: Users,
      title: "Reach more learners",
      description:
        "Share your knowledge with students who want to learn practical skills from real instructors.",
    },
    {
      icon: IndianRupee,
      title: "Earn from your expertise",
      description:
        "Set your course pricing and grow your teaching profile while helping others learn.",
    },
    {
      icon: MonitorPlay,
      title: "Teach your way",
      description:
        "Upload lessons, manage content, and publish courses whenever you are ready.",
    },
  ];

  const steps = [
    "Plan your course topic and audience",
    "Add course details and curriculum",
    "Upload lectures and learning content",
    "Publish your course and start teaching",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium mb-5">
                Become an Instructor
              </span>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Share your knowledge.
                <br />
                Teach on our LMS.
              </h1>

              <p className="mt-5 text-lg text-muted-foreground max-w-xl">
                Create courses, inspire learners, and build your own teaching
                journey. Whether you are an expert, mentor, or passionate
                learner, this is your place to teach.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate("/instructor/newCourse")}
                >
                  Start Teaching
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/explore-courses")}
                >
                  Explore Courses
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border bg-card p-8 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="rounded-2xl">
                  <CardContent className="p-6">
                    <Users className="h-8 w-8 mb-4 text-primary" />
                    <h3 className="font-semibold text-lg">Teach students</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Reach learners who are ready to grow with your guidance.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl">
                  <CardContent className="p-6">
                    <BadgeCheck className="h-8 w-8 mb-4 text-primary" />
                    <h3 className="font-semibold text-lg">Build credibility</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Showcase your expertise through well-crafted courses.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl sm:col-span-2">
                  <CardContent className="p-6">
                    <IndianRupee className="h-8 w-8 mb-4 text-primary" />
                    <h3 className="font-semibold text-lg">Monetize your skills</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Turn your knowledge into a course that can help learners
                      and generate income.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Teach */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">Why teach with us?</h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to start teaching and managing your courses in
            one place.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="rounded-2xl h-full">
                <CardContent className="p-6">
                  <div className="rounded-xl bg-primary/10 w-fit p-3 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-muted/40 border-y">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl font-bold">How it works</h2>
              <p className="mt-3 text-muted-foreground max-w-xl">
                Starting as an instructor is pretty simple. Build your course,
                organize your lessons, and publish when you are ready.
              </p>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-4 rounded-2xl border bg-background p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border bg-card p-8 md:p-12 text-center shadow-sm">
          <h2 className="text-3xl font-bold">Ready to become an instructor?</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Start building your first course today and share your expertise with
            learners on the platform.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate("/instructor/newCourse")}
            >
              Create Your First Course
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
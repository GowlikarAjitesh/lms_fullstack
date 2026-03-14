import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Linkedin, Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card text-foreground py-10 mt-auto border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.35fr_1.05fr_1fr] gap-10 mb-10">
          <div>
            <Link
              to="/"
              className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2"
            >
              <div className="bg-primary p-1.5 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">LMS Portal</span>
            </Link>

            <p className="text-muted-foreground mt-4 text-sm">
              A full-stack learning management system built to help students
              learn effectively and instructors create, manage, and publish
              courses with ease.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Project Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Explore and purchase courses</li>
              <li>Track course progress and continue learning</li>
              <li>Instructor course creation and publishing</li>
              <li>Role-based dashboards for students and instructors</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Payments</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <a
                href="https://www.paypal.com"
                target="_blank"
                rel="noreferrer"
                className="inline-block"
              >
                <img
                  src="https://www.paypalobjects.com/webstatic/mktg/Logo/AM_mc_vs_ms_ae_UK.png"
                  alt="PayPal Acceptance Mark"
                  className="h-26 w-auto rounded-md border bg-white p-1.5"
                />
              </a>
              <p>PayPal payment gateway integration</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Developer Info</h3>

            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/ajiteshgowlikar"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border hover:text-primary hover:border-primary transition"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>

              <a
                href="mailto:ajiteshgowlikar@gmail.com"
                className="p-2 rounded-full border hover:text-primary hover:border-primary transition"
                aria-label="Email"
                title="Email"
              >
                <Mail className="h-5 w-5" />
              </a>

              <a
                href="https://github.com/GowlikarAjitesh"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border hover:text-primary hover:border-primary transition"
                aria-label="GitHub"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Built and maintained by Ajitesh Gowlikar.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-sm text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LMS Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
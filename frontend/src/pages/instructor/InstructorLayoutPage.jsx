import { Book, LayoutDashboard } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function InstructorLayoutPage() {
  const location = useLocation();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/instructor/dashboard",
    },
    {
      icon: Book,
      label: "Courses",
      path: "/instructor/courses",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background text-primary-foreground">
      {/* Sidebar */}
      <aside className="w-64 shadow-md hidden md:block bg-sidebar border-r border-sidebar-border">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Instructor View</h2>
          <nav>
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={
                    location.pathname === item.path
                      ? "default"
                      : "ghost"
                  }
                  className="w-full justify-start mb-2 cursor-pointer"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

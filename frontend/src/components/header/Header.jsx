// src/components/Header.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,  
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  LogOut,
  User,
  LayoutDashboard,
  Search,
  Bell,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Header() {
  const { isAuth, userDetails, setIsAuth, setUserDetails } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState("");
  const [studentOrInstructorView, setStudentOrInstructorView] = useState('Instructor')
  // function handleInstructorOrStudentViewButton() {
  //   if(location.pathname.includes('instructor')){
  //     navigate('/');
  //     setStudentOrInstructorView('Instructor');
  //   }
  //   else{
  //     navigate('/instructor/dashboard');
  //     setStudentOrInstructorView('Student');
  //   }
  // }
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchText(params.get("search") || "");
  }, [location.search]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsAuth(false);
    setUserDetails(null);
    navigate("/auth/login");
  };

  const handleSearchKeyDown = (event) => {
    if (event.key !== "Enter") return;

    const trimmed = searchText.trim();
    const params = new URLSearchParams();

    if (trimmed) {
      params.set("search", trimmed);
    }

    navigate(`/explore-courses?${params.toString()}`);
  };
  const isInstructor =
    userDetails?.role == "instructor" || userDetails?.role == "admin";
    if(location.pathname.includes('course-progress')) return null;
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 overflow-x-hidden">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-full">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent hidden sm:inline-block">
              LMS Portal
            </span>
          </Link>
          {isInstructor ? (
            <></>
          ) : (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                <Link to="/explore-courses" className="hover:text-foreground transition-colors">
                  Explore
                </Link>
                {isAuth && (
                  <Link
                    to="/my-courses"
                    className="hover:text-foreground transition-colors"
                  >
                    My Learning
                  </Link>
                )}
              </nav>
            </>
          )}
        </div>

        {/* Middle: Search Bar (Hidden on mobile) */}
        <div className={`hidden lg:flex flex-1 max-w-md mx-8 ${isInstructor ? 'hidden' : 'hidden'}`}>
          <div className={`relative w-full ${isInstructor ? 'hidden' : 'hidden'}`}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search for courses..."
              className={`w-full bg-input border-border pl-9 text-foreground focus-visible:ring-ring `}
            />
          </div>
        </div>

        {/* Right Side: Auth Logic */}
        <div className="flex items-center gap-4">
          {isAuth ? (
            <>
              {/* Instructor Switcher */}
              {userDetails?.role === "instructor" ? (
                (
                  <></>
                // <Button
                //   onClick={handleInstructorOrStudentViewButton}
                //   variant="ghost"
                //   className="hidden sm:flex text-muted-foreground hover:text-primary-foreground hover:bg-primary hover:cursor-pointer border-2 border-border"
                // >
                //   {studentOrInstructorView}  {" View"}
                // </Button>
              )
              ) : (
                isInstructor &&
                <Button
                  variant="ghost"
                  className="hidden sm:flex text-muted-foreground hover:text-primary-foreground hover:bg-primary hover:cursor-pointer border-2 border-border"
                >
                  Teach on LMS
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className={`text-muted-foreground hover:text-foreground cursor-pointer hover:bg-transparent ${isInstructor ? 'hidden' : 'hidden'}`}
              >
                <Bell className="h-5 w-5" />
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage
                        src={userDetails?.profileImage}
                        alt={userDetails?.username}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userDetails?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  alignOffset={-8}
                  sideOffset={8}
                  className="w-56 !bg-card !text-foreground border-border !shadow-lg"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">
                        {userDetails?.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userDetails?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer focus:bg-secondary focus:text-foreground"
                  >
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer focus:bg-secondary focus:text-foreground"
                  >
                    <Link to="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:bg-destructive/20 focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <Link to="/auth/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link to="/auth/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

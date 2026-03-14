import { Button } from "@/components/ui/button";
import {useNavigate} from 'react-router-dom';
export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-background text-primary-foreground py-20 h-screen">
      <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-10">
        
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Learn Without Limits
          </h1>

          <p className="mt-4 text-lg text-primary-foreground/90">
            Build skills with online courses from world-class instructors.
          </p>

          <Button className="mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold cursor-pointer" onClick={()=>navigate('/explore-courses')}>
            Explore Courses
          </Button>
        </div>

        <img
          src="https://images.unsplash.com/photo-1581092335397-9583eb92d232"
          alt="Learning"
          className="rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
}

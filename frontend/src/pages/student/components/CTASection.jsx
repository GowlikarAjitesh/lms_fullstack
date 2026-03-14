import { Button } from "@/components/ui/button";
import {useNavigate} from 'react-router-dom';
export default function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-primary text-primary-foreground text-center mb-20 mt-20">
      
      <h2 className="text-4xl font-bold">
        Start Learning Today
      </h2>

      <p className="mt-4 text-primary-foreground/90">
        Join thousands of learners from around the world.
      </p>

      <Button className="mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90 cursor-pointer" onClick={()=>navigate('/explore-courses')}>
        Get Started
      </Button>
    </section>
  );
}

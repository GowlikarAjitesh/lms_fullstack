import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Star } from "lucide-react";

export default function CourseCard({
  title,
  instructor,
  price,
  originalPrice,
  rating = 4.5,
  totalReviews = 1200,
  image,
  isBestseller = false,
}) {
  return (
    <Card className="group overflow-hidden rounded-2xl bg-card text-card-foreground border border-border hover:shadow-xl transition-all duration-300 cursor-pointer">
      {/* Image Section */}
      <CardHeader className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {isBestseller && (
          <CardTitle className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            Bestseller
          </CardTitle>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className="p-5 space-y-2">
        {/* Title */}
        <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-muted-foreground">by {instructor}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 text-sm pt-1">
          <span className="font-semibold text-primary">{rating}</span>

          <Star size={14} className="fill-primary text-primary" />

          <span className="text-muted-foreground">
            ({totalReviews.toLocaleString()})
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 pt-2">
          {/* Current Price */}
          <span className="flex items-center gap-1 font-bold text-lg leading-none">
            {/* <IndianRupee className="w-4 h-4 shrink-0 translate-y-px font-bold" /> */}
            <span>${price}</span>
          </span>

          {/* Original Price */}
          {originalPrice && (
            <span className="flex items-center text-sm text-muted-foreground line-through leading-none relative">
              {/* <span className="absolute left-0 right-0 top-1/2 h-px bg-muted-foreground"></span>
              <IndianRupee className="w-4 h-4 shrink-0 translate-y-px" /> */}
              <span >${originalPrice}</span>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

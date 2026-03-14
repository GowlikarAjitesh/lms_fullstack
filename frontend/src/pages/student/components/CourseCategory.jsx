import { Button } from '@/components/ui/button'
import { courseCategories } from '@/config'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function CourseCategory() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentCategory = new URLSearchParams(location.search).get('category');

  const handleCategoryClick = (categoryId) => {
    const params = new URLSearchParams();
    params.set('category', categoryId);
    navigate(`/explore-courses?${params.toString()}`);
  };

  return (
    <section className="py-16 container mx-auto px-6">
      <h1 className="text-3xl font-bold mb-8">Course Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {courseCategories.map((categoryItem) => (
          <Button
            key={categoryItem.id}
            className="justify-start text-xl font-semibold gap-2 m-2"
            variant={currentCategory === categoryItem.id ? 'secondary' : 'outline'}
            onClick={() => handleCategoryClick(categoryItem.id)}
          >
            {categoryItem.label}
          </Button>
        ))}
      </div>
    </section>
  )
}


import CommonForm from '@/components/form'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { courseLandingPageFormControls } from '@/config'
import InstructorContext from '@/context/instructorContext'
import React, { useContext } from 'react'

export default function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } = useContext(InstructorContext);
  // console.log(courseLandingFormData);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Landing</CardTitle>
      </CardHeader>
      <CardContent>
        <CommonForm formControls={courseLandingPageFormControls} formData={courseLandingFormData} setFormData={setCourseLandingFormData}></CommonForm>
      </CardContent>
      </Card>
  )
}

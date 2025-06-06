import React from 'react'
import { StudentODStats } from '@/components/dashboard/student/student-od-stats'
import { Greeting } from '@/components/greeting'

function page() {
  return (
    <div>
      <Greeting/>
      <StudentODStats/>
    </div>
  )
}

export default page
import React from 'react'
import ManageApplications from '@/components/dashboard/faculty/manage-applications'

function page() {
  return (
    <div className='p-10'>
      <h2 className="text-2xl font-bold mb-4">My Applications</h2>
      <ManageApplications/>
    </div>
  )
}

export default page
import React from "react"
import { User } from "@prisma/client"

import AddStudent from "./add-student"
import { columns } from "./column"
import { DataTable } from "./data-table"

const MainStudent = ({
  currentEducation,
  students,
}: {
  currentEducation: string
  students: User[]
}) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="ml-auto">
        <AddStudent currentEducation={currentEducation} />
      </div>
      <DataTable columns={columns} data={students} />
    </div>
  )
}

export default MainStudent

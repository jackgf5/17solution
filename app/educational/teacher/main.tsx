import React from "react"
import { User } from "@prisma/client"

import AddTeacher from "./add-teacher"
import { columns } from "./column"
import { DataTable } from "./data-table"

const MainTeacher = ({
  currentEducation,
  teachers,
}: {
  currentEducation: string
  teachers: User[]
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="ml-auto">
        <AddTeacher currentEducation={currentEducation} />
      </div>
      <DataTable columns={columns} data={teachers} />
    </div>
  )
}

export default MainTeacher

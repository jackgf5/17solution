import React from "react"

import AddTeacher from "./add-teacher"
import { columns } from "./column"
import { DataTable } from "./data-table"

const MainTeacher = ({ currentEducation }: { currentEducation: string }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="ml-auto">
        <AddTeacher currentEducation={currentEducation} />
      </div>
      <DataTable
        columns={columns}
        data={[
          {
            id: "234234234",
            name: "teacher",
            username: "teacher@teacher",
            hashedPassword: "asdasdasasdas",
            role: "USER",
          },
        ]}
      />
    </div>
  )
}

export default MainTeacher

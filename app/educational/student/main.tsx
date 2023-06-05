import React from "react"

import AddStudent from "./add-student"
import { columns } from "./column"
import { DataTable } from "./data-table"

const MainStudent = ({ currentEducation }: { currentEducation: string }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="ml-auto">
        <AddStudent currentEducation={currentEducation} />
      </div>
      <DataTable
        columns={columns}
        data={[
          {
            id: "234234234",
            name: "student",
            username: "student@student",
            hashedPassword: "asdasdas",
            role: "USER",
          },
        ]}
      />
    </div>
  )
}

export default MainStudent

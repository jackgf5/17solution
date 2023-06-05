import React, { useState } from "react"

import prisma from "@/lib/prisma"

import MainStudent from "./student/main"
import MainTeacher from "./teacher/main"

const getData = async () => {
  const users = await prisma.user.findMany({
    where: {
      role: {
        not: "ADMIN",
      },
    },
  })
  return users
}

const page = async () => {
  const data = await getData()
  const currentEducation = "floridia"

  return (
    <div className="p-20 flex-col space-y-8 flex ">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight capitalize">
            Welcome {currentEducation}
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all accounts!
          </p>
        </div>
      </div>

      <div className="flex items-center lg:flex-row flex-col justify-center gap-4">
        <MainTeacher currentEducation={currentEducation} />
        <MainStudent currentEducation={currentEducation} />
      </div>
    </div>
  )
}

export default page

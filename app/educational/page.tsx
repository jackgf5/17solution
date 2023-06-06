import React, { useState } from "react"
import { getServerSession } from "next-auth/next"

import { authOptions } from "../api/auth/[...nextauth]/route"
import MainStudent from "./student/main"
import MainTeacher from "./teacher/main"

const getTeachers = async (currentEducational: string) => {
  const educational = await prisma?.educational.findUnique({
    where: {
      name: currentEducational,
    },
  })

  const educationalId = educational?.id
  const teachers = await prisma?.user.findMany({
    where: {
      educationalId: educationalId,
      role: "TEACHER",
    },
  })

  const students = await prisma?.user.findMany({
    where: {
      educationalId: educationalId,
      role: "STUDENT",
    },
  })

  return { teachers, students }
}

const page = async () => {
  const session = await getServerSession(authOptions)
  const currentEducational = session?.user?.name
  if (!currentEducational) return
  const { students, teachers } = await getTeachers(currentEducational)

  return (
    <div className="p-20 flex-col space-y-8 flex ">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight capitalize">
            Welcome {currentEducational}
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all accounts!
          </p>
        </div>
      </div>

      <div className="flex items-center lg:flex-row flex-col justify-center gap-4">
        {currentEducational && teachers && students && (
          <>
            <MainTeacher
              currentEducation={currentEducational}
              teachers={teachers}
            />
            <MainStudent
              currentEducation={currentEducational}
              students={students}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default page

import React, { useState } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { authOptions } from "../api/auth/[...nextauth]/route"
import { UserNav } from "../controller/user-nav"
import MainStudent from "./student/main"
import MainTeacher from "./teacher/main"

const getTeachersAndStudents = async (currentEducational: string) => {
  const educational = await prisma?.educational.findUnique({
    where: {
      name: currentEducational,
    },
  })

  if (!educational) return { teachers: [], students: [] }
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
  if (session?.user?.role !== "EDUCATIONAL") redirect("/auth")
  if (!session) return
  const currentEducational = session?.user?.name
  if (currentEducational === undefined || currentEducational === null) {
    return
  }

  const { students, teachers } = await getTeachersAndStudents(
    currentEducational
  )

  return (
    <div className="flex flex-col space-y-8 p-8 sm:p-10 md:p-14 lg:p-20 ">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold capitalize tracking-tight">
            Welcome {currentEducational}
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all accounts!
          </p>
        </div>
        <UserNav session={session} />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
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

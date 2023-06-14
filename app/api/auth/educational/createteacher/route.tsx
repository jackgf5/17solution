import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { name, username, password, currentEducation } = body

  console.log(name, username, password, currentEducation)

  if (!name || !password || !username || !currentEducation)
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })

  const educational = await prisma.educational.findUnique({
    where: {
      name: currentEducation,
    },
  })

  if (!educational)
    return NextResponse.json({ msg: "Educational Not Found" }, { status: 400 })

  const userWithSameUsername = await prisma.user.findUnique({
    where: {
      username: username,
    },
  })

  if (userWithSameUsername)
    return NextResponse.json({ msg: "Username Taken" }, { status: 409 })

  const newTeacher = await prisma.user.create({
    data: {
      name: name,
      username: username,
      hashedPassword: password,
      role: "TEACHER",
      educationalId: educational?.id,
    },
  })

  return NextResponse.json(
    { msg: "Student Created", user: newTeacher },
    { status: 200 }
  )
}

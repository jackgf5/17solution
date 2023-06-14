import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { name, username, password, currentEducation } = body

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

  const hashedPassword = await bcrypt.hash(password, 12)

  const newStudent = await prisma.user.create({
    data: {
      name: name,
      username: username,
      hashedPassword: hashedPassword,
      role: "STUDENT",
      educationalId: educational?.id,
    },
  })

  return NextResponse.json(
    { msg: "Student Created", user: newStudent },
    { status: 200 }
  )
}

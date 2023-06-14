import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { username, password } = body

  if (!password || !username)
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })

  const hashedPassword = await bcrypt.hash(password, 12)

  const updatedUser = await prisma.user.update({
    where: {
      username: username,
    },
    data: {
      hashedPassword: hashedPassword,
    },
  })

  return NextResponse.json(
    { msg: "User Password Updated", user: updatedUser },
    { status: 200 }
  )
}

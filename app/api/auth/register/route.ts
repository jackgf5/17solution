import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { name, type, username, password } = body

  if (!name || !type || !password || !username)
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })

  const hashedPassword = await bcrypt.hash(password, 12)

  const userWithSameUsername = await prisma.user.findMany({
    where: {
      username: username,
    },
  })

  if (userWithSameUsername.length !== 0)
    return NextResponse.json({ msg: "Username Taken" }, { status: 409 })

  const user = await prisma.user.create({
    data: {
      name,
      role: type === "organization" ? "ORGANIZATION" : "EDUCATIONAL",
      username,
      hashedPassword,
    },
  })

  return NextResponse.json({ msg: "User Created", user }, { status: 200 })
}

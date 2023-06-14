import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const {
    name,
    username,
    password,
    currentOrganization,
    email,
    phoneNumber,
    oldUsername,
  } = body

  if (
    !name ||
    !password ||
    !username ||
    !currentOrganization ||
    !email ||
    !phoneNumber ||
    !oldUsername
  )
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })

  const organization = await prisma.organization.findUnique({
    where: {
      name: currentOrganization,
    },
  })

  if (!organization)
    return NextResponse.json({ msg: "Organization Not Found" }, { status: 400 })

  const userWithSameUsername = await prisma.user.findUnique({
    where: {
      username: username,
    },
  })

  if (userWithSameUsername)
    return NextResponse.json({ msg: "Username Taken" }, { status: 409 })

  const updatedEmployee = await prisma.user.update({
    where: {
      username: oldUsername,
    },
    data: {
      name: name,
      username: username,
      email: email,
      phone: phoneNumber,
      hashedPassword: password,
      role: "EMPLOYEE",
      organizationId: organization?.id,
    },
  })

  return NextResponse.json(
    { msg: "Employee Updated", user: updatedEmployee },
    { status: 200 }
  )
}

import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { name, username, password, currentOrganization } = body

  console.log(name, username, password, currentOrganization)

  if (!name || !password || !username || !currentOrganization)
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })

  const organization = await prisma.organization.findUnique({
    where: {
      name: currentOrganization,
    },
  })

  const newEmployee = await prisma.user.create({
    data: {
      name: name,
      username: username,
      hashedPassword: password,
      role: "EMPLOYEE",
      organizationId: organization?.id,
    },
  })

  return NextResponse.json(
    { msg: "Employee Created", user: newEmployee },
    { status: 200 }
  )
}

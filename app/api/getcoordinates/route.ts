import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { companyName } = body

  if (!companyName)
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })

  const organization = await prisma.organization.findFirst({
    where: {
      name: { equals: companyName, mode: "insensitive" },
    },
    include: { coordinate: true, events: true },
  })

  if (organization) {
    const coordinates = organization.coordinate
    const events = organization.events

    return NextResponse.json(
      { msg: `${organization.name} Info`, coordinates, events },
      { status: 200 }
    )
  }

  const educational = await prisma.educational.findFirst({
    where: {
      name: { equals: companyName, mode: "insensitive" },
    },
    include: { coordinate: true, events: true },
  })

  if (educational) {
    const coordinates = educational.coordinate
    const events = educational.events
    return NextResponse.json(
      { msg: `${educational.name} Info`, coordinates, events },
      { status: 200 }
    )
  }

  return NextResponse.json({ msg: "No Info Found" }, { status: 400 })
}

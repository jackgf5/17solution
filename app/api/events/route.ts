import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const {
    name,
    startTime,
    endTime,
    date,
    currentOrganization,
    currentEducational,
  } = body

  if (!name || !startTime || !endTime || !date)
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })

  if (currentOrganization) {
    const organization = await prisma.organization.findUnique({
      where: {
        name: currentOrganization,
      },
    })

    if (!organization)
      return NextResponse.json(
        { msg: "Organization Not Fo und" },
        { status: 400 }
      )

    const newEvent = await prisma.event.create({
      data: {
        name: name,
        startTime: startTime,
        endTime: endTime,
        date: date,
        organizationId: organization.id,
      },
    })

    return NextResponse.json(
      { msg: "Event Created", event: newEvent },
      { status: 200 }
    )
  }

  if (currentEducational) {
    const educational = await prisma.educational.findUnique({
      where: {
        name: currentEducational,
      },
    })

    if (!educational)
      return NextResponse.json(
        { msg: "Educational Not Found" },
        { status: 400 }
      )

    const newEvent = await prisma.event.create({
      data: {
        name: name,
        startTime: startTime,
        endTime: endTime,
        date: date,
        educationalId: educational.id,
      },
    })

    return NextResponse.json(
      { msg: "Event Created", event: newEvent },
      { status: 200 }
    )
  }

  return NextResponse.json({ msg: "Something Went Wrong" }, { status: 400 })
}

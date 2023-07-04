import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { startDate, endDate, daysOff, reason, userId, companyName } = body

  if (
    !userId ||
    !startDate ||
    !endDate ||
    !daysOff ||
    !reason ||
    !userId ||
    !companyName
  )
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })

  const allUsersApplications = await prisma.leaveApplication.findMany({
    where: {
      userId: userId,
    },
  })

  // Check for date conflicts
  const conflictingApplication = allUsersApplications.find((application) => {
    const applicationStartDate = new Date(application.startDate)
    const applicationEndDate = new Date(application.endDate)
    const inputStartDate = new Date(startDate)
    const inputEndDate = new Date(endDate)

    // Check if the date ranges overlap
    if (
      (inputStartDate >= applicationStartDate &&
        inputStartDate <= applicationEndDate) ||
      (inputEndDate >= applicationStartDate &&
        inputEndDate <= applicationEndDate) ||
      (inputStartDate <= applicationStartDate &&
        inputEndDate >= applicationEndDate)
    ) {
      return true // Conflicting dates found
    }
    return false // No conflicts
  })

  if (conflictingApplication) {
    return NextResponse.json(
      { msg: "Date conflict with existing application" },
      { status: 400 }
    )
  }

  const organization = await prisma.organization.findFirst({
    where: {
      name: { equals: companyName, mode: "insensitive" },
    },
  })

  if (organization) {
    const leaveApplication = await prisma.leaveApplication.create({
      data: {
        startDate,
        endDate,
        reason,
        userId,
        daysOff,
        status: "AWAITING",
        organizationId: organization.id,
      },
    })

    return NextResponse.json(
      { msg: "Application Created", leaveApplication },
      { status: 200 }
    )
  }

  const educational = await prisma.educational.findFirst({
    where: {
      name: { equals: companyName, mode: "insensitive" },
    },
  })

  if (educational) {
    const leaveApplication = await prisma.leaveApplication.create({
      data: {
        startDate,
        endDate,
        reason,
        userId,
        daysOff,
        status: "AWAITING",
        educationalId: educational.id,
      },
    })

    return NextResponse.json(
      { msg: "Application Created", leaveApplication },
      { status: 200 }
    )
  }
}

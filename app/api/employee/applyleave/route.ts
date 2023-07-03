import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { startDate, endDate, daysOff, reason, userId } = body

  if (!userId || !startDate || !endDate || !daysOff || !reason || !userId)
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })

  const leaveApplication = await prisma.leaveApplication.create({
    data: {
      startDate,
      endDate,
      reason,
      userId,
      daysOff,
      status: "AWAITING",
    },
  })

  return NextResponse.json(
    { msg: "Application Created", leaveApplication },
    { status: 200 }
  )
}

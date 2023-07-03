import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { userId } = body

  if (!userId)
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })

  const leaveApplications = await prisma.leaveApplication.findMany({
    where: {
      userId,
    },
  })

  return NextResponse.json(
    { msg: "All Leave Applications", leaveApplications },
    { status: 200 }
  )
}

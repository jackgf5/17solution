import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { applicationId, newStatus } = body

  if (!applicationId || !newStatus)
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })

  const updatedApplication = await prisma.leaveApplication.update({
    where: {
      id: applicationId,
    },
    data: {
      status: newStatus,
    },
  })
  return NextResponse.json(
    { msg: "Status Updated", updatedApplication },
    { status: 200 }
  )
}

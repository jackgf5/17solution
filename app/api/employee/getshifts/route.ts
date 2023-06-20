import { NextResponse } from "next/server"
import { formatISO } from "date-fns"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { userId } = body

  if (!userId)
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })

  const shifts = await prisma.shift.findMany({
    where: {
      userId: userId,
    },
  })

  return NextResponse.json({ msg: "All User Shifts", shifts }, { status: 200 })
}

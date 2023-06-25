import { NextResponse } from "next/server"
import { formatISO } from "date-fns"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { userId, isoString } = body

  if (!userId)
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })

  const shift = await prisma.shift.create({
    data: {
      userId: userId,
      date: isoString,
      checkinTime: isoString,
    },
  })

  return NextResponse.json({ msg: "Shift Created", shift }, { status: 200 })
}

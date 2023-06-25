import { NextResponse } from "next/server"
import { Shift } from "@prisma/client"
import { differenceInMinutes, formatISO, parseISO } from "date-fns"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { shiftId, checkinTime, checkoutTime } = body

  if (!shiftId)
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })

  const start = parseISO(checkinTime)
  const end = parseISO(checkoutTime)
  const minutesDifference = differenceInMinutes(end, start).toString()

  const updatedShift = await prisma.shift.update({
    where: {
      id: shiftId,
    },
    data: {
      checkoutTime: formatISO(end),
      completed: true,
      durationWorked: minutesDifference,
    },
  })

  return NextResponse.json(
    { msg: "Shift Updated", updatedShift },
    { status: 200 }
  )
}

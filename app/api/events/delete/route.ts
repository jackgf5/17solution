import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { eventId } = body

  if (!eventId)
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })

  await prisma.event.delete({
    where: {
      id: eventId,
    },
  })

  return NextResponse.json({ msg: "Event Deleted" }, { status: 200 })
}

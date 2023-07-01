import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { userId, expoToken } = body

  if (!userId || !expoToken)
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      expoToken: expoToken,
    },
  })

  return NextResponse.json({ msg: "Token Updated" }, { status: 200 })
}

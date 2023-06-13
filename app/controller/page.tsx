import React, { useState } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"

import { authOptions } from "../api/auth/[...nextauth]/route"
import AddAccount from "./add-account"
import { columns } from "./column"
import { DataTable } from "./data-table"
import { UserNav } from "./user-nav"

const getData = async () => {
  const users = await prisma.user.findMany({
    where: {
      role: {
        not: { in: ["ADMIN", "STUDENT", "TEACHER", "EMPLOYEE"] },
      },
    },
  })
  return users
}

const page = async () => {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") redirect("/auth")
  if (!session) return
  const data = await getData()

  return (
    <div className="flex w-full flex-col space-y-8 p-8 sm:p-10 md:p-14 lg:p-20 ">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold capitalize tracking-tight">
            Welcome
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all accounts!
          </p>
        </div>
        <UserNav session={session} />
      </div>
      <div className="flex justify-end">
        <AddAccount />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default page

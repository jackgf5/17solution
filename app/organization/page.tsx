import React, { useState } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"

import { authOptions } from "../api/auth/[...nextauth]/route"
import { UserNav } from "../controller/user-nav"
import AddAccount from "./add-account"
import { columns } from "./column"
import { DataTable } from "./data-table"

const getData = async (currentOrganization: string) => {
  const organization = await prisma.organization.findUnique({
    where: {
      name: currentOrganization,
    },
  })

  const organizationID = organization?.id

  if (!organizationID) return []

  const employees = await prisma.user.findMany({
    where: {
      organizationId: organizationID,
      role: "EMPLOYEE",
    },
  })

  return employees
}

const page = async () => {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== "ORGANIZATION") redirect("/auth")
  if (!session) return
  const currentOrganization = session?.user?.name
  if (currentOrganization === undefined || currentOrganization === null) {
    return
  }
  const data = await getData(currentOrganization)

  return (
    <div className="flex w-full flex-col space-y-8 p-8 sm:p-10 md:p-14 lg:p-20 ">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold capitalize tracking-tight">
            Welcome {currentOrganization}
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all accounts!
          </p>
        </div>
        <UserNav session={session} />
      </div>
      <div className="flex justify-end">
        <AddAccount currentOrganization={currentOrganization} />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default page

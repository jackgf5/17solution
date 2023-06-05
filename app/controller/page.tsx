import React, { useState } from "react"

import prisma from "@/lib/prisma"

import AddAccount from "./add-account"
import { columns } from "./column"
import { DataTable } from "./data-table"

const getData = async () => {
  const users = await prisma.user.findMany({})
  return users
}

const page = async () => {
  const data = await getData()
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-20 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome Controller !
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all accounts!
          </p>
        </div>
        <AddAccount />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default page

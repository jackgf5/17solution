import React, { useState } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Calendar, Menu, Users } from "lucide-react"
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { authOptions } from "../../api/auth/[...nextauth]/route"
import { UserNav } from "../../controller/user-nav"
import AddAccount from "../add-account"
import { columns } from "../column"
import { DataTable } from "../data-table"
import { Sidebar } from "../sidebar"

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

const page = async ({ params }: { params: any }) => {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ORGANIZATION") redirect("/auth")
  if (!session) return
  const currentOrganization = session?.user?.name
  if (currentOrganization === undefined || currentOrganization === null) {
    return
  }
  const data = await getData(currentOrganization)

  const selection = params?.route?.[0] || ""

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
      <div className="flex items-center justify-between xl:justify-end">
        <div className="block xl:hidden">
          <Sheet>
            <SheetTrigger className=" inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              <Menu className="mr-2 h-4 w-4" />
              Menu
            </SheetTrigger>
            <SheetContent size={"full"}>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <div className={"pb-12"}>
                <div className="space-y-4 py-4">
                  <div className="">
                    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                      Employees
                    </h2>
                    <div className="space-y-1">
                      <Button
                        variant={
                          selection === "employees" || selection === ""
                            ? "default"
                            : "ghost"
                        }
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Link
                          className="flex w-full items-center"
                          href={"/organization/employees"}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          View Employees
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="">
                    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                      Events
                    </h2>
                    <div className="space-y-1">
                      <Button
                        variant={selection === "calendar" ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Link
                          className="flex w-full items-center"
                          href={"/organization/calendar"}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Calendar
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <AddAccount currentOrganization={currentOrganization} />
      </div>
      <div className="flex gap-10">
        <Sidebar selection={selection} className="w-1/5" />
        {selection === "employees" ? (
          <DataTable columns={columns} data={data} />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}

export default page

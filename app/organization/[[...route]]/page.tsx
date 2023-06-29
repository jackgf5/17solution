import React, { useState } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { format, parseISO } from "date-fns"
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
import Stats from "@/app/educational/stats"

import { authOptions } from "../../api/auth/[...nextauth]/route"
import { UserNav } from "../../controller/user-nav"
import AddAccount from "../add-account"
import AddEvent from "../add-event"
import { columns } from "../column"
import { DataTable } from "../data-table"
import { Sidebar } from "../sidebar"
import { UserWithShift, allColumns } from "./allColumn"
import { eventsColumns } from "./eventsColumn"

const getAllUsersWithTodayShift = async (currentOrganization: string) => {
  const organization = await prisma?.organization.findUnique({
    where: {
      name: currentOrganization,
    },
  })

  if (!organization)
    return {
      mergedUsers: [],
      checkedInCount: 0,
      totalCount: 0,
      totalHours: 0,
      absentCount: 0,
    }
  const organizationId = organization?.id

  const today = new Date() // Current date
  today.setUTCHours(0, 0, 0, 0) // Set time to 00:00:00 in UTC

  const events = await prisma.event.findMany({
    where: {
      organizationId: organization.id,
    },
  })

  const formattedEvents = events.map((event) => {
    return {
      ...event,
      startTime: format(parseISO(event.startTime), "HH:mm"),
      endTime: format(parseISO(event.endTime), "HH:mm"),
      date: format(parseISO(event.date), "dd-MM-yyyy"),
    }
  })

  const usersWithShifts = await prisma.user.findMany({
    where: {
      organizationId: organizationId,
      role: "EMPLOYEE",
    },
    include: {
      shifts: {
        where: {
          date: {
            gte: today.toISOString().split("T")[0], // Greater than or equal to today
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0], // Less than tomorrow
          },
        },
      },
    },
  })

  let checkedInCount = 0
  let absentCount = 0
  let totalCount = 0
  let totalHours = 0

  const mergedUsers = usersWithShifts.map((user) => {
    if (user.shifts?.[0]?.checkinTime) {
      checkedInCount++
      totalCount++
    } else {
      absentCount++
      totalCount++
    }

    if (user.shifts?.[0]?.durationWorked) {
      totalHours = totalHours + parseInt(user.shifts?.[0]?.durationWorked)
    }

    return {
      ...user,
      checkinTime: user.shifts?.[0]?.checkinTime
        ? format(parseISO(user.shifts?.[0]?.checkinTime), "HH:mm")
        : null,
      checkoutTime: user.shifts?.[0]?.checkoutTime
        ? format(parseISO(user.shifts?.[0]?.checkoutTime), "HH:mm")
        : null,
      durationWorked: user.shifts?.[0]?.durationWorked
        ? format(
            new Date(0, 0, 0, 0, parseInt(user.shifts?.[0]?.durationWorked)),
            "HH:mm"
          )
        : null,
      amountInside: user.shifts?.[0]?.amountInside || null,
      amountOutside: user.shifts?.[0]?.amountOutside || null,
      amountChecked: user.shifts?.[0]?.amountChecked || null,
    }
  })

  return {
    mergedUsers,
    checkedInCount,
    totalCount,
    totalHours,
    absentCount,
    formattedEvents,
  }
}

const page = async ({ params }: { params: any }) => {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ORGANIZATION") redirect("/auth")
  if (!session) return
  const currentOrganization = session?.user?.name
  if (currentOrganization === undefined || currentOrganization === null) {
    return
  }
  const {
    mergedUsers,
    checkedInCount,
    totalCount,
    totalHours,
    absentCount,
    formattedEvents: events,
  } = await getAllUsersWithTodayShift(currentOrganization)

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
      </div>
      <div className="flex gap-10">
        <Sidebar selection={selection} className="w-1/5" />
        {selection === "" && (
          <div className="flex w-full flex-col  gap-4">
            <Stats
              absentCount={absentCount}
              totalCount={totalCount}
              totalHours={totalHours}
              checkedInCount={checkedInCount}
            />
            <DataTable
              columns={allColumns}
              data={mergedUsers as UserWithShift[]}
            />
          </div>
        )}
        {selection === "employees" && (
          <div className="flex w-full flex-col  gap-4">
            <div className="ml-auto">
              <AddAccount currentOrganization={currentOrganization} />
            </div>
            <DataTable columns={columns} data={mergedUsers} />
          </div>
        )}

        {selection === "events" && (
          <div className="flex w-full flex-col  gap-4">
            <div className="ml-auto">
              <AddEvent currentOrganization={currentOrganization} />
            </div>
            <DataTable columns={eventsColumns} data={events || []} />
          </div>
        )}
      </div>
    </div>
  )
}

export default page

"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shift, User } from "@prisma/client"
import axios from "axios"
import { format } from "date-fns"
import {
  Activity,
  Briefcase,
  Clock,
  Contact,
  Copy,
  Key,
  Mail,
  Phone,
  UserIcon,
} from "lucide-react"
import toast from "react-hot-toast"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog-profile"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import SingleTiming from "./single-timing"

const ViewTimes = ({ user }: { user: User }) => {
  const [shifts, setShifts] = useState<Shift[]>()
  const totalMinutesWorked = shifts
    ? shifts.reduce(
        (total, shift) => total + parseInt(shift.durationWorked || "0"),
        0
      )
    : 0
  const averageTimeWorked = shifts ? totalMinutesWorked / shifts.length : 0
  const averageTime = format(new Date(0, 0, 0, 0, averageTimeWorked), "HH:mm")

  useEffect(() => {
    axios
      .post("/api/employee/getshifts/", { userId: user.id })
      .then((response) => {
        setShifts(response.data.shifts)
      })
      .catch((err) => console.log(err))
  }, [user.id])

  const router = useRouter()

  const handleDeleteUser = async (userId: string) => {
    axios
      .post("/api/auth/user/delete", { userId })
      .then((response) => {
        if (response.status !== 200) throw new Error("Employee Not Deleted")
        toast.success("Employee Deleted")
        router.refresh()
      })
      .catch((error) => {
        toast.error(error.response.data.msg)
      })
  }

  return (
    <div className="flex  items-center space-x-2">
      <AlertDialog>
        <AlertDialogTrigger className=" relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent  focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          <UserIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          View Profile
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className=" mb-4">
              {user.name} Profile
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex flex-col gap-10 ">
            <div className="flex flex-col gap-10 md:flex-row">
              <div className="flex w-full  flex-col gap-2">
                <div
                  onClick={() => navigator.clipboard.writeText(user.name)}
                  className="flex items-center justify-between space-x-4 rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex items-center space-x-4">
                    <UserIcon className="h-5 w-5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Name</p>
                      <p className="text-sm text-muted-foreground">
                        {user.name}
                      </p>
                    </div>
                  </div>
                  <Copy className=" mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                </div>

                <div
                  onClick={() => navigator.clipboard.writeText(user.username)}
                  className="flex items-center justify-between  space-x-4 rounded-md  p-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex items-center space-x-4">
                    <Contact className="h-5 w-5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Username
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.username}
                      </p>
                    </div>
                  </div>
                  <Copy className=" mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                </div>

                <div
                  onClick={() =>
                    user.email && navigator.clipboard.writeText(user.email)
                  }
                  className="flex items-center justify-between  space-x-4 rounded-md  p-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex items-center space-x-4">
                    <Mail className="h-5 w-5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email || "None"}
                      </p>
                    </div>
                  </div>
                  <Copy className=" mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                </div>

                <div
                  onClick={() =>
                    user.phone && navigator.clipboard.writeText(user.phone)
                  }
                  className="flex items-center justify-between  space-x-4 rounded-md  p-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex items-center space-x-4">
                    <Phone className="h-5 w-5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Phone Number
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.phone || "None"}
                      </p>
                    </div>
                  </div>
                  <Copy className=" mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                </div>

                <div
                  onClick={() =>
                    user.role && navigator.clipboard.writeText(user.role)
                  }
                  className="flex items-center justify-between space-x-4 rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex items-center space-x-4">
                    <Key className="h-5 w-5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Role</p>
                      <p className="text-sm text-muted-foreground">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <Copy className=" mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                </div>
              </div>

              <div className="hidden max-h-[400px] w-full flex-col gap-8 overflow-y-scroll scrollbar-hide  sm:flex  ">
                {shifts?.length === 0 ? (
                  <div className="text-sm">No Shifts Recorded</div>
                ) : (
                  shifts?.map((shift) => (
                    <SingleTiming key={shift.id} shift={shift} />
                  ))
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 ">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Work Hours
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageTime}</div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Average of hours worked between all shifts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Check-In Amount
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{shifts?.length}</div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Number of times checked into work
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <Button
              onClick={() => handleDeleteUser(user.id)}
              className="bg-rose-500"
            >
              Delete User
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ViewTimes

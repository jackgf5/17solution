"use client"

import React, { useEffect, useState } from "react"
import { Shift, User } from "@prisma/client"
import axios from "axios"
import { Clock } from "lucide-react"

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
} from "@/components/ui/alert-dialog"

import SingleTiming from "./single-timing"

const shift: Shift = {
  userId: "",
  id: "clj62yt7j0001mk08z2xwg28u",
  date: "2023-06-21T19:01:30Z",
  checkinTime: "2023-06-21T19:01:30Z",
  checkoutTime: "2023-06-21T19:01:48Z",
  durationWorked: "0",
  completed: true,
  breaksTaken: 0,
}

const ViewTimes = ({ user }: { user: User }) => {
  const [shifts, setShifts] = useState<Shift[]>()

  useEffect(() => {
    axios
      .post("/api/employee/getshifts/", { userId: user.id })
      .then((response) => {
        setShifts(response.data.shifts)
      })
      .catch((err) => console.log(err))
  }, [user.id])

  return (
    <div className="flex items-center space-x-2">
      <AlertDialog>
        <AlertDialogTrigger className=" relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent  focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          <Clock className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          View Timings
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className=" mb-4">User Shifts</AlertDialogTitle>
            <div className="flex max-h-[500px] flex-col gap-8 overflow-y-scroll scrollbar-hide  ">
              {shifts?.length === 0 ? (
                <div className="text-sm">No Shifts Recorded</div>
              ) : (
                shifts?.map((shift) => (
                  <SingleTiming key={shift.id} shift={shift} />
                ))
              )}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ViewTimes

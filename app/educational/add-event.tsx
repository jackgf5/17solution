"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { User } from "@prisma/client"
import axios from "axios"
import {
  Bell,
  CalendarIcon,
  Contact,
  ContactIcon,
  Copy,
  Key,
  User as UserIcon,
} from "lucide-react"
import {
  Field,
  FieldValues,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form"
import { toast } from "react-hot-toast"

import "react-phone-number-input/style.css"
import { format, formatISO } from "date-fns"
import { TimeValue } from "react-aria"

import { cn } from "@/lib/utils"
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
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TimePicker } from "@/components/ui/time-picker"
import { Icons } from "@/components/icons"

function capitalizeText(text: string) {
  const words = text.trim().split(/\s+/)
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  })

  const capitalizedText = capitalizedWords.join(" ")

  return capitalizedText
}
const AddEvent = ({ currentEducational }: { currentEducational: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date>()
  const [eventName, setEventName] = useState("")
  const [startTime, setStartTime] = useState<TimeValue | null>()
  const [endTime, setEndTime] = useState<TimeValue | null>()
  const router = useRouter()

  const handleStartTimeChange = (value: TimeValue) => {
    setStartTime(value)
  }

  const handleEndTimeChange = (value: TimeValue) => {
    setEndTime(value)
  }
  const onSubmit: SubmitHandler<FieldValues> = () => {
    setIsLoading(true)
    if (!eventName || !startTime || !endTime || !date) {
      return setIsLoading(false)
    }

    const startTimeDate = new Date(
      1970,
      0,
      1,
      startTime.hour,
      startTime.minute,
      0,
      0
    )
    const startTimeIso = formatISO(startTimeDate)
    const endTimeDate = new Date(1970, 0, 1, endTime.hour, endTime.minute, 0, 0)
    const endTimeIso = formatISO(endTimeDate)
    const dateIso = formatISO(date)

    const data = {
      name: eventName,
      startTime: startTimeIso,
      endTime: endTimeIso,
      date: dateIso,
      currentEducational: currentEducational,
    }

    axios
      .post("/api/events/", data)
      .then((response) => {
        if (response.status !== 200) throw new Error("Event Not Created")
        toast.success("Event Created")
        router.refresh()
      })
      .catch((error) => {
        console.log(error)
        toast.error(error.response.data.msg)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleChooseContent = () => {
    return (
      <AlertDialogContent className="w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle className=" mb-4">Create Event</AlertDialogTitle>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Event Name</Label>
              <Input
                className="capitalize"
                value={eventName}
                onChange={(event) => setEventName(event.target.value)}
                type="text"
                id="name"
                placeholder="Name"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Date</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        " w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      required
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex w-full flex-col gap-2">
                <Label htmlFor="password">Start Time</Label>
                <TimePicker
                  onChange={handleStartTimeChange}
                  value={startTime}
                  isRequired
                />
              </div>

              <div className="flex w-full flex-col gap-2">
                <Label htmlFor="password">End Time</Label>
                <TimePicker
                  onChange={handleEndTimeChange}
                  value={endTime}
                  isRequired
                />
              </div>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>

          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Event
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <AlertDialog>
        <AlertDialogTrigger className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Create Event
        </AlertDialogTrigger>
        {handleChooseContent()}
      </AlertDialog>
    </div>
  )
}

export default AddEvent

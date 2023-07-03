"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shift, User } from "@prisma/client"
import axios from "axios"
import { format } from "date-fns"
import {
  Activity,
  BellIcon,
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

const SendNoti = ({ user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const router = useRouter()

  const onSubmit = () => {
    setIsLoading(true)
    if (!title || !body) {
      toast.error("Missing Fields")
      return setIsLoading(false)
    }
    if (!user.expoToken) {
      toast.error("User Must Accept Notifications")
      return setIsLoading(false)
    }
    const data = {
      notiTitle: title,
      notiBody: body,
      expoTokens: [user.expoToken],
    }

    axios
      .post("/api/noti/", data)
      .then((response) => {
        if (response.status !== 200) throw new Error("Notification Not Sent")
        toast.success("Notification Sent")
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

  return (
    <div className="flex  items-center space-x-2">
      <AlertDialog>
        <AlertDialogTrigger className=" relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent  focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          <BellIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Send Noti
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className=" mb-4">
              Send Notification
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input
                className="capitalize"
                type="text"
                id="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="body">Notification Body</Label>
              <Input
                className="capitalize"
                type="text"
                id="body"
                value={body}
                onChange={(e) => setBody(e.currentTarget.value)}
                placeholder="Body"
                disabled={isLoading}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <Button onClick={onSubmit} disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Notification
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default SendNoti

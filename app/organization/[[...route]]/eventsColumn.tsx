"use client"

import { useRouter } from "next/navigation"
import { Event, User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import axios from "axios"
import { Copy, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ViewTimes from "@/app/organization/view-times"

export interface UserWithShift {
  id: string
  name: string
  username: string
  role: string
  email: string | null
  phone: string | null
  hashedPassword: string
  educationalId: string
  organizationId: string | null
  shifts: any[]
  checkinTime: string
  checkoutTime: string
  durationWorked: string
  amountInside: number | null
  amountOutside: number | null
  amountChecked: number | null
}

const ActionsCell = ({ row }: any) => {
  const event = row.original
  const router = useRouter()

  const handleDeleteEvent = async (eventId: string) => {
    axios
      .post("/api/events/delete/", { eventId: eventId })
      .then((response) => {
        if (response.status !== 200) throw new Error("Event Not Deleted")
        toast.success("Event Deleted")
        router.refresh()
      })
      .catch((error) => {
        toast.error(error.response.data.msg)
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleDeleteEvent(event.id)}>
          <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Delete Event
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const eventsColumns: ColumnDef<Event>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
  },
  {
    accessorKey: "endTime",
    header: "End Time",
  },
  {
    accessorKey: "date",
    header: "Date",
  },

  {
    id: "actions",
    cell: ActionsCell,
  },
]

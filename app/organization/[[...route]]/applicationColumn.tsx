"use client"

import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import axios from "axios"
import { Check, Copy, MoreHorizontal, Trash, X } from "lucide-react"
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

interface ApplicationUser {
  username: string
  name: string
  id: string
  startDate: string
  endDate: string
  reason: string
  daysOff: number
  userId: string
  educationalId: string | null
  organizationId: string | null
  status: "AWAITING" | "APPROVED" | "DECLINED"
}

const ActionsCell = ({ row }: any) => {
  const application = row.original
  const router = useRouter()

  const handleUpdateStatus = async (
    applicationId: string,
    newStatus: "AWAITING" | "APPROVED" | "DECLINED"
  ) => {
    if (application.status === "APPROVED" || application.status === "DECLINED")
      return toast.error("Status Already Set")
    axios
      .post("/api/employee/updatestatus/", {
        applicationId: applicationId,
        newStatus,
      })
      .then((response) => {
        if (response.status !== 200) throw new Error("Status Not Updated")
        toast.success("Status Updated")
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
        <DropdownMenuItem
          onClick={() => handleUpdateStatus(application.id, "APPROVED")}
        >
          <Check className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Approve
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleUpdateStatus(application.id, "DECLINED")}
        >
          <X className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Decline
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const applicationColumns: ColumnDef<ApplicationUser>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
  {
    accessorKey: "daysOff",
    header: "Days Off",
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "status",
    header: "Status",
  },

  {
    id: "actions",
    cell: ActionsCell,
  },
]

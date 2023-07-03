"use client"

import { useRouter } from "next/navigation"
import { User } from "@prisma/client"
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

import SendNoti from "../send-noti"

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
  const user = row.original
  const router = useRouter()

  const handleDeleteUser = async (userId: string) => {
    axios
      .post("/api/auth/user/delete", { userId })
      .then((response) => {
        if (response.status !== 200) throw new Error("Teacher Not Deleted")
        toast.success("Teacher Deleted")
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
        <ViewTimes user={user} />
        <SendNoti user={user} />
        <DropdownMenuItem
          onClick={() =>
            navigator.clipboard.writeText(
              `username:${user.username},password:${user.hashedPassword}`
            )
          }
        >
          <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Copy Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
          <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Delete Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const allColumns: ColumnDef<UserWithShift>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "checkinTime",
    header: "Checked In",
  },
  {
    accessorKey: "checkoutTime",
    header: "Checked Out",
  },
  {
    accessorKey: "durationWorked",
    header: "Duration Worked",
  },
  {
    accessorKey: "amountOutside",
    header: "Left Zone",
  },

  {
    id: "actions",
    cell: ActionsCell,
  },
]

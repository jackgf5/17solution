"use client"

import { useRouter } from "next/navigation"
import { User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import axios from "axios"
import { Copy, MoreHorizontal, PencilIcon, Trash } from "lucide-react"
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

import EditEmployee from "./edit-accounts"
import ViewTimes from "./view-times"

const ActionsCell = ({ row }: any) => {
  const user = row.original
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <EditEmployee user={user} />
        <ViewTimes user={user} />
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

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
  },
  {
    id: "actions",
    cell: ActionsCell,
  },
]

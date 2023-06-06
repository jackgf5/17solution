"use client"

import Router, { useRouter } from "next/navigation"
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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

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
    accessorKey: "hashedPassword",
    header: "Password",
  },
  {
    id: "actions",
    cell: ({ row }) => {
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
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
    },
  },
]

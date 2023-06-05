"use client"

import { User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Copy, MoreHorizontal, Trash } from "lucide-react"

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
      const payment = row.original

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
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Copy Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Delete Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

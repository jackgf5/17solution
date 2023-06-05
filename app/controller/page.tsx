"use client"

import React, { useState } from "react"

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
import { Icons } from "@/components/icons"

import { columns } from "./column"
import { payments } from "./data"
import { DataTable } from "./data-table"

const page = () => {
  const [addAccountVisible, setAddAccountVisible] = useState<boolean>(false)
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-20 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome Controller !
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all accounts!
          </p>
        </div>{" "}
        <div className="flex items-center space-x-2">
          <AlertDialog>
            <AlertDialogTrigger className="inline-flex h-9 px-3 bg-primary text-primary-foreground hover:bg-primary/90 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background">
              <Icons.user className="mr-2 h-4 w-4" />
              Add Account
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <DataTable columns={columns} data={payments} />
    </div>
  )
}

export default page

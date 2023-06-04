import React from "react"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

const page = () => {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome Controller !
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all accounts!
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm">
            <Icons.user className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>
      </div>
    </div>
  )
}

export default page

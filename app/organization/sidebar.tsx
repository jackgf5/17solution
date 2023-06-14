import Link from "next/link"
import {
  Calendar,
  LayoutGrid,
  Library,
  ListMusic,
  Mic2,
  Music,
  Music2,
  PlayCircle,
  Radio,
  User,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Sidebar({
  className,
  selection,
}: {
  className: string
  selection: string
}) {
  return (
    <div className={cn("hidden pb-12 xl:block", className)}>
      <div className="space-y-4 py-4">
        <div className="">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Employees
          </h2>
          <div className="space-y-1">
            <Button
              variant={
                selection === "employees" || selection === ""
                  ? "default"
                  : "ghost"
              }
              size="sm"
              className="w-full justify-start"
            >
              <Link
                className="flex w-full items-center"
                href={"/organization/employees"}
              >
                <Users className="mr-2 h-4 w-4" />
                View Employees
              </Link>
            </Button>
          </div>
        </div>
        <div className="">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Events
          </h2>
          <div className="space-y-1">
            <Button
              variant={selection === "calendar" ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
            >
              <Link
                className="flex w-full items-center"
                href={"/organization/calendar"}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

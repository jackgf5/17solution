import Link from "next/link"
import {
  BarChart,
  Calendar,
  CalendarRange,
  GraduationCap,
  Layers,
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
            Stats
          </h2>
          <div className="space-y-1">
            <Link className="flex w-full items-center" href={"/educational/"}>
              <Button
                variant={selection === "" ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <BarChart className="mr-2 h-4 w-4" />
                View Stats
              </Button>
            </Link>
          </div>
        </div>
        <div className="">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Teachers
          </h2>
          <div className="space-y-1">
            <Link
              className="flex w-full items-center"
              href={"/educational/teachers"}
            >
              <Button
                variant={selection === "teachers" ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <Users className="mr-2 h-4 w-4" />
                View Teachers
              </Button>
            </Link>
          </div>
        </div>

        <div className="">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Students
          </h2>
          <div className="space-y-1">
            <Link
              className="flex w-full items-center"
              href={"/educational/students"}
            >
              <Button
                variant={selection === "students" ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                View Students
              </Button>
            </Link>
          </div>
        </div>

        <div className="">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Events
          </h2>
          <div className="space-y-1">
            <Link
              className="flex w-full items-center"
              href={"/educational/events"}
            >
              <Button
                variant={selection === "events" ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <CalendarRange className="mr-2 h-4 w-4" />
                View Events
              </Button>
            </Link>
          </div>
        </div>

        <div className="">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Leave
          </h2>
          <div className="space-y-1">
            <Link
              className="flex w-full items-center"
              href={"/educational/leave"}
            >
              <Button
                variant={selection === "leave" ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <Layers className="mr-2 h-4 w-4" />
                View Applications
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

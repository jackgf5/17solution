import React from "react"
import { format } from "date-fns"
import {
  Activity,
  CheckCircle2,
  CreditCard,
  DollarSign,
  UserX,
  Users,
  Watch,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface StatsProps {
  checkedInCount: number
  totalCount: number
  totalHours: number
  absentCount: number
}

const Stats: React.FC<StatsProps> = ({
  checkedInCount,
  totalCount,
  totalHours,
  absentCount,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Checked In</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{checkedInCount}</div>
          <p className="mt-2 text-xs text-muted-foreground">
            Amount of employees checked in today
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Late</CardTitle>
          <Watch className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
          <p className="mt-2 text-xs text-muted-foreground">
            Number of employees that checked in late today
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Absent</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{absentCount}</div>
          <p className="mt-2 text-xs text-muted-foreground">
            Number of employees who have not checked in today
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Work Hours
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {format(
              new Date(0, 0, 0, 0, totalHours / totalCount || 0),
              "HH:mm"
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Average of hours worked between all users
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Stats

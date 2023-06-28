import React from "react"
import { Shift } from "@prisma/client"
import { format, parseISO } from "date-fns"
import { Calendar, Clock, Radio } from "lucide-react"

function convertMinutesToHHMM(minutesString: string) {
  const minutes = parseInt(minutesString, 10)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  const formattedTime = `${hours.toString().padStart(2, "0")}:${remainingMinutes
    .toString()
    .padStart(2, "0")}`
  return formattedTime
}

const SingleTiming = ({ shift }: { shift: Shift }) => {
  return (
    <div className=" flex items-center justify-between  rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
      <div className="flex  flex-col items-center justify-center gap-3 ">
        <Calendar className="h-6 w-6" />

        <div className=" flex flex-col items-center gap-2">
          <div className="text-xs font-medium">
            {format(parseISO(shift.date), "dd-MM-yyyy")}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            {shift?.durationWorked &&
              convertMinutesToHHMM(shift.durationWorked)}{" "}
            <div className="text-[10px]">Hours</div>
          </div>
        </div>
      </div>
      <div className="mr-2 flex flex-col items-center justify-center gap-3">
        <Clock className="h-6 w-6" />

        <div className=" flex flex-col items-center gap-2">
          <div className="text-xs font-medium">Times</div>
          <div className="flex items-center justify-center gap-2 text-xs  font-bold">
            {format(parseISO(shift.checkinTime), "HH:mm")} -{" "}
            {shift.checkoutTime &&
              format(parseISO(shift.checkoutTime), "HH:mm")}
          </div>
        </div>
      </div>
      <div className="mr-2 flex flex-col items-center justify-center gap-3">
        <Radio className="h-6 w-6" />

        <div className=" flex flex-col items-center justify-center gap-2">
          <div className="text-center text-xs font-medium">Left Zone</div>
          <div className="flex items-center gap-2 text-center text-xs  font-bold">
            {shift.amountOutside} / {shift.amountChecked}
          </div>
        </div>
      </div>{" "}
    </div>
  )
}

export default SingleTiming

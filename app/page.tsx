import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { authOptions } from "./api/auth/[...nextauth]/route"

const page = async () => {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth")
  if (session.user?.role === "ADMIN") redirect("/controller")
  if (session.user?.role === "EDUCATIONAL") redirect("/educational")

  return <div>page</div>
}

export default page

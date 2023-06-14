import { redirect } from "next/navigation"
import bcrypt from "bcrypt"
import { getServerSession } from "next-auth/next"

import { authOptions } from "./api/auth/[...nextauth]/route"

const page = async () => {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth")
  if (session.user?.role === "ADMIN") redirect("/controller")
  if (session.user?.role === "EDUCATIONAL") redirect("/educational")
  if (session.user?.role === "ORGANIZATION") redirect("/organization/employees")

  return <div>page</div>
}

export default page

"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { User } from "@prisma/client"
import axios from "axios"
import {
  Bell,
  Contact,
  ContactIcon,
  Copy,
  Key,
  Pencil,
  User as UserIcon,
} from "lucide-react"
import {
  Field,
  FieldValues,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form"
import { toast } from "react-hot-toast"

import "react-phone-number-input/style.css"
import { isPossiblePhoneNumber } from "react-phone-number-input"
import PhoneInput from "react-phone-number-input/react-hook-form-input"

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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

function generateRandomString(length: number) {
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  var randomString = ""
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length)
    randomString += characters.charAt(randomIndex)
  }
  return randomString
}

const EditEmployee = ({ user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(0)
  const [createdUser, setCreatedUser] = useState<User>()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>()

  const currentUsername = user.username

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    const user = {
      username: currentUsername,
      password: data.password,
    }

    axios
      .post("/api/auth/user/updatepassword", user)
      .then((response) => {
        if (response.status !== 200) throw new Error("Password Not Updated")
        toast.success("Password Updated")
        reset()
        setCreatedUser({ ...response.data.user, hashedPassword: data.password })
        setPageNumber(1)
        router.refresh()
      })
      .catch((error) => {
        toast.error(error.response.data.msg)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleChooseContent = () => {
    if (pageNumber === 0) {
      return (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className=" mb-4">Edit Password</AlertDialogTitle>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex gap-2">
                  <Input
                    disabled={isLoading}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    type="text"
                    id="password"
                    placeholder="Password"
                  />
                  <Button
                    disabled={isLoading}
                    onClick={() => {
                      const randomString = generateRandomString(15)
                      setValue("password", randomString)
                    }}
                    type="submit"
                  >
                    Random
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Enter text to be hashed into password
                </div>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>

            <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Employee
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      )
    }
    if (pageNumber === 1) {
      if (!createdUser) return
      return (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>User</AlertDialogTitle>
            <div className="flex flex-col gap-2">
              <div
                onClick={() => navigator.clipboard.writeText(createdUser.name)}
                className="flex items-center justify-between space-x-4 rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
              >
                <div className="flex items-center space-x-4">
                  <UserIcon className="h-5 w-5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Name</p>
                    <p className="text-sm text-muted-foreground">
                      {createdUser.name}
                    </p>
                  </div>
                </div>
                <Copy className=" mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              </div>

              <div
                onClick={() =>
                  navigator.clipboard.writeText(createdUser.username)
                }
                className="flex items-center justify-between  space-x-4 rounded-md  p-2 hover:bg-accent hover:text-accent-foreground"
              >
                <div className="flex items-center space-x-4">
                  <Contact className="h-5 w-5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Username</p>
                    <p className="text-sm text-muted-foreground">
                      {createdUser.username}
                    </p>
                  </div>
                </div>
                <Copy className=" mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              </div>

              <div
                onClick={() =>
                  createdUser.hashedPassword &&
                  navigator.clipboard.writeText(createdUser.hashedPassword)
                }
                className="flex items-center justify-between space-x-4 rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
              >
                <div className="flex items-center space-x-4">
                  <Key className="h-5 w-5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Password</p>
                    <p className="text-[10px] text-muted-foreground">
                      {createdUser.hashedPassword}
                    </p>
                  </div>
                </div>
                <Copy className=" mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPageNumber(0)}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      )
    } else {
      return <div></div>
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <AlertDialog>
        <AlertDialogTrigger className=" relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent  focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          <Pencil className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Edit
        </AlertDialogTrigger>
        {handleChooseContent()}
      </AlertDialog>
    </div>
  )
}

export default EditEmployee

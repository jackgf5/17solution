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

function capitalizeText(text: string) {
  const words = text.trim().split(/\s+/)
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  })

  const capitalizedText = capitalizedWords.join(" ")

  return capitalizedText
}
const AddAccount = () => {
  const [selectedCheckbox, setSelectedCheckbox] = useState("EDUCATIONAL")
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
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    const user = {
      name: capitalizeText(data.name),
      type: selectedCheckbox,
      username: `${data.username.toLowerCase()}@${data.name.toLowerCase()}`,
      password: data.password,
    }

    axios
      .post("/api/auth/register", user)
      .then((response) => {
        if (response.status !== 200) throw new Error("User Not Created")
        toast.success("User Created")
        reset()
        setCreatedUser(response.data.user)
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

  const username = useWatch({
    control,
    name: "username",
    defaultValue: "",
  })

  const name = useWatch({
    control,
    name: "name",
    defaultValue: "",
  })

  const handleChooseContent = () => {
    if (pageNumber === 0) {
      return (
        <AlertDialogContent className="w-[90%]">
          <AlertDialogHeader>
            <AlertDialogTitle className=" mb-4">Add An Admin</AlertDialogTitle>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  className="capitalize"
                  {...register("name", { required: "Name is required" })}
                  type="text"
                  id="name"
                  placeholder="Name"
                  disabled={isLoading}
                />
              </div>

              <div className="flex-4 flex flex-col gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="organization"
                    onCheckedChange={() => setSelectedCheckbox("ORGANIZATION")}
                    checked={selectedCheckbox === "ORGANIZATION"}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="organization"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Organization
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="educational"
                    onCheckedChange={() => setSelectedCheckbox("EDUCATIONAL")}
                    checked={selectedCheckbox === "EDUCATIONAL"}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="educational"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Educational Institution
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  disabled={isLoading}
                  {...register("username", {
                    required: "Username is required",
                    pattern: {
                      value: /^[^\s]+$/,
                      message: "Spaces are not allowed in the username",
                    },
                  })}
                  className="lowercase"
                  type="text"
                  id="username"
                  placeholder="Username"
                />
                <div className="text-sm text-muted-foreground">
                  {`${username.toLowerCase()}@${name.toLowerCase()}`}
                </div>
                <div className="text-sm  lowercase text-rose-500">
                  {errors["username"]?.message?.toString() ===
                    "Spaces are not allowed in the username" && (
                    <div>{errors["username"]?.message.toString()}</div>
                  )}
                </div>
              </div>

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
                  Enter text to be hased into password
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
              Create User
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
        <AlertDialogTrigger className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          <Icons.user className="mr-2 h-4 w-4" />
          Add Account
        </AlertDialogTrigger>
        {handleChooseContent()}
      </AlertDialog>
    </div>
  )
}

export default AddAccount

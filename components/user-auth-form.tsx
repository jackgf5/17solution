"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<Boolean>()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)
    signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    })
      .then((callback) => {
        if (callback?.ok && !callback.error) {
          toast.success("Logged In")
          router.push("/")
        }
        if (callback?.error) toast.error(callback.error)
      })
      .finally(() => setIsLoading(false))
  }

  const handlePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-2">
            <Label className="sr-only" htmlFor="username">
              Email
            </Label>
            <Input
              id="username"
              placeholder="Username"
              type="text"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading}
              {...register("username", { required: "Username is required" })}
            />
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={isLoading}
                {...register("password", { required: "Password is required" })}
              />
              <div
                onClick={handlePasswordVisibility}
                className={cn(
                  "absolute right-4  top-1/2  -translate-y-1/2 transform cursor-pointer transition",
                  showPassword ? "text-blue-500" : "text-black"
                )}
              >
                {showPassword ? (
                  <Icons.eyeClosed className="h-4 w-4 transition" />
                ) : (
                  <Icons.eyeOpen className="h-4 w-4 transition" />
                )}
              </div>
            </div>
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </div>
      </form>
    </div>
  )
}

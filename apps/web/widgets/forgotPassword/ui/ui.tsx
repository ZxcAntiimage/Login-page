"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { validateEmail } from "@/features/Validation"
import { sendResetCode } from "@/features/api/send-reset-code"

export function ForgotPasswordForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateEmail(email)
    if (!validation.valid) {
      setError(validation.message)
      return
    }

    try {
      setError(undefined)
      setIsLoading(true)

      await sendResetCode(email)

      localStorage.setItem("reset_password_email", email)
      router.push("/auth/forgotPassword/verifyCode/")
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email" className="text-sm text-[#1C1B1F]">
              Email
            </FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              disabled={isLoading}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError(undefined)
              }}
              className={`h-14 w-full rounded-md border px-4 py-2 text-base text-[#1C1B1F] ${
                error ? "border-red-500! focus:ring-red-500" : ""
              }`}
              placeholder="example@mail.com"
            />
            
            {error && (
              <p className="mt-1 text-sm text-red-500! font-medium">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-8 h-12 w-full bg-[#515DEF]! text-[#F3F3F3]! hover:bg-[#518DEF]! disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Submit"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}

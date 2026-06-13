"use client"

import { resetPasswordApi } from "@/features/api/reset-password"
import { validateConfirmPassword, validatePassword } from "@/features/Validation"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@workspace/ui/components/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@workspace/ui/components/input-group"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"


export function NewPasswordForm() {
  const router = useRouter()
  const [icEye, setIcEye] = useState(false)
  const [icConfirmEye, setIcConfirmEye] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [userEmail, setUserEmail] = useState<string>("")
  const [resetCode, setResetCode] = useState<string>("")

  const [errors, setErrors] = useState<{
    password?: string
    confirmPassword?: string
    server?: string
  }>({})

  useEffect(() => {
    const email = localStorage.getItem("reset_password_email") || ""
    const code = localStorage.getItem("reset_password_code") || ""
    
    setUserEmail(email)
    setResetCode(code)

    if (!email || !code) {
      setErrors({ server: "Session data is missing. Please start over." })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const passwordValidation = validatePassword(password)
    const confirmValidation = validateConfirmPassword(password, confirmPassword)

    if (!passwordValidation.valid || !confirmValidation.valid) {
      setErrors({
        password: passwordValidation.valid ? undefined : passwordValidation.message,
        confirmPassword: confirmValidation.valid ? undefined : confirmValidation.message,
      })
      return
    }

    if (!userEmail || !resetCode) {
      setErrors({ server: "Required session credentials not found. Restart recovery process." })
      return
    }

    try {
      setErrors({})
      setIsLoading(true)

      await resetPasswordApi({ email: userEmail, code: resetCode, password })

      localStorage.removeItem("reset_password_email")
      localStorage.removeItem("reset_password_code")

      router.push("/auth/")
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        server: err.message || "An error occurred during password reset.",
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {errors.server && (
        <div className="mb-6 rounded-lg bg-red-50 p-3 border border-red-200 text-sm text-red-600 font-medium">
          {errors.server}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="password" className="text-sm text-[#1C1B1F]">
                Create Password
              </FieldLabel>
              <InputGroup
                className={`mb-2 overflow-hidden rounded-md border ${
                  errors.password ? "border-red-500" : "border-[#1C1B1F]"
                }`}
              >
                <InputGroupInput
                  className="h-14 w-full px-4 py-2 text-base text-[#1C1B1F] focus:outline-none disabled:opacity-50"
                  id="password"
                  disabled={isLoading}
                  type={icEye ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <button
                    className="flex cursor-pointer items-center justify-center border-none bg-transparent p-2"
                    type="button"
                    onClick={() => setIcEye(!icEye)}
                    aria-label={icEye ? "Hide password" : "Show password"}
                  >
                    {icEye ? <EyeIcon className="h-5 w-5 text-gray-500" /> : <EyeOffIcon className="h-5 w-5 text-gray-500" />}
                  </button>
                </InputGroupAddon>
              </InputGroup>
              
              {errors.password && (
                <p className="mb-4 text-sm font-medium text-red-500">
                  {errors.password}
                </p>
              )}

              <FieldLabel htmlFor="confirmPassword" className="text-sm text-[#1C1B1F]">
                Re-enter Password
              </FieldLabel>
              <InputGroup
                className={`mb-2 overflow-hidden rounded-md border ${
                  errors.confirmPassword ? "border-red-500" : "border-[#1C1B1F]"
                }`}
              >
                <InputGroupInput
                  className="h-14 w-full px-4 py-2 text-base text-[#1C1B1F] focus:outline-none disabled:opacity-50"
                  id="confirmPassword"
                  disabled={isLoading}
                  type={icConfirmEye ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <button
                    className="flex cursor-pointer items-center justify-center border-none bg-transparent p-2"
                    type="button"
                    onClick={() => setIcConfirmEye(!icConfirmEye)}
                    aria-label={icConfirmEye ? "Hide password" : "Show password"}
                  >
                    {icConfirmEye ? <EyeIcon className="h-5 w-5 text-gray-500" /> : <EyeOffIcon className="h-5 w-5 text-gray-500" />}
                  </button>
                </InputGroupAddon>
              </InputGroup>

              {errors.confirmPassword && (
                <p className="mb-6 text-sm font-medium text-red-500">
                  {errors.confirmPassword}
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading || !userEmail || !resetCode}
                className="mt-2 h-12 w-full bg-[#515DEF]! text-[#F3F3F3]! hover:bg-[#518DEF]! disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Updating..." : "Set password"}
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  )
}

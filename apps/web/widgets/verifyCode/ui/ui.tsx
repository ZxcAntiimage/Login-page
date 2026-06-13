"use client"

import { fetchVerificationCodeApi, verifyCodeApi } from "@/features/api/verify-code"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@workspace/ui/components/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@workspace/ui/components/input-otp"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"


export function VerifyCodeForm() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  
  const [receivedCode, setReceivedCode] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number>(60)
  const [isCanResend, setIsCanResend] = useState<boolean>(false)
  const [userEmail, setUserEmail] = useState<string>("")

  const loadCode = useCallback(async (emailAddress: string) => {
    try {
      const serverCode = await fetchVerificationCodeApi(emailAddress)
      setReceivedCode(serverCode)
    } catch (err: any) {
      setError(err.message || "Network error. Could not fetch verification code.")
    }
  }, [])

  useEffect(() => {
    const email = localStorage.getItem("reset_password_email") || "user@example.com"
    setUserEmail(email)
    loadCode(email)
  }, [loadCode])

  useEffect(() => {
    if (countdown <= 0) {
      setIsCanResend(true)
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  const handleResend = async () => {
    if (!isCanResend) return
    setError(undefined)
    setCountdown(60)
    setIsCanResend(false)
    await loadCode(userEmail)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code.trim()) {
      setError("Please enter the verification code")
      return
    }

    if (code.length < 6) {
      setError("The code must be exactly 6 digits")
      return
    }

    try {
      setError(undefined)
      setIsLoading(true)

      await verifyCodeApi({ email: userEmail, code })

      localStorage.setItem("reset_password_code", code)
      router.push("/auth/forgotPassword/verifyCode/newPassword")
    } catch (err: any) {
      setError(err.message || "Verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-base font-normal text-wrap text-[#313131]">
          An authentication code has been sent to <span className="font-semibold">{userEmail}</span>.
        </h3>
        
        {receivedCode && (
          <div className="mt-4 rounded-lg bg-blue-50 p-3 border border-blue-200 text-sm text-blue-700 font-medium transition-all duration-300">
            Код подтверждения от сервера: <span className="text-base font-bold tracking-widest bg-transparent">{receivedCode}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp-input" className="mb-3 block text-sm text-[#1C1B1F]">
                Enter Code
              </FieldLabel>
              
              <div className="mb-4 flex flex-col items-start gap-2">
                <InputOTP
                  id="otp-input"
                  maxLength={6}
                  value={code}
                  disabled={isLoading}
                  onChange={(value) => {
                    setCode(value)
                    if (error) setError(undefined)
                  }}
                >
                  <InputOTPGroup className="gap-2 bg-transparent">
                    <InputOTPSlot index={0} className={`h-14 w-12 text-lg font-semibold rounded-md border ${error ? "border-red-500!" : "border-[#1C1B1F]!"}`} />
                    <InputOTPSlot index={1} className={`h-14 w-12 text-lg font-semibold rounded-md border ${error ? "border-red-500!" : "border-[#1C1B1F]!"}`} />
                    <InputOTPSlot index={2} className={`h-14 w-12 text-lg font-semibold rounded-md border ${error ? "border-red-500!" : "border-[#1C1B1F]!"}`} />
                    <InputOTPSlot index={3} className={`h-14 w-12 text-lg font-semibold rounded-md border ${error ? "border-red-500!" : "border-[#1C1B1F]!"}`} />
                    <InputOTPSlot index={4} className={`h-14 w-12 text-lg font-semibold rounded-md border ${error ? "border-red-500!" : "border-[#1C1B1F]!"}`} />
                    <InputOTPSlot index={5} className={`h-14 w-12 text-lg font-semibold rounded-md border ${error ? "border-red-500!" : "border-[#1C1B1F]!"}`} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && (
                <p className="mb-4 text-sm font-medium text-red-500">{error}</p>
              )}

              <div className="mb-4 flex flex-row items-center gap-1 text-sm bg-transparent">
                <span className="font-medium text-[#313131] bg-transparent">
                  Didn’t receive a code?
                </span>
                <Button
                  type="button"
                  disabled={!isCanResend || isLoading}
                  onClick={handleResend}
                  className="p-0 h-auto bg-transparent border-none font-semibold text-[#FF8682]! hover:bg-transparent! disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCanResend ? "Resend" : `Resend in ${countdown}s`}
                </Button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full bg-[#515DEF]! text-[#F3F3F3]! hover:bg-[#518DEF]! disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  )
}

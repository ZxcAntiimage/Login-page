"use client"
import { icLogin, icLogo } from "@/shared/api"
import Image from "next/image"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { useState } from "react"
import { Checkbox } from "@workspace/ui/components/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { validateLoginForm } from "@/features/Validation"
import { Auth, useAuth } from "@/features/api/auth"

export default function LoginContent() {
  const [icEye, setIcEye] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  )
  const router = useRouter()

  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateLoginForm(email, password)
    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    try {
      const response = await login({
        email,
        password
      })

      Auth.handleLoginResponse(response as { access_token: string })
      router.push("/")
    } catch (error) {
      console.error("Login failed:", error)
      setErrors((prev) => ({
        ...prev,
        email: "Invalid email or password"
      }))
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 md:p-0">
      <div className="flex w-full max-w-6xl flex-col items-center justify-between gap-8 pt-6 pr-0 pb-6 pl-0 md:flex-row md:gap-20 md:pt-12.75 md:pr-26 md:pb-26 md:pl-15.5 lg:gap-26">
        <div className="mx-auto flex w-full max-w-lg flex-col md:mx-0">
          <div className="mb-10 flex flex-row justify-center gap-3 md:mb-20 md:justify-start lg:mb-25">
            <Image src={icLogo} alt="logo" loading="lazy" />
            <h1 className="text-[28px] leading-[150%] font-bold tracking-[-1%] text-[#313131] md:text-[35px]">
              Your Logo
            </h1>
          </div>

          <div className="px-2 md:mx-10.5 md:px-0">
            <div className="mb-6 w-full text-center md:mb-8.75 md:text-left">
              <h2 className="mb-2 text-3xl font-semibold text-[#313131] md:mb-4 md:text-[40px]">
                Login
              </h2>
              <h4 className="text-sm text-[#313131] md:text-base">
                Login to access your travelwise account
              </h4>
            </div>

            <form
              className="w-full max-w-lg md:max-h-116.5"
              onSubmit={handleSubmit}
            >
              <FieldGroup>
                <Field>
                  <FieldLabel className="text-[#1C1B1F]" htmlFor="login">
                    Email
                  </FieldLabel>
                  <Input
                    type="email"
                    className="h-14 w-full rounded-md border px-4 py-2 text-base text-[#1C1B1F]"
                    id="login"
                    placeholder=""
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </Field>
                <Field className="mt-4 md:mt-6">
                  <FieldLabel className="text-[#1C1B1F]" htmlFor="password">
                    Password
                  </FieldLabel>
                  <InputGroup className="overflow-hidden rounded-md border border-[#1C1B1F]">
                    <InputGroupInput
                      className="h-14 w-full px-4 py-2 text-base text-[#1C1B1F] focus:outline-none"
                      id="password"
                      type={icEye ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setErrors((prev) => ({ ...prev, password: undefined }))
                      }}
                    />
                    <InputGroupAddon align="inline-end">
                      <button
                        className="flex cursor-pointer items-center justify-center border-none bg-transparent p-2"
                        type="button"
                        onClick={() => setIcEye(!icEye)}
                        aria-label={icEye ? "Hide password" : "Show password"}
                      >
                        {icEye ? (
                          <EyeIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <EyeOffIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password}
                    </p>
                  )}
                </Field>
              </FieldGroup>

              <FieldGroup className="mt-5 md:mt-[25.6px]">
                <Field
                  className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-0"
                  orientation={"horizontal"}
                >
                  <div className="flex items-center gap-2 sm:justify-center">
                    <Checkbox
                      className="h-6 w-6 shrink-0 border border-[#1C1B1F] text-[#1C1B1F]"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked === true)
                      }
                    />
                    <span className="text-sm font-medium text-[#313131] select-none">
                      Remember me
                    </span>
                  </div>
                  <Link
                    href="/auth/forgotPassword"
                    className="cursor-pointer text-sm font-medium text-[#FF8682] sm:self-auto"
                  >
                    Forgot Password
                  </Link>
                </Field>
              </FieldGroup>

              <FieldGroup className="mt-8 md:mt-10">
                <Field className="flex w-full flex-col gap-4">
                  <button
                    type="submit"
                    className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md bg-[#515DEF]! font-medium text-white transition-colors hover:bg-blue-700"
                    onClick={handleSubmit}
                  >
                    Login
                  </button>
                  <span className="mx-auto text-center text-sm font-medium text-[#313131]">
                    Don’t have an account?
                    <Link
                      href="/auth/signUp"
                      className="mx-1 font-semibold text-[#FF8682]"
                    >
                      Sign up
                    </Link>
                  </span>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>

        <div className="hidden w-full max-w-md md:block lg:max-w-none">
          <Image
            className="h-auto w-full max-w-154"
            src={icLogin}
            alt="Image login"
            priority
          />
        </div>
      </div>
    </div>
  )
}

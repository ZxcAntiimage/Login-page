"use client"
import { icLogo, icSignUp } from "@/shared/api"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { validateSignupForm } from "@/features/Validation"
import { Auth, useAuth } from "@/features/api/auth"

export default function SignUpContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [errors, setErrors] = useState<{
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    password?: string
    confirmPassword?: string
    terms?: string
  }>({})
  const router = useRouter()

  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateSignupForm(
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      termsAccepted
    )

    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    try {
      const response = await register({
        email,
        password,
        firstName,
        lastName,
        phone
      })
      Auth.handleLoginResponse(response as { access_token: string })
      router.push("/")
    } catch (error) {
      console.error("Registration failed:", error)
      setErrors((prev) => ({
        ...prev,
        email: "Registration failed. Please try again."
      }))
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 md:p-0">
      <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-12 px-4 py-6 md:flex-row md:px-12 lg:gap-24">
        <div className="hidden w-full max-w-100 shrink-0 md:block lg:max-w-115">
          <Image
            className="h-auto w-full object-contain"
            src={icSignUp}
            alt="sign up img"
            priority
          />
        </div>

        <div className="flex w-full max-w-160 flex-col">
          <div className="mb-12 flex flex-row justify-center gap-3 md:w-160 md:justify-end">
            <Image src={icLogo} alt="logo" loading="lazy" />
            <h1 className="text-[28px] leading-[150%] font-bold tracking-[-1%] text-[#313131] md:text-[35px]">
              Your Logo
            </h1>
          </div>

          <div className="w-full">
            <div className="mb-8 w-full text-center md:text-left">
              <h2 className="mb-2 text-3xl font-semibold text-[#313131] md:text-[40px]">
                Sign up
              </h2>
              <h4 className="text-sm text-[#313131] opacity-75 md:text-base">
                Let’s get you all set up so you can access your personal
                account.
              </h4>
            </div>

            <form className="w-full" onSubmit={handleSubmit}>
              <FieldGroup className="mb-6 grid w-full grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                <Field className="relative flex w-full flex-col md:w-77">
                  <FieldLabel
                    className="absolute -top-2.5 left-3 z-10 bg-white px-1 text-xs font-medium text-[#1C1B1F]"
                    htmlFor="firstName"
                  >
                    First Name
                  </FieldLabel>
                  <Input
                    id="firstName"
                    placeholder="john.doe@gmail.com"
                    className="h-14 w-full rounded-md border border-gray-300 px-4 py-2 text-base text-[#1C1B1F] placeholder:text-gray-400 focus:border-[#515DEF] focus:outline-none"
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value)
                      setErrors((prev) => ({ ...prev, firstName: undefined }))
                    }}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </Field>

                <Field className="relative flex w-full flex-col md:w-77">
                  <FieldLabel
                    className="absolute -top-2.5 left-3 z-10 bg-white px-1 text-xs font-medium text-[#1C1B1F]"
                    htmlFor="lastName"
                  >
                    Last Name
                  </FieldLabel>
                  <Input
                    id="lastName"
                    placeholder="john.doe@gmail.com"
                    className="h-14 w-full rounded-md border border-gray-300 px-4 py-2 text-base text-[#1C1B1F] placeholder:text-gray-400 focus:border-[#515DEF] focus:outline-none"
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value)
                      setErrors((prev) => ({ ...prev, lastName: undefined }))
                    }}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </Field>

                <Field className="relative flex w-full flex-col md:w-77">
                  <FieldLabel
                    className="absolute -top-2.5 left-3 z-10 bg-white px-1 text-xs font-medium text-[#1C1B1F]"
                    htmlFor="email"
                  >
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    placeholder="john.doe@gmail.com"
                    className="h-14 w-full rounded-md border border-gray-300 px-4 py-2 text-base text-[#1C1B1F] placeholder:text-gray-400 focus:border-[#515DEF] focus:outline-none"
                    type="email"
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

                <Field className="relative flex w-full flex-col md:w-77">
                  <FieldLabel
                    className="absolute -top-2.5 left-3 z-10 bg-white px-1 text-xs font-medium text-[#1C1B1F]"
                    htmlFor="phone"
                  >
                    Phone Number
                  </FieldLabel>
                  <Input
                    id="phone"
                    placeholder="john.doe@gmail.com"
                    className="h-14 w-full rounded-md border border-gray-300 px-4 py-2 text-base text-[#1C1B1F] placeholder:text-gray-400 focus:border-[#515DEF] focus:outline-none"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      setErrors((prev) => ({ ...prev, phone: undefined }))
                    }}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </Field>
              </FieldGroup>

              <FieldGroup className="mb-6 flex w-full flex-col gap-6 md:w-160">
                <Field className="relative flex w-full flex-col">
                  <FieldLabel
                    className="absolute -top-2.5 left-3 z-10 bg-white px-1 text-xs font-medium text-[#1C1B1F]"
                    htmlFor="password"
                  >
                    Password
                  </FieldLabel>
                  <InputGroup className="overflow-hidden rounded-md border border-gray-300 focus-within:border-[#515DEF]">
                    <InputGroupInput
                      id="password"
                      placeholder="••••••••••••••••••••"
                      className="h-14 w-full px-4 py-2 text-base text-[#1C1B1F] placeholder:text-gray-400 focus:outline-none"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setErrors((prev) => ({ ...prev, password: undefined }))
                      }}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.password}
                      </p>
                    )}
                    <InputGroupAddon align="inline-end">
                      <button
                        className="flex cursor-pointer items-center justify-center border-none bg-transparent p-4 text-gray-500 hover:text-gray-700"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeIcon className="h-5 w-5" />
                        ) : (
                          <EyeOffIcon className="h-5 w-5" />
                        )}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>

                <Field className="relative flex w-full flex-col">
                  <FieldLabel
                    className="absolute -top-2.5 left-3 z-10 bg-white px-1 text-xs font-medium text-[#1C1B1F]"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </FieldLabel>
                  <InputGroup className="overflow-hidden rounded-md border border-gray-300 focus-within:border-[#515DEF]">
                    <InputGroupInput
                      id="confirmPassword"
                      placeholder="••••••••••••••••••••"
                      className="h-14 w-full px-4 py-2 text-base text-[#1C1B1F] placeholder:text-gray-400 focus:outline-none"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setErrors((prev) => ({
                          ...prev,
                          confirmPassword: undefined,
                        }))
                      }}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                    <InputGroupAddon align="inline-end">
                      <button
                        className="flex cursor-pointer items-center justify-center border-none bg-transparent p-4 text-gray-500 hover:text-gray-700"
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeIcon className="h-5 w-5" />
                        ) : (
                          <EyeOffIcon className="h-5 w-5" />
                        )}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              </FieldGroup>

              <FieldGroup className="mb-8 w-full md:w-160">
                <Field className="flex flex-row items-center gap-2">
                  <Checkbox
                    id="terms"
                    className="h-5 w-5 shrink-0 rounded border border-[#313131] text-[#313131]"
                    checked={termsAccepted}
                    onCheckedChange={(checked) =>
                      setTermsAccepted(checked === true)
                    }
                  />
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-500">{errors.terms}</p>
                  )}
                  <label
                    htmlFor="terms"
                    className="cursor-pointer text-sm font-medium text-[#313131] select-none"
                  >
                    I agree to all the{" "}
                    <span className="text-[#FF8682]">Terms</span> and{" "}
                    <span className="text-[#FF8682]">Privacy Policies</span>
                  </label>
                </Field>
              </FieldGroup>

              <FieldGroup className="w-full md:w-160">
                <Field className="flex w-full flex-col gap-4">
                  <button
                    type="submit"
                    className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md bg-[#515DEF]! text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    onClick={handleSubmit}
                  >
                    Create account
                  </button>
                  <span className="mx-auto text-center text-sm font-medium text-[#313131]">
                    Already have an account?
                    <Link
                      href="/auth/"
                      className="mx-1 font-semibold text-[#FF8682]"
                    >
                      Login
                    </Link>
                  </span>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

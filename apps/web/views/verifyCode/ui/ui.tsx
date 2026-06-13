"use client"

import { icLogin, icLogo } from "@/shared/api"
import { VerifyCodeForm } from "@/widgets/verifyCode/ui/ui"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function VerifyCodePage() {
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

          <Link href={"/auth/"}>
            <div className="mb-4 flex flex-row items-center gap-1">
              <ArrowLeft className="h-6 w-6 text-[#313131]" />
              <span className="text-sm font-medium text-[#313131]">
                Back to login
              </span>
            </div>
          </Link>

          <div className="mb-6">
            <h1 className="text-[40px] font-semibold text-[#313131]">
              Verify Code
            </h1>
          </div>

          <VerifyCodeForm />
          
        </div>
        <div className="hidden w-full max-w-md md:block lg:max-w-none">
          <Image
            className="h-154 w-154"
            src={icLogin}
            alt="img forgot password"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  )
}

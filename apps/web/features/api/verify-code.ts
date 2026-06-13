import { VerifyCodePayload } from "@/entities";

export async function verifyCodeApi({ email, code }: VerifyCodePayload): Promise<void> {
  const res = await fetch("http://localhost:5001/api/auth/verify-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Invalid or expired verification code");
  }
}

export async function fetchVerificationCodeApi(email: string): Promise<string> {
  const res = await fetch("http://localhost:5001/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to deliver code");
  }
  return data.code;
}
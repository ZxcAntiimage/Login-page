import { ResetPasswordPayload } from "@/entities";

export async function resetPasswordApi({ email, code, password }: ResetPasswordPayload): Promise<void> {
  const res = await fetch("http://localhost:5001/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
      newPassword: password,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to reset password");
  }
}
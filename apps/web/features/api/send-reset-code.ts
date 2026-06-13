export async function sendResetCode(email: string): Promise<void> {
  const res = await fetch("http://localhost:5001/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to process request");
  }
}
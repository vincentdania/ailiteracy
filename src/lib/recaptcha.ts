type RecaptchaVerification = {
  success: boolean;
  hostname?: string;
  "error-codes"?: string[];
};

export async function verifyRecaptchaToken(token: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
    });
    if (!response.ok) return false;
    const result = await response.json() as RecaptchaVerification;
    const expectedHostname = new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000").hostname;
    return result.success && (expectedHostname === "localhost" || result.hostname === expectedHostname);
  } catch {
    return false;
  }
}

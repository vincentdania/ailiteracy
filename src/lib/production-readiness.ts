type Environment = Record<string, string | undefined>;

function configured(value: string | undefined) {
  if (!value) return false;
  const normalized = value.toLowerCase();
  return value.length >= 12 && !normalized.includes("replace-with") && !normalized.includes("change-me") && !normalized.includes("local-development");
}

export function productionReadinessIssues(environment: Environment = process.env) {
  const issues: string[] = [];

  if (environment.INTEGRATION_MODE !== "live") issues.push("INTEGRATION_MODE");
  if (!configured(environment.AUTH_SECRET) || (environment.AUTH_SECRET?.length ?? 0) < 32) issues.push("AUTH_SECRET");
  if (!configured(environment.ADMIN_TRIGGER_SECRET) || (environment.ADMIN_TRIGGER_SECRET?.length ?? 0) < 24) issues.push("ADMIN_TRIGGER_SECRET");

  try {
    const publicUrl = new URL(environment.NEXTAUTH_URL ?? "");
    if (publicUrl.protocol !== "https:") issues.push("NEXTAUTH_URL");
  } catch {
    issues.push("NEXTAUTH_URL");
  }

  if (!environment.RESEND_API_KEY) issues.push("RESEND_API_KEY");
  if (!environment.EMAIL_FROM?.includes("@")) issues.push("EMAIL_FROM");
  if (environment.ALLOW_MOCK_CHECKOUT === "true") issues.push("ALLOW_MOCK_CHECKOUT");
  if (environment.SHOW_DEMO_CREDENTIALS === "true") issues.push("SHOW_DEMO_CREDENTIALS");
  if (environment.ADMIN_PREVIEW_ENABLED === "true") issues.push("ADMIN_PREVIEW_ENABLED");

  if (environment.FREE_ENROLLMENT_ENABLED !== "true") {
    const paystackReady = Boolean(environment.PAYSTACK_SECRET_KEY);
    const stripeReady = Boolean(environment.STRIPE_SECRET_KEY && environment.STRIPE_WEBHOOK_SECRET);
    if (!paystackReady && !stripeReady) issues.push("PAYMENT_PROVIDER");
  }

  return [...new Set(issues)];
}

export function productionReadinessWarnings(environment: Environment = process.env) {
  const warnings: string[] = [];
  if (Boolean(environment.RECAPTCHA_SITE_KEY) !== Boolean(environment.RECAPTCHA_SECRET_KEY)) warnings.push("RECAPTCHA_KEY_PAIR");
  if (!environment.RECAPTCHA_SITE_KEY && !environment.RECAPTCHA_SECRET_KEY) warnings.push("RECAPTCHA_DISABLED");
  if (Boolean(environment.AUTH_GOOGLE_ID) !== Boolean(environment.AUTH_GOOGLE_SECRET)) warnings.push("GOOGLE_OAUTH_KEY_PAIR");
  return warnings;
}

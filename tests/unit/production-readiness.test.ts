import { describe, expect, it } from "vitest";
import { productionReadinessIssues, productionReadinessWarnings } from "@/lib/production-readiness";

const ready = {
  INTEGRATION_MODE: "live",
  AUTH_SECRET: "a-production-auth-secret-with-32-characters",
  ADMIN_TRIGGER_SECRET: "a-separate-production-admin-secret",
  NEXTAUTH_URL: "https://ailiteracy.ng",
  RESEND_API_KEY: "re_live_configured",
  EMAIL_FROM: "Hyrax AI Academy <noreply@updates.hyrax.ng>",
  ALLOW_MOCK_CHECKOUT: "false",
  SHOW_DEMO_CREDENTIALS: "false",
  ADMIN_PREVIEW_ENABLED: "false",
  PAYSTACK_SECRET_KEY: "sk_live_configured",
  PAYSTACK_SMALL_BUSINESS_PRODUCT_CODE: "PROD_SMALL",
  PAYSTACK_PROFESSIONALS_PRODUCT_CODE: "PROD_PRO",
};

describe("production readiness", () => {
  it("accepts the configured two-track payment setup", () => {
    expect(productionReadinessIssues(ready)).toEqual([]);
  });

  it("requires Paystack and both product codes", () => {
    expect(productionReadinessIssues({ ...ready, PAYSTACK_SECRET_KEY: "" })).toContain("PAYMENT_PROVIDER");
    expect(productionReadinessIssues({ ...ready, PAYSTACK_SMALL_BUSINESS_PRODUCT_CODE: "" })).toContain("PAYSTACK_SMALL_BUSINESS_PRODUCT_CODE");
    expect(productionReadinessIssues({ ...ready, PAYSTACK_PROFESSIONALS_PRODUCT_CODE: "" })).toContain("PAYSTACK_PROFESSIONALS_PRODUCT_CODE");
  });

  it("rejects mock and placeholder production settings", () => {
    const issues = productionReadinessIssues({
      ...ready,
      INTEGRATION_MODE: "mock",
      AUTH_SECRET: "local-development-auth-secret-change-in-production",
      ALLOW_MOCK_CHECKOUT: "true",
      SHOW_DEMO_CREDENTIALS: "true",
    });
    expect(issues).toEqual(expect.arrayContaining(["INTEGRATION_MODE", "AUTH_SECRET", "ALLOW_MOCK_CHECKOUT", "SHOW_DEMO_CREDENTIALS"]));
  });

  it("reports disabled or incomplete optional protection", () => {
    expect(productionReadinessWarnings(ready)).toContain("RECAPTCHA_DISABLED");
    expect(productionReadinessWarnings({ ...ready, RECAPTCHA_SITE_KEY: "site" })).toContain("RECAPTCHA_KEY_PAIR");
  });
});

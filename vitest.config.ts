import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  test: {
    environment: "node",
    globals: true,
    include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"],
    coverage: { reporter: ["text", "html"] },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});

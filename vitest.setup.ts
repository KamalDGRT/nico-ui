import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Tests import describe/it/expect explicitly (no vitest globals), so
// testing-library cannot hook its own cleanup in.
afterEach(() => {
  cleanup();
});

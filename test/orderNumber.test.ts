import { describe, it, expect } from "vitest";
import { dayKey, formatOrderNumber } from "@/lib/orderNumber";

describe("orderNumber", () => {
  it("formats PM-YYYYMMDD-NNNN with zero-padded sequence", () => {
    expect(formatOrderNumber("20260720", 1)).toBe("PM-20260720-0001");
    expect(formatOrderNumber("20260720", 42)).toBe("PM-20260720-0042");
    expect(formatOrderNumber("20260720", 1234)).toBe("PM-20260720-1234");
  });

  it("produces an 8-digit IST day key", () => {
    const key = dayKey(new Date("2026-07-20T00:00:00.000Z"));
    expect(key).toMatch(/^\d{8}$/);
    // 00:00 UTC + 5:30 IST is still the 20th.
    expect(key).toBe("20260720");
  });

  it("rolls to the next day late in UTC evening (IST is ahead)", () => {
    // 19:00 UTC on the 20th is 00:30 IST on the 21st.
    expect(dayKey(new Date("2026-07-20T19:00:00.000Z"))).toBe("20260721");
  });
});

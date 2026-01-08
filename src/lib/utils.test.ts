import { describe, expect, it } from "vitest";
import {
  cn,
  formatNumberWithCommas,
  formatPhoneNumber,
  parseFormattedNumber,
} from "./utils";

describe("Utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("p-4", "bg-red-500")).toBe("p-4 bg-red-500");
    });

    it("should handle conditional classes", () => {
      expect(cn("p-4", true && "bg-red-500", false && "hidden")).toBe(
        "p-4 bg-red-500"
      );
    });

    it("should resolve tailwind conflicts", () => {
      // p-4 is padding: 1rem, p-2 is padding: 0.5rem. tailwind-merge keeps the last one.
      expect(cn("p-4", "p-2")).toBe("p-2");
    });
  });

  describe("formatPhoneNumber", () => {
    it("should format simple numbers", () => {
      expect(formatPhoneNumber("010")).toBe("010");
      expect(formatPhoneNumber("0101234")).toBe("010-1234");
      expect(formatPhoneNumber("01012345678")).toBe("010-1234-5678");
    });

    it("should ignore non-digit characters", () => {
      expect(formatPhoneNumber("010-1234-5678")).toBe("010-1234-5678");
      expect(formatPhoneNumber("010.1234.5678")).toBe("010-1234-5678");
    });
  });

  describe("formatNumberWithCommas", () => {
    it("should add commas to numbers", () => {
      expect(formatNumberWithCommas(1000)).toBe("1,000");
      expect(formatNumberWithCommas(1234567)).toBe("1,234,567");
    });

    it("should handle string inputs", () => {
      expect(formatNumberWithCommas("1000")).toBe("1,000");
    });

    it("should return empty string for invalid inputs", () => {
      expect(formatNumberWithCommas("abc")).toBe("");
    });
  });
});

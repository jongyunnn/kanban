import { describe, expect, it } from "vitest";
import { cardFormSchema, columnTitleSchema } from "./schemas";

describe("Validation Schemas", () => {
  describe("cardFormSchema", () => {
    it("should validate valid inputs", () => {
      const validData = {
        title: "Valid Title",
        description: "Valid Description",
        dueDate: "2025-12-31",
      };
      expect(cardFormSchema.safeParse(validData).success).toBe(true);
    });

    it("should fail when title is empty", () => {
      const invalidData = {
        title: "",
        description: "Valid Description",
        dueDate: null,
      };
      const result = cardFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("카드 제목은 필수입니다.");
      }
    });

    it("should fail when title is too long", () => {
      const invalidData = {
        title: "a".repeat(101),
        description: "",
        dueDate: null,
      };
      const result = cardFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "카드 제목은 100자 이내로 입력해주세요."
        );
      }
    });
  });

  describe("columnTitleSchema", () => {
    it("should validate valid column title", () => {
      expect(columnTitleSchema.safeParse({ title: "To Do" }).success).toBe(
        true
      );
    });

    it("should fail when column title is too long", () => {
      expect(
        columnTitleSchema.safeParse({ title: "a".repeat(51) }).success
      ).toBe(false);
    });
  });
});

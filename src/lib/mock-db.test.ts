import { beforeEach, describe, expect, it } from "vitest";
import { db, generateId } from "./mock-db";

describe("MockDB", () => {
  // 테스트 전 DB 초기화 (싱글톤이므로 상태가 유지될 수 있음)
  beforeEach(() => {
    // 실제 구현에서는 DB를 초기화하는 메서드가 필요할 수 있음
    // 여기서는 간단히 메서드 동작만 검증
  });

  it("should generate unique IDs with prefix", () => {
    const id1 = generateId("test");
    const id2 = generateId("test");

    expect(id1).toMatch(/^test_/);
    expect(id2).toMatch(/^test_/);
    expect(id1).not.toBe(id2);
  });

  it("should create a column correctly", () => {
    const initialCount = db.getAllColumns().length;
    const newColumn = db.createColumn("New Column");

    expect(newColumn.title).toBe("New Column");
    expect(db.getAllColumns()).toHaveLength(initialCount + 1);

    // Clean up
    db.deleteColumn(newColumn.id);
  });

  it("should create a card in a column", () => {
    const columns = db.getAllColumns();
    const targetColumn = columns[0];

    const newCard = db.createCard(
      targetColumn.id,
      "Test Card",
      "Description",
      null
    );

    expect(newCard).not.toBeNull();
    if (newCard) {
      expect(newCard.title).toBe("Test Card");
      expect(newCard.columnId).toBe(targetColumn.id);

      // Verify it's in the column
      const cards = db.getCardsByColumnId(targetColumn.id);
      expect(cards.some((c) => c.id === newCard.id)).toBe(true);

      // Clean up
      db.deleteCard(newCard.id);
    }
  });
});

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

  it("should update a card correctly", () => {
    const columns = db.getAllColumns();
    const newCard = db.createCard(columns[0].id, "Original", "", null);

    expect(newCard).not.toBeNull();
    if (newCard) {
      const updated = db.updateCard(newCard.id, {
        title: "Updated Title",
        description: "Updated Description",
        dueDate: "2025-12-31",
      });

      expect(updated).not.toBeNull();
      expect(updated?.title).toBe("Updated Title");
      expect(updated?.description).toBe("Updated Description");
      expect(updated?.dueDate).toBe("2025-12-31");

      // Clean up
      db.deleteCard(newCard.id);
    }
  });

  it("should update a column correctly", () => {
    const newColumn = db.createColumn("Original Title");

    const updated = db.updateColumn(newColumn.id, "Updated Title");

    expect(updated).not.toBeNull();
    expect(updated?.title).toBe("Updated Title");

    // Clean up
    db.deleteColumn(newColumn.id);
  });

  it("should delete column and its cards", () => {
    const newColumn = db.createColumn("Column To Delete");
    const card1 = db.createCard(newColumn.id, "Card 1", "", null);
    const card2 = db.createCard(newColumn.id, "Card 2", "", null);

    expect(card1).not.toBeNull();
    expect(card2).not.toBeNull();

    const result = db.deleteColumn(newColumn.id);

    expect(result.success).toBe(true);
    expect(result.deletedCardsCount).toBe(2);

    // Verify column is deleted
    expect(db.getColumnById(newColumn.id)).toBeUndefined();

    // Verify cards are deleted
    if (card1) expect(db.getCardById(card1.id)).toBeUndefined();
    if (card2) expect(db.getCardById(card2.id)).toBeUndefined();
  });

  it("should move card to another column", () => {
    const columns = db.getAllColumns();
    const sourceColumn = columns[0];
    const targetColumn = columns[1];

    const newCard = db.createCard(sourceColumn.id, "Moving Card", "", null);

    expect(newCard).not.toBeNull();
    if (newCard) {
      const moved = db.moveCard(newCard.id, targetColumn.id, 0);

      expect(moved).not.toBeNull();
      expect(moved?.columnId).toBe(targetColumn.id);
      expect(moved?.order).toBe(0);

      // Verify it's in the target column
      const targetCards = db.getCardsByColumnId(targetColumn.id);
      expect(targetCards.some((c) => c.id === newCard.id)).toBe(true);

      // Clean up
      db.deleteCard(newCard.id);
    }
  });

  it("should move column to new order", () => {
    const newColumn = db.createColumn("Column To Move");
    const originalOrder = newColumn.order;

    const moved = db.moveColumn(newColumn.id, 0);

    expect(moved).not.toBeNull();
    expect(moved?.order).toBe(0);

    // Move back and clean up
    db.moveColumn(newColumn.id, originalOrder);
    db.deleteColumn(newColumn.id);
  });
});

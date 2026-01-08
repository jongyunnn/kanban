import { NextResponse } from "next/server";
import { cardToResponse, db, simulateDelay } from "@/lib/mock-db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/cards/:id - 카드 수정
export async function PATCH(request: Request, { params }: RouteParams) {
  await simulateDelay();

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, due_date } = body;

    // 카드 존재 확인
    const existingCard = db.getCardById(id);
    if (!existingCard) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "해당 카드를 찾을 수 없습니다.",
          },
        },
        { status: 404 }
      );
    }

    // title 유효성 검사 (제공된 경우)
    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return NextResponse.json(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "카드 제목은 필수입니다.",
            },
          },
          { status: 400 }
        );
      }

      if (title.length > 100) {
        return NextResponse.json(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "카드 제목은 1~100자 이내로 입력해주세요.",
            },
          },
          { status: 400 }
        );
      }
    }

    // description 유효성 검사 (제공된 경우)
    if (
      description !== undefined &&
      description !== null &&
      description.length > 1000
    ) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "카드 설명은 1000자 이내로 입력해주세요.",
          },
        },
        { status: 400 }
      );
    }

    const updates: {
      title?: string;
      description?: string;
      dueDate?: string | null;
    } = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined)
      updates.description = description?.trim() ?? "";
    if (due_date !== undefined) updates.dueDate = due_date;

    const updatedCard = db.updateCard(id, updates);

    if (!updatedCard) {
      return NextResponse.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "카드 수정에 실패했습니다.",
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: cardToResponse(updatedCard) });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "서버 오류가 발생했습니다.",
        },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/cards/:id - 카드 삭제
export async function DELETE(_request: Request, { params }: RouteParams) {
  await simulateDelay();

  try {
    const { id } = await params;
    const success = db.deleteCard(id);

    if (!success) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "해당 카드를 찾을 수 없습니다.",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: { success: true },
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "서버 오류가 발생했습니다.",
        },
      },
      { status: 500 }
    );
  }
}

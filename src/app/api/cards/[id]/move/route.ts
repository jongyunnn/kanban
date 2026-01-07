import { NextResponse } from "next/server";
import { db, simulateDelay, cardToResponse } from "@/lib/mock-db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/cards/:id/move - 카드 이동/순서 변경
export async function PATCH(request: Request, { params }: RouteParams) {
  await simulateDelay();

  try {
    const { id } = await params;
    const body = await request.json();
    const { target_column_id, new_order } = body;

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

    // target_column_id 유효성 검사
    if (!target_column_id || typeof target_column_id !== "string") {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "대상 컬럼 ID는 필수입니다.",
          },
        },
        { status: 400 }
      );
    }

    // new_order 유효성 검사
    if (typeof new_order !== "number" || new_order < 0) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "새로운 순서는 0 이상의 숫자여야 합니다.",
          },
        },
        { status: 400 }
      );
    }

    // 대상 컬럼 존재 확인
    const targetColumn = db.getColumnById(target_column_id);
    if (!targetColumn) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "대상 컬럼을 찾을 수 없습니다.",
          },
        },
        { status: 404 }
      );
    }

    const movedCard = db.moveCard(id, target_column_id, new_order);

    if (!movedCard) {
      return NextResponse.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "카드 이동에 실패했습니다.",
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: cardToResponse(movedCard) });
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

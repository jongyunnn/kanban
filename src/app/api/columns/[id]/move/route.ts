import { NextResponse } from "next/server";
import { db, simulateDelay } from "@/lib/mock-db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/columns/:id/move - 컬럼 순서 변경
export async function PATCH(request: Request, { params }: RouteParams) {
  await simulateDelay();

  try {
    const { id } = await params;
    const body = await request.json();
    const { new_order } = body;

    // 유효성 검사
    if (typeof new_order !== "number" || new_order < 0) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "유효한 순서 값이 필요합니다.",
          },
        },
        { status: 400 }
      );
    }

    const movedColumn = db.moveColumn(id, new_order);

    if (!movedColumn) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "해당 컬럼을 찾을 수 없습니다.",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        id: movedColumn.id,
        title: movedColumn.title,
        order: movedColumn.order,
        created_at: movedColumn.createdAt,
      },
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

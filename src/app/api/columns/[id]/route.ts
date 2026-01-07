import { NextResponse } from "next/server";
import { db, simulateDelay } from "@/lib/mock-db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/columns/:id - 컬럼 수정
export async function PATCH(request: Request, { params }: RouteParams) {
  await simulateDelay();

  try {
    const { id } = await params;
    const body = await request.json();
    const { title } = body;

    // 유효성 검사
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "컬럼 제목은 필수입니다.",
          },
        },
        { status: 400 }
      );
    }

    if (title.length > 50) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "컬럼 제목은 50자 이내로 입력해주세요.",
          },
        },
        { status: 400 }
      );
    }

    const updatedColumn = db.updateColumn(id, title.trim());

    if (!updatedColumn) {
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
        id: updatedColumn.id,
        title: updatedColumn.title,
        order: updatedColumn.order,
        created_at: updatedColumn.createdAt,
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

// DELETE /api/columns/:id - 컬럼 삭제
export async function DELETE(_request: Request, { params }: RouteParams) {
  await simulateDelay();

  try {
    const { id } = await params;
    const result = db.deleteColumn(id);

    if (!result.success) {
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
        success: true,
        deleted_cards_count: result.deletedCardsCount,
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

import { NextResponse } from "next/server";
import { columnToResponse, db, simulateDelay } from "@/lib/mock-db";

// GET /api/columns - 컬럼 전체 조회 (카드 포함)
export async function GET() {
  await simulateDelay();

  const columns = db.getAllColumns();
  const response = columns.map((column) => columnToResponse(column, db.cards));

  return NextResponse.json({ data: response });
}

// POST /api/columns - 컬럼 생성
export async function POST(request: Request) {
  await simulateDelay();

  try {
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

    const newColumn = db.createColumn(title.trim());

    return NextResponse.json(
      {
        data: {
          id: newColumn.id,
          title: newColumn.title,
          order: newColumn.order,
          created_at: newColumn.createdAt,
        },
      },
      { status: 201 }
    );
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

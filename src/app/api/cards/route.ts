import { NextResponse } from "next/server";
import { cardToResponse, db, simulateDelay } from "@/lib/mock-db";

// POST /api/cards - 카드 생성
export async function POST(request: Request) {
  await simulateDelay();

  try {
    const body = await request.json();
    const { column_id, title, description = "", due_date = null } = body;

    // column_id 유효성 검사
    if (!column_id || typeof column_id !== "string") {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "컬럼 ID는 필수입니다.",
          },
        },
        { status: 400 }
      );
    }

    // title 유효성 검사
    if (!title || typeof title !== "string" || title.trim().length === 0) {
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

    // description 유효성 검사
    if (description && description.length > 1000) {
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

    // 컬럼 존재 확인
    const column = db.getColumnById(column_id);
    if (!column) {
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

    const newCard = db.createCard(
      column_id,
      title.trim(),
      description?.trim() || "",
      due_date
    );

    if (!newCard) {
      return NextResponse.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "카드 생성에 실패했습니다.",
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: cardToResponse(newCard) },
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

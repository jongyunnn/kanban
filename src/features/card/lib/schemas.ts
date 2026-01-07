import { z } from "zod";

// 카드 생성/수정 스키마
export const cardFormSchema = z.object({
  title: z
    .string()
    .min(1, "카드 제목은 필수입니다.")
    .max(100, "카드 제목은 100자 이내로 입력해주세요."),
  description: z
    .string()
    .max(1000, "카드 설명은 1000자 이내로 입력해주세요."),
  dueDate: z.string().nullable(),
});

export type CardFormValues = z.infer<typeof cardFormSchema>;

// 컬럼 제목 스키마
export const columnTitleSchema = z.object({
  title: z
    .string()
    .min(1, "컬럼 제목은 필수입니다.")
    .max(50, "컬럼 제목은 50자 이내로 입력해주세요."),
});

export type ColumnTitleValues = z.infer<typeof columnTitleSchema>;

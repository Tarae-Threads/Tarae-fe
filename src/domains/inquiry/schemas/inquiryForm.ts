import { z } from "zod";

export const inquiryCreateSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요")
    .max(255, "제목은 255자 이하로 입력해주세요"),
  body: z.string().min(1, "내용을 입력해주세요"),
  email: z
    .email("올바른 이메일을 입력해주세요")
    .max(100, "이메일은 100자 이하로 입력해주세요"),
});

export type InquiryCreateFormData = z.infer<typeof inquiryCreateSchema>;

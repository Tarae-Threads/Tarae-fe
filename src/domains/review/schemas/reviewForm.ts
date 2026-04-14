import { z } from "zod";

export const reviewCreateSchema = z.object({
  nickname: z
    .string()
    .min(1, "닉네임을 입력해주세요")
    .max(50, "닉네임은 50자 이하로 입력해주세요"),
  email: z.email("올바른 이메일을 입력해주세요"),
  password: z
    .string()
    .min(4, "비밀번호는 4자 이상")
    .max(20, "비밀번호는 20자 이하")
    .regex(/^[a-zA-Z0-9!@#$%^&*()_+\-=]+$/, "영숫자/특수문자만 사용 가능"),
  content: z
    .string()
    .min(1, "리뷰 내용을 입력해주세요")
    .max(500, "500자 이하로 입력해주세요"),
});

export type ReviewCreateFormData = z.infer<typeof reviewCreateSchema>;

export const reviewDeleteSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export type ReviewDeleteFormData = z.infer<typeof reviewDeleteSchema>;

import * as yup from "yup";

// 참가 신청 폼 검증 스키마
export const applySchema = yup.object({
  name: yup
    .string()
    .required("이름을 입력해주세요")
    .max(50, "이름은 50자 이내로 입력해주세요"),
  nickname: yup
    .string()
    .required("닉네임을 입력해주세요")
    .max(100, "닉네임은 100자 이내로 입력해주세요"),
  password: yup
    .string()
    .required("비밀번호를 입력해주세요")
    .matches(/^\d{4}$/, "비밀번호는 4자리 숫자여야 합니다"),
  race: yup
    .string()
    .required("종족을 선택해주세요")
    .oneOf(["프로토스", "테란", "저그"], "올바른 종족을 선택해주세요"),
});

// 로그인 폼 검증 스키마
export const loginSchema = yup.object({
  nickname: yup.string().required("닉네임을 입력해주세요"),
  password: yup.string().required("비밀번호를 입력해주세요"),
});

// 맵 생성 폼 검증 스키마
export const createMapSchema = yup.object({
  name: yup
    .string()
    .required("맵 이름을 입력해주세요")
    .max(100, "맵 이름은 100자 이내로 입력해주세요"),
});

export type ApplyFormData = yup.InferType<typeof applySchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type CreateMapFormData = yup.InferType<typeof createMapSchema>;

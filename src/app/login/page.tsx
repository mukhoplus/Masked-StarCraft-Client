"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/api/auth";
import { LoginRequest } from "@/types";

const schema = yup.object({
  nickname: yup.string().required("닉네임을 입력해주세요"),
  password: yup.string().required("비밀번호를 입력해주세요"),
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginRequest) => {
    setIsSubmitting(true);
    try {
      const response = await authApi.login(data);
      if (response.data) {
        login(response.data.token, response.data.nickname, response.data.role);
        toast.success("로그인 되었습니다!");
        router.push("/tournament");
      }
    } catch (error: unknown) {
      let errorMessage = "로그인에 실패했습니다.";
      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as { response?: { data?: { message?: string } } }
        ).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-black mb-8">
          🔐 로그인
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 닉네임 입력 */}
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-black mb-2"
            >
              닉네임
            </label>
            <input
              {...register("nickname")}
              type="text"
              id="nickname"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black placeholder-gray-500"
              placeholder="참가 신청시 사용한 닉네임"
            />
            {errors.nickname && (
              <p className="mt-2 text-sm text-red-600">
                {errors.nickname.message}
              </p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-2"
            >
              비밀번호
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black placeholder-gray-500"
              placeholder="비밀번호를 입력해주세요"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? "로그인 중..." : "🚀 로그인"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-black">
            아직 참가 신청을 하지 않으셨나요?{" "}
            <button
              onClick={() => router.push("/apply")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              참가 신청하기
            </button>
          </p>
          <p className="text-sm text-black">
            <button
              onClick={() => router.push("/tournament")}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              대회 현황 보기
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { registerPlayer } from "@/api/players";
import { tournamentsApi } from "@/api/tournaments";
import { PlayerRegistration } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";

const schema = yup.object({
  name: yup.string().required("이름을 입력해주세요"),
  nickname: yup.string().required("닉네임을 입력해주세요"),
  race: yup
    .string()
    .oneOf(["PROTOSS", "TERRAN", "ZERG"], "종족을 선택해주세요")
    .required("종족을 선택해주세요"),
  password: yup
    .string()
    .required("비밀번호를 입력해주세요")
    .matches(/^\d{4}$/, "비밀번호는 숫자 4자리여야 합니다"),
});

export default function ApplyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 대회 상태 확인
  const { data: tournament, isLoading: tournamentLoading } = useQuery({
    queryKey: ["tournament"],
    queryFn: () => tournamentsApi.getCurrentTournament(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlayerRegistration>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: PlayerRegistration) => {
    setIsSubmitting(true);
    try {
      await registerPlayer(data);
      toast.success("참가 신청이 완료되었습니다!");
      router.push("/tournament");
    } catch (error: unknown) {
      let errorMessage = "참가 신청에 실패했습니다.";
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

  if (tournamentLoading) {
    return <LoadingSpinner />;
  }

  const tournamentData = tournament?.data;
  const isTournamentInProgress = tournamentData?.status === "IN_PROGRESS";

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-black mb-8">
          📝 참가 신청
        </h1>

        {isTournamentInProgress ? (
          <div className="text-center space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-800 mb-2">
                🚫 참가 신청 불가
              </h2>
              <p className="text-red-600">
                현재 대회가 진행 중 상태입니다.
                <br />
                대회 진행 중에는 새로운 참가자 신청을 받지 않습니다.
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              홈으로 돌아가기
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 이름 입력 */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-black mb-2"
                >
                  이름
                </label>
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black placeholder-gray-500"
                  placeholder="실명을 입력해주세요"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                  placeholder="게임 내 사용할 닉네임"
                />
                {errors.nickname && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.nickname.message}
                  </p>
                )}
              </div>

              {/* 종족 선택 */}
              <div>
                <label
                  htmlFor="race"
                  className="block text-sm font-medium text-black mb-2"
                >
                  종족
                </label>
                <select
                  {...register("race")}
                  id="race"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                >
                  <option value="">종족을 선택해주세요</option>
                  <option value="PROTOSS">⚡ 프로토스 (Protoss)</option>
                  <option value="TERRAN">🔧 테란 (Terran)</option>
                  <option value="ZERG">🦂 저그 (Zerg)</option>
                </select>
                {errors.race && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.race.message}
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
                  maxLength={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black placeholder-gray-500"
                  placeholder="숫자 4자리를 입력해주세요"
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
                {isSubmitting ? "신청 중..." : "🏆 참가 신청하기"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-black">
                이미 참가 신청을 하셨나요?{" "}
                <button
                  onClick={() => router.push("/tournament")}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  대회 현황 보기
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { mapsApi } from "@/api/maps";
import { Map, CreateMapRequest } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";

const schema = yup.object({
  name: yup.string().required("맵 이름을 입력해주세요"),
});

export default function MapsPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMapRequest>({
    resolver: yupResolver(schema),
  });

  // 맵 목록 조회
  const { data: maps, isLoading } = useQuery({
    queryKey: ["maps"],
    queryFn: () => mapsApi.getMaps(),
  });

  // 맵 추가
  const addMapMutation = useMutation({
    mutationFn: (data: CreateMapRequest) => mapsApi.createMap(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maps"] });
      toast.success("맵이 추가되었습니다.");
      reset();
      setShowAddForm(false);
    },
    onError: (error: unknown) => {
      let errorMessage = "맵 추가에 실패했습니다.";
      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as { response?: { data?: { message?: string } } }
        ).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }
      toast.error(errorMessage);
    },
  });

  // 맵 삭제
  const deleteMapMutation = useMutation({
    mutationFn: (mapId: number) => mapsApi.deleteMap(mapId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maps"] });
      toast.success("맵이 삭제되었습니다.");
    },
    onError: (error: unknown) => {
      let errorMessage = "맵 삭제에 실패했습니다.";
      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as { response?: { data?: { message?: string } } }
        ).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }
      toast.error(errorMessage);
    },
  });

  const handleDeleteMap = (map: Map) => {
    if (confirm(`"${map.name}" 맵을 삭제하시겠습니까?`)) {
      deleteMapMutation.mutate(map.id);
    }
  };

  const onSubmit = (data: CreateMapRequest) => {
    addMapMutation.mutate(data);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-black mb-4">
            접근 권한이 없습니다
          </h1>
          <p className="text-black mb-6">
            맵 관리는 관리자만 접근할 수 있습니다.
          </p>
          <button
            onClick={() => (window.location.href = "/tournament")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            대회 현황으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const mapsData = maps?.data || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <h1 className="text-4xl font-bold text-black mb-4">🗺️ 맵 관리</h1>
        <p className="text-lg text-black">총 {mapsData.length}개의 맵</p>
      </div>

      {/* 맵 추가 섹션 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-black">➕ 맵 추가</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            {showAddForm ? "취소" : "새 맵 추가"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-black mb-2"
              >
                맵 이름
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black placeholder-gray-500"
                placeholder="예: 아웃복서"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={addMapMutation.isPending}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              {addMapMutation.isPending ? "추가 중..." : "맵 추가"}
            </button>
          </form>
        )}
      </div>

      {/* 맵 목록 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-black">📋 맵 목록</h2>

        {mapsData.length > 0 ? (
          <div className="grid gap-4">
            {mapsData.map((map) => (
              <div
                key={map.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🗺️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black">{map.name}</h3>
                    <p className="text-sm text-gray-600">ID: {map.id}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteMap(map)}
                  disabled={deleteMapMutation.isPending}
                  className="text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  🗑️ 삭제
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚫</div>
            <h3 className="text-xl font-bold text-black mb-2">
              등록된 맵이 없습니다
            </h3>
            <p className="text-black mb-6">
              대회를 시작하기 전에 먼저 맵을 추가해주세요.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              첫 번째 맵 추가하기
            </button>
          </div>
        )}
      </div>

      {/* 도움말 */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-black mb-3">💡 도움말</h3>
        <ul className="space-y-2 text-black">
          <li>• 대회 시작 전에 최소 1개 이상의 맵을 추가해주세요.</li>
          <li>• 경기마다 무작위로 맵이 선택됩니다.</li>
          <li>
            • 맵 삭제는 현재 진행 중인 대회에 영향을 줄 수 있으니 주의하세요.
          </li>
          <li>• 스타크래프트 브루드워 공식 맵을 권장합니다.</li>
        </ul>
      </div>
    </div>
  );
}

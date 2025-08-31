import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mapsApi } from "@/api";
import toast from "react-hot-toast";
import type { CreateMapRequest } from "@/types";

// 맵 목록 조회 훅 (관리자 전용)
export const useMaps = () => {
  return useQuery({
    queryKey: ["maps"],
    queryFn: () => mapsApi.getMaps(),
  });
};

// 맵 생성 훅 (관리자 전용)
export const useCreateMap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMapRequest) => mapsApi.createMap(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["maps"] });
      toast.success(response.message || "맵이 추가되었습니다.");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message || "맵 추가에 실패했습니다.";
      toast.error(message);
    },
  });
};

// 맵 삭제 훅 (관리자 전용)
export const useDeleteMap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mapId: number) => mapsApi.deleteMap(mapId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["maps"] });
      toast.success(response.message || "맵이 삭제되었습니다.");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message || "맵 삭제에 실패했습니다.";
      toast.error(message);
    },
  });
};

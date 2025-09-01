import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tournamentsApi } from "@/api";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { useEffect } from "react";
import toast from "react-hot-toast";
import type { GameResultRequest } from "@/types";

// 현재 대회 정보 조회 훅
export const useCurrentTournament = () => {
  const queryClient = useQueryClient();
  const { registerRefreshCallback, unregisterRefreshCallback, isConnected } =
    useWebSocket();

  const query = useQuery({
    queryKey: ["currentTournament"],
    queryFn: () => tournamentsApi.getCurrentTournament(),
    refetchOnMount: true,
  });

  useEffect(() => {
    if (isConnected) {
      // 자동 새로고침 콜백 등록
      const refreshCallback = () => {
        // console.log("Refreshing tournament data...");
        queryClient.invalidateQueries({ queryKey: ["currentTournament"] });
      };

      registerRefreshCallback("tournament", refreshCallback);
    }

    return () => {
      unregisterRefreshCallback("tournament");
    };
  }, [
    isConnected,
    queryClient,
    registerRefreshCallback,
    unregisterRefreshCallback,
  ]);

  return query;
};

// 대회 시작 훅 (관리자 전용)
export const useStartTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => tournamentsApi.startTournament(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["currentTournament"] });
      toast.success(response.message || "대회가 시작되었습니다!");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message || "대회 시작에 실패했습니다.";
      toast.error(message);
    },
  });
};

// 게임 결과 기록 훅 (관리자 전용)
export const useRecordGameResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GameResultRequest) =>
      tournamentsApi.recordGameResult(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["currentTournament"] });
      toast.success(response.message || "경기 결과가 기록되었습니다!");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message || "경기 결과 기록에 실패했습니다.";
      toast.error(message);
    },
  });
};

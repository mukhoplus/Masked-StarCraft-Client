import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { playersApi } from "@/api";
import toast from "react-hot-toast";

// 참가자 목록 조회 훅
export const usePlayers = () => {
  return useQuery({
    queryKey: ["players"],
    queryFn: () => playersApi.getPlayers(),
  });
};

// 참가자 삭제 훅 (관리자 전용)
export const useDeletePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (playerId: number) => playersApi.deletePlayer(playerId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success(response.message || "참가자가 삭제되었습니다.");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message || "참가자 삭제에 실패했습니다.";
      toast.error(message);
    },
  });
};

// 모든 참가자 초기화 훅 (관리자 전용)
export const useDeleteAllPlayers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => playersApi.deleteAllPlayers(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success(response.message || "모든 참가자가 초기화되었습니다.");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message || "참가자 초기화에 실패했습니다.";
      toast.error(message);
    },
  });
};

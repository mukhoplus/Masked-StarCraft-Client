import { apiClient } from "./client";
import type { ApiResponse, Player, PlayerRegistration } from "@/types";

export const playersApi = {
  // 참가 신청
  registerPlayer: async (data: PlayerRegistration): Promise<ApiResponse> => {
    const response = await apiClient.post("/api/v1/players", data);
    return response.data;
  },

  // 참가자 목록 조회
  getPlayers: async (): Promise<ApiResponse<Player[]>> => {
    const response = await apiClient.get("/api/v1/players");
    return response.data;
  },

  // 특정 참가자 삭제 (관리자 전용)
  deletePlayer: async (playerId: number): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/api/v1/players/${playerId}`);
    return response.data;
  },

  // 모든 참가자 초기화 (관리자 전용)
  deleteAllPlayers: async (): Promise<ApiResponse> => {
    const response = await apiClient.delete("/api/v1/players");
    return response.data;
  },
};

// 개별 함수 export (backward compatibility)
export const registerPlayer = playersApi.registerPlayer;
export const getPlayers = playersApi.getPlayers;

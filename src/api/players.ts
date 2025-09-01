import { apiClient, publicApiClient } from "./client";
import type { ApiResponse, Player, PlayerRegistration } from "@/types";

export const playersApi = {
  // 참가 신청 (인증 불필요)
  registerPlayer: async (data: PlayerRegistration): Promise<ApiResponse> => {
    const response = await publicApiClient.post("/api/v1/players", data);
    return response.data;
  },

  // 참가자 목록 조회 (권한에 따라 다른 응답)
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

  // 본인 참가 취소 (로그인한 사용자)
  deleteSelf: async (): Promise<ApiResponse> => {
    const response = await apiClient.delete("/api/v1/players/me");
    return response.data;
  },
};

// 개별 함수 export (backward compatibility)
export const registerPlayer = playersApi.registerPlayer;
export const getPlayers = playersApi.getPlayers;

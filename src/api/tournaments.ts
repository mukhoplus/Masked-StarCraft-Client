import { apiClient } from "./client";
import type { ApiResponse, Tournament, GameResultRequest } from "@/types";

export const tournamentsApi = {
  // 현재 대회 정보 조회
  getCurrentTournament: async (): Promise<ApiResponse<Tournament | null>> => {
    const response = await apiClient.get("/api/v1/tournaments/current");
    return response.data;
  },

  // 대회 시작 (관리자 전용)
  startTournament: async (): Promise<ApiResponse> => {
    const response = await apiClient.post("/api/v1/tournaments/start");
    return response.data;
  },

  // 게임 결과 기록 (관리자 전용)
  recordGameResult: async (data: GameResultRequest): Promise<ApiResponse> => {
    const response = await apiClient.post("/api/v1/games/result", data);
    return response.data;
  },

  // 대회 종료 (관리자 전용)
  endTournament: async (): Promise<ApiResponse> => {
    const response = await apiClient.post("/api/v1/tournaments/end");
    return response.data;
  },
};

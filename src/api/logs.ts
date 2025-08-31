import { apiClient } from "./client";
import type { ApiResponse, TournamentLog, TournamentLogDetail } from "@/types";

export const logsApi = {
  // 완료된 대회 목록 (관리자 전용)
  getTournamentLogs: async (): Promise<ApiResponse<TournamentLog[]>> => {
    const response = await apiClient.get("/api/v1/logs/tournaments");
    return response.data;
  },

  // 특정 대회 상세 로그 (관리자 전용)
  getTournamentLogDetail: async (
    tournamentId: number
  ): Promise<ApiResponse<TournamentLogDetail>> => {
    const response = await apiClient.get(
      `/api/v1/logs/tournaments/${tournamentId}`
    );
    return response.data;
  },

  // 대회 로그 파일 다운로드 (관리자 전용)
  downloadTournamentLog: async (tournamentId: number): Promise<Blob> => {
    const response = await apiClient.get(
      `/api/v1/logs/tournaments/${tournamentId}/download`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  },
};

import { apiClient } from "./client";
import type { ApiResponse, Map, CreateMapRequest } from "@/types";

export const mapsApi = {
  // 맵 생성 (관리자 전용)
  createMap: async (data: CreateMapRequest): Promise<ApiResponse> => {
    const response = await apiClient.post("/api/v1/maps", data);
    return response.data;
  },

  // 맵 목록 조회 (관리자 전용)
  getMaps: async (): Promise<ApiResponse<Map[]>> => {
    const response = await apiClient.get("/api/v1/maps");
    return response.data;
  },

  // 맵 삭제 (관리자 전용)
  deleteMap: async (mapId: number): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/api/v1/maps/${mapId}`);
    return response.data;
  },
};

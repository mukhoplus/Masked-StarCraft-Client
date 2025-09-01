import { apiClient, publicApiClient } from "./client";
import type {
  ApiResponse,
  ApplyRequest,
  LoginRequest,
  LoginResponse,
} from "@/types";

export const authApi = {
  // 참가 신청 (공개)
  apply: async (data: ApplyRequest): Promise<ApiResponse> => {
    const response = await publicApiClient.post("/api/v1/auth/apply", data);
    return response.data;
  },

  // 로그인 (공개)
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await publicApiClient.post("/api/v1/auth/login", data);
    return response.data;
  },
};

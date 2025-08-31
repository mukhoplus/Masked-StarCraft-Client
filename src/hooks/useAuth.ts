import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { ApplyRequest, LoginRequest } from "@/types";

// 참가 신청 훅
export const useApply = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ApplyRequest) => authApi.apply(data),
    onSuccess: (response) => {
      toast.success(response.message || "참가 신청이 완료되었습니다!");
      router.push("/players");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message || "참가 신청에 실패했습니다.";
      toast.error(message);
    },
  });
};

// 로그인 훅
export const useLogin = () => {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      if (response.data) {
        login(response.data.token, response.data.nickname, response.data.role);
        toast.success("로그인되었습니다!");
        router.push("/");
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message || "로그인에 실패했습니다.";
      toast.error(message);
    },
  });
};

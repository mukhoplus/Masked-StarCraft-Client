import type { Race } from "@/types";

// 종족 이름을 한국어로 변환
export const getRaceInKorean = (race: Race): string => {
  switch (race) {
    case "PROTOSS":
      return "프로토스";
    case "TERRAN":
      return "테란";
    case "ZERG":
      return "저그";
    default:
      return race;
  }
};

// 종족별 색상 반환
export const getRaceColor = (race: Race): string => {
  switch (race) {
    case "PROTOSS":
      return "text-yellow-500 bg-yellow-50 border-yellow-200";
    case "TERRAN":
      return "text-blue-500 bg-blue-50 border-blue-200";
    case "ZERG":
      return "text-purple-500 bg-purple-50 border-purple-200";
    default:
      return "text-gray-500 bg-gray-50 border-gray-200";
  }
};

// 대회 상태를 한국어로 변환
export const getTournamentStatusInKorean = (status: string): string => {
  switch (status) {
    case "PREPARING":
      return "준비 중";
    case "IN_PROGRESS":
      return "진행 중";
    case "FINISHED":
      return "종료";
    default:
      return status;
  }
};

// 파일 다운로드 헬퍼
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// 날짜 포맷팅
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// 확인 다이얼로그
export const confirm = (message: string): boolean => {
  return window.confirm(message);
};

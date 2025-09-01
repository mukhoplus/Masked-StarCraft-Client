"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { logsApi } from "@/api/logs";
import { TournamentLog } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function LogsPage() {
  const { isAdmin } = useAuth();
  const [downloading, setDownloading] = useState<number | null>(null);

  // 관리자가 아니면 접근 불가
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">접근 권한 없음</h1>
        <p className="text-gray-600 dark:text-gray-400">
          관리자만 접근할 수 있는 페이지입니다.
        </p>
      </div>
    );
  }

  // 대회 로그 목록 조회
  const { data: logs, isLoading } = useQuery({
    queryKey: ["tournament-logs"],
    queryFn: () => logsApi.getTournamentLogs(),
  });

  // 로그 파일 다운로드
  const downloadLog = async (tournamentId: number, tournamentInfo: string) => {
    try {
      setDownloading(tournamentId);
      const blob = await logsApi.downloadTournamentLog(tournamentId);

      // 파일 다운로드
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `tournament_${tournamentId}_${new Date().getTime()}.log`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("로그 파일이 다운로드되었습니다!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("로그 다운로드에 실패했습니다.");
    } finally {
      setDownloading(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const logsData = logs?.data || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
          📋 대회 로그 관리
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          완료된 대회의 로그를 확인하고 다운로드할 수 있습니다.
        </p>
      </div>

      {logsData.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
            🏆 완료된 대회 목록 ({logsData.length}개)
          </h2>
          <div className="space-y-4">
            {logsData.map((log: TournamentLog) => (
              <div
                key={log.tournamentId}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <div className="flex flex-col">
                  <h3 className="font-bold text-black dark:text-white">
                    대회 #{log.tournamentId}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    종료일:{" "}
                    {log.endTime
                      ? new Date(log.endTime).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "날짜 정보 없음"}
                  </p>
                  {log.stats && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span>경기수: {log.stats.totalGames}경기</span>
                      <span className="ml-4">
                        참가자: {log.stats.totalParticipants}명
                      </span>
                    </div>
                  )}
                  {log.winner && (
                    <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                        우승자: {log.winner.nickname}
                        {log.winner.name && ` (${log.winner.name})`}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() =>
                    downloadLog(
                      log.tournamentId,
                      `tournament_${log.tournamentId}_${
                        log.winner?.nickname || "unknown"
                      }`
                    )
                  }
                  disabled={downloading === log.tournamentId}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  {downloading === log.tournamentId ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>다운로드 중...</span>
                    </div>
                  ) : (
                    <span>📥 다운로드</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            아직 완료된 대회가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  usePlayers,
  useDeletePlayer,
  useDeleteAllPlayers,
} from "@/hooks/usePlayers";
import { tournamentsApi } from "@/api/tournaments";
import { Player } from "@/types";
import RaceBadge from "@/components/RaceBadge";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function PlayersPage() {
  const { isAdmin, user, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 참가자 목록 조회
  const { data: players, isLoading } = usePlayers();

  // 대회 상태 확인
  const { data: tournament } = useQuery({
    queryKey: ["tournament"],
    queryFn: () => tournamentsApi.getCurrentTournament(),
  });

  // 참가자 삭제 훅
  const deletePlayerMutation = useDeletePlayer();

  // 모든 참가자 초기화 훅
  const deleteAllPlayersMutation = useDeleteAllPlayers();

  // 참가 취소 시 자동 로그아웃을 위한 별도 mutation
  const selfDeleteMutation = useMutation({
    mutationFn: () => {
      // /me 엔드포인트 사용 - playerId 불필요
      const { playersApi } = require("@/api");
      return playersApi.deleteSelf();
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("참가가 취소되었습니다. 로그아웃됩니다.");

      // 1초 후 자동 로그아웃 및 메인 페이지로 이동
      setTimeout(() => {
        logout();
        router.push("/");
      }, 1000);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message || "참가 취소에 실패했습니다.";
      toast.error(message);
    },
  });

  const handleDeletePlayer = (player: Player) => {
    if (confirm(`${player.nickname}을(를) 삭제하시겠습니까?`)) {
      deletePlayerMutation.mutate(player.id);
    }
  };

  const handleSelfDelete = (player: Player) => {
    if (confirm("참가 취소하시겠습니까?")) {
      selfDeleteMutation.mutate(); // playerId 불필요
    }
  };

  const handleDeleteAllPlayers = () => {
    if (
      confirm("모든 참가자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      deleteAllPlayersMutation.mutate();
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const playersData = players?.data || [];
  const tournamentData = tournament?.data;
  const isTournamentInProgress = tournamentData?.status === "IN_PROGRESS";

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-black mb-4">👥 참가자 목록</h1>
        <p className="text-lg text-black">총 {playersData.length}명의 참가자</p>
      </div>

      {/* 관리자 액션 */}
      {isAdmin && playersData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-red-600">
            ⚠️ 관리자 기능
          </h2>
          <div className="flex gap-4">
            <button
              onClick={handleDeleteAllPlayers}
              disabled={deleteAllPlayersMutation.isPending}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              {deleteAllPlayersMutation.isPending
                ? "삭제 중..."
                : "🗑️ 모든 참가자 삭제"}
            </button>
          </div>
        </div>
      )}

      {/* 참가자 목록 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {playersData.length > 0 ? (
          <div className="grid gap-4">
            {playersData.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-600">
                      {player.nickname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-black">
                        {player.nickname}
                      </h3>
                      {isAdmin && player.name && (
                        <span className="text-sm text-gray-500">
                          ({player.name})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <RaceBadge race={player.race} />

                  {/* 본인 참가 취소 버튼 */}
                  {user && user.nickname === player.nickname && !isAdmin && (
                    <div>
                      {isTournamentInProgress ? (
                        <span className="text-gray-400 font-medium text-sm">
                          🔒 대회 진행 중
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSelfDelete(player)}
                          disabled={selfDeleteMutation.isPending}
                          className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
                        >
                          {selfDeleteMutation.isPending
                            ? "취소 중..."
                            : "❌ 참가 취소"}
                        </button>
                      )}
                    </div>
                  )}

                  {/* 관리자 삭제 버튼 */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDeletePlayer(player)}
                      disabled={deletePlayerMutation.isPending}
                      className="text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                      🗑️ 삭제
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-black mb-2">
              아직 참가자가 없습니다
            </h3>
            <p className="text-black mb-6">첫 번째 참가자가 되어보세요!</p>
            <button
              onClick={() => (window.location.href = "/apply")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              📝 참가 신청하기
            </button>
          </div>
        )}
      </div>

      {/* 종족별 통계 */}
      {playersData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-black">📊 종족별 통계</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {(["PROTOSS", "TERRAN", "ZERG"] as const).map((race) => {
              const count = playersData.filter((p) => p.race === race).length;
              const percentage =
                playersData.length > 0
                  ? Math.round((count / playersData.length) * 100)
                  : 0;

              return (
                <div
                  key={race}
                  className="text-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className="mb-2">
                    <RaceBadge race={race} />
                  </div>
                  <div className="text-2xl font-bold text-black">{count}명</div>
                  <div className="text-sm text-gray-600">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

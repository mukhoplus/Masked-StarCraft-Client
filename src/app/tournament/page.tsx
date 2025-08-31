"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { tournamentsApi } from "@/api/tournaments";
import { playersApi } from "@/api/players";
import { PreviousGame } from "@/types";
import RaceBadge from "@/components/RaceBadge";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function TournamentPage() {
  const { isAdmin } = useAuth();
  const { isConnected } = useWebSocket();
  const queryClient = useQueryClient();

  // 대회 정보 조회
  const { data: tournament, isLoading: tournamentLoading } = useQuery({
    queryKey: ["tournament"],
    queryFn: () => tournamentsApi.getCurrentTournament(),
  });

  // 참가자 목록 조회
  const { data: players, isLoading: playersLoading } = useQuery({
    queryKey: ["players"],
    queryFn: () => playersApi.getPlayers(),
  });

  // 대회 시작/종료
  const startTournamentMutation = useMutation({
    mutationFn: tournamentsApi.startTournament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
      toast.success("대회가 시작되었습니다!");
    },
    onError: (error: unknown) => {
      let errorMessage = "대회 시작에 실패했습니다.";
      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as { response?: { data?: { message?: string } } }
        ).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }
      toast.error(errorMessage);
    },
  });

  const endTournamentMutation = useMutation({
    mutationFn: tournamentsApi.endTournament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
      toast.success("대회가 종료되었습니다!");
    },
    onError: (error: unknown) => {
      let errorMessage = "대회 종료에 실패했습니다.";
      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as { response?: { data?: { message?: string } } }
        ).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }
      toast.error(errorMessage);
    },
  });

  // 경기 결과 입력
  const gameResultMutation = useMutation({
    mutationFn: (winnerId: number) =>
      tournamentsApi.recordGameResult({ winnerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
      toast.success("경기 결과가 입력되었습니다!");
    },
    onError: (error: unknown) => {
      let errorMessage = "경기 결과 입력에 실패했습니다.";
      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as { response?: { data?: { message?: string } } }
        ).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }
      toast.error(errorMessage);
    },
  });

  if (tournamentLoading || playersLoading) {
    return <LoadingSpinner />;
  }

  const tournamentData = tournament?.data;
  const playersData = players?.data || [];

  const renderTournamentStatus = () => {
    switch (tournamentData?.status) {
      case "PREPARING":
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              🔄 대회 준비 중
            </h2>
            <p className="text-blue-600 mb-4">참가자: {playersData.length}명</p>
            {isAdmin && playersData.length >= 2 && (
              <button
                onClick={() => startTournamentMutation.mutate()}
                disabled={startTournamentMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                {startTournamentMutation.isPending
                  ? "시작 중..."
                  : "🚀 대회 시작"}
              </button>
            )}
            {playersData.length < 2 && (
              <p className="text-black">최소 2명 이상의 참가자가 필요합니다.</p>
            )}
          </div>
        );

      case "IN_PROGRESS":
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                🎮 대회 진행 중
              </h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? "실시간 연결됨" : "연결 끊어짐"}
                </span>
              </div>
            </div>

            {/* 현재 경기 */}
            {tournamentData?.currentGame && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-center mb-6">
                  🏟️ 현재 경기 (라운드 {tournamentData.currentGame.round})
                </h3>
                <div className="grid md:grid-cols-3 gap-4 items-center">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">
                      {tournamentData.currentGame.player1.nickname}
                    </h4>
                    <RaceBadge race={tournamentData.currentGame.player1.race} />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">VS</div>
                    <div className="text-sm text-gray-500 mt-2">
                      맵: {tournamentData.currentGame.map.name}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">
                      {tournamentData.currentGame.player2.nickname}
                    </h4>
                    <RaceBadge race={tournamentData.currentGame.player2.race} />
                  </div>
                </div>

                {/* 경기 결과 입력 (관리자 전용) */}
                {isAdmin && (
                  <div className="mt-6 border-t pt-6">
                    <h4 className="font-bold mb-4 text-center">
                      경기 결과 입력
                    </h4>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() =>
                          tournamentData.currentGame &&
                          gameResultMutation.mutate(
                            tournamentData.currentGame.player1.id
                          )
                        }
                        disabled={
                          gameResultMutation.isPending ||
                          !tournamentData.currentGame
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                      >
                        {tournamentData.currentGame?.player1.nickname} 승리
                      </button>
                      <button
                        onClick={() =>
                          tournamentData.currentGame &&
                          gameResultMutation.mutate(
                            tournamentData.currentGame.player2.id
                          )
                        }
                        disabled={
                          gameResultMutation.isPending ||
                          !tournamentData.currentGame
                        }
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                      >
                        {tournamentData.currentGame?.player2.nickname} 승리
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 이전 경기 결과 */}
            {tournamentData?.previousGames &&
              tournamentData.previousGames.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4">📊 경기 기록</h3>
                  <div className="space-y-3">
                    {tournamentData.previousGames
                      .slice(-10)
                      .reverse()
                      .map((game: PreviousGame, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                              라운드 {game.round}
                            </span>
                            <span className="font-bold text-green-600">
                              {game.winner.nickname}
                            </span>
                            <span className="text-gray-400">vs</span>
                            <span className="text-red-600">
                              {game.loser.nickname}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              맵: {game.map.name}
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                              {game.streak}연승
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {/* 관리자 종료 버튼 */}
            {isAdmin && (
              <div className="text-center">
                <button
                  onClick={() => endTournamentMutation.mutate()}
                  disabled={endTournamentMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  {endTournamentMutation.isPending
                    ? "종료 중..."
                    : "🏁 대회 종료"}
                </button>
              </div>
            )}
          </div>
        );

      case "FINISHED":
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">
              🏆 대회 종료
            </h2>
            {tournamentData?.result && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    최종 우승자
                  </h3>
                  <p className="text-xl font-bold text-yellow-600">
                    {tournamentData.result.winner.nickname}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    최다 연승자
                  </h3>
                  <p className="text-xl font-bold text-blue-600">
                    {tournamentData.result.maxStreakPlayer.nickname}
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">🏟️ 대회 현황</h1>
      </div>

      {/* 대회 상태 */}
      {renderTournamentStatus()}

      {/* 참가자 목록 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          👥 참가자 목록 ({playersData.length}명)
        </h2>
        {playersData.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playersData.map((player) => (
              <div
                key={player.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{player.nickname}</span>
                  <RaceBadge race={player.race} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-black text-center py-8">아직 참가자가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

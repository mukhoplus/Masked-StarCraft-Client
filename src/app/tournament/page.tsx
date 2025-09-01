"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { useCurrentTournament } from "@/hooks/useTournaments";
import { usePlayers } from "@/hooks/usePlayers";
import { tournamentsApi } from "@/api/tournaments";
import { PreviousGame } from "@/types";
import RaceBadge from "@/components/RaceBadge";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function TournamentPage() {
  const { isAdmin, user } = useAuth();
  const { isConnected } = useWebSocket();
  const queryClient = useQueryClient();
  const [showGameHistory, setShowGameHistory] = useState(false);

  // 디버깅을 위한 콘솔 로그
  // console.log("Tournament Page - isAdmin:", isAdmin);
  // console.log("Tournament Page - user:", user);

  // 대회 정보 조회 (자동 새로고침 포함)
  const { data: tournament, isLoading: tournamentLoading } =
    useCurrentTournament();

  // 참가자 목록 조회 (자동 새로고침 포함)
  const { data: players, isLoading: playersLoading } = usePlayers();
  // console.log("Tournament Data:", tournament);
  // console.log("Players Data:", players);

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
    // console.log(
    //   "renderTournamentStatus - tournamentData?.status:",
    //   tournamentData?.status
    // );
    // console.log("renderTournamentStatus - isAdmin:", isAdmin);
    // console.log(
    //   "renderTournamentStatus - playersData.length:",
    //   playersData.length
    // );
    // console.log("renderTournamentStatus - tournamentData:", tournamentData);

    // // 안전성 체크
    // if (!tournamentData) {
    //   console.log("tournamentData is null/undefined");
    // }

    // if (tournamentData?.previousGames) {
    //   console.log("previousGames exists:", tournamentData.previousGames.length);
    // } else {
    //   console.log("previousGames is null/undefined");
    // }

    // 대회가 없는 경우
    if (!tournamentData) {
      return (
        <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300 mb-4">
            📋 대회 준비
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            현재 진행 중인 대회가 없습니다.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            참가자: {playersData.length}명
          </p>
          {isAdmin && playersData.length >= 2 && (
            <button
              onClick={() => startTournamentMutation.mutate()}
              disabled={startTournamentMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              {startTournamentMutation.isPending
                ? "생성 중..."
                : "🏆 새 대회 시작"}
            </button>
          )}
          {playersData.length < 2 && (
            <p className="text-black dark:text-white">
              최소 2명 이상의 참가자가 필요합니다.
            </p>
          )}
        </div>
      );
    }

    switch (tournamentData?.status) {
      case "PREPARING":
        return (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6 text-center">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">
              🔄 대회 준비 중
            </h2>
            <p className="text-blue-600 dark:text-blue-400 mb-4">
              참가자: {playersData.length}명
            </p>
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
              <p className="text-black dark:text-white">
                최소 2명 이상의 참가자가 필요합니다.
              </p>
            )}
          </div>
        );

      case "IN_PROGRESS":
        return (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6 text-center">
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
                🎮 대회 진행 중
              </h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isConnected ? "실시간 연결됨" : "연결 끊어짐"}
                </span>
              </div>
            </div>

            {/* 현재 경기 */}
            {tournamentData?.currentGame && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
                  🏟️ 현재 경기 (라운드 {tournamentData.currentGame.round})
                </h3>
                <div className="grid md:grid-cols-3 gap-4 items-center">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-lg mb-1 text-black dark:text-white">
                        {tournamentData.currentGame.player1.nickname}
                      </h4>
                      {isAdmin && tournamentData.currentGame.player1.name && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          ({tournamentData.currentGame.player1.name})
                        </span>
                      )}
                    </div>
                    <RaceBadge race={tournamentData.currentGame.player1.race} />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                      VS
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      맵: {tournamentData.currentGame.map.name}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-lg mb-1 text-black dark:text-white">
                        {tournamentData.currentGame.player2.nickname}
                      </h4>
                      {isAdmin && tournamentData.currentGame.player2.name && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          ({tournamentData.currentGame.player2.name})
                        </span>
                      )}
                    </div>
                    <RaceBadge race={tournamentData.currentGame.player2.race} />
                  </div>
                </div>

                {/* 경기 결과 입력 (관리자 전용) */}
                {isAdmin && (
                  <div className="mt-6 border-t dark:border-gray-600 pt-6">
                    <h4 className="font-bold mb-4 text-center text-black dark:text-white">
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
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
                    📊 경기 기록
                  </h3>
                  <div className="space-y-3">
                    {(tournamentData.previousGames || [])
                      .slice(-10)
                      .reverse()
                      .map((game: PreviousGame, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              라운드 {game.round}
                            </span>
                            <div className="flex flex-col">
                              <span className="font-bold text-green-600 dark:text-green-400">
                                {game.winner.nickname}
                              </span>
                              {isAdmin && game.winner.name && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  ({game.winner.name})
                                </span>
                              )}
                            </div>
                            <span className="text-gray-400 dark:text-gray-500">
                              vs
                            </span>
                            <div className="flex flex-col">
                              <span className="text-red-600 dark:text-red-400">
                                {game.loser.nickname}
                              </span>
                              {game.loser.name && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  ({game.loser.name})
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              맵: {game.map.name}
                            </div>
                            <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                              {game.streak}연승
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>
        );

      case "FINISHED":
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6 text-center">
              <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300 mb-4">
                🏆 대회 종료
              </h2>
              {tournamentData?.result && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      최종 우승자
                    </h3>
                    <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                      {tournamentData.result.winner.nickname}
                      {tournamentData.result.winner.name && (
                        <span className="text-lg text-gray-600 dark:text-gray-400">
                          {" "}
                          ({tournamentData.result.winner.name}
                          {tournamentData.result.winnerStreak
                            ? `, ${tournamentData.result.winnerStreak}연승`
                            : ""}
                          )
                        </span>
                      )}
                      {!tournamentData.result.winner.name &&
                        tournamentData.result.winnerStreak && (
                          <span className="text-lg text-gray-600 dark:text-gray-400">
                            {" "}
                            ({tournamentData.result.winnerStreak}연승)
                          </span>
                        )}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      최다 연승자{" "}
                      {tournamentData.result.maxStreak
                        ? `(${tournamentData.result.maxStreak}연승)`
                        : ""}
                    </h3>
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400 space-y-1">
                      {/* 새로운 구조 (여러명의 최다연승자) */}
                      {tournamentData.result.maxStreakPlayers ? (
                        (tournamentData.result.maxStreakPlayers || []).map(
                          (player, index) => (
                            <div key={player.id}>
                              {player.nickname}
                              {player.name && (
                                <span className="text-lg text-gray-600 dark:text-gray-400">
                                  {" "}
                                  ({player.name})
                                </span>
                              )}
                            </div>
                          )
                        )
                      ) : (
                        /* 이전 구조 (단일 최다연승자) - 하위 호환성 */
                        <div>
                          {
                            (tournamentData.result as any).maxStreakPlayer
                              ?.nickname
                          }
                          {(tournamentData.result as any).maxStreakPlayer
                            ?.name && (
                            <span className="text-lg text-gray-600 dark:text-gray-400">
                              {" "}
                              (
                              {
                                (tournamentData.result as any).maxStreakPlayer
                                  .name
                              }
                              )
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 관리자 새 대회 시작 버튼 */}
              {isAdmin && (
                <div className="mt-6">
                  <button
                    onClick={() => startTournamentMutation.mutate()}
                    disabled={startTournamentMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                  >
                    {startTournamentMutation.isPending
                      ? "시작 중..."
                      : "🚀 새 대회 시작"}
                  </button>
                </div>
              )}
            </div>

            {/* 이전 경기 결과 (펼침/접음 가능) */}
            {tournamentData?.previousGames &&
              tournamentData.previousGames.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-black dark:text-white">
                      📊 경기 기록 ({tournamentData.previousGames.length}경기)
                    </h3>
                    <button
                      onClick={() => setShowGameHistory(!showGameHistory)}
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-all duration-200"
                    >
                      {showGameHistory ? "접기 ▲" : "펼치기 ▼"}
                    </button>
                  </div>
                  {showGameHistory && (
                    <div className="space-y-3">
                      {(tournamentData.previousGames || [])
                        .slice()
                        .reverse()
                        .map((game: PreviousGame, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                라운드 {game.round}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-bold text-green-600 dark:text-green-400">
                                  {game.winner.nickname}
                                </span>
                                {isAdmin && game.winner.name && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    ({game.winner.name})
                                  </span>
                                )}
                              </div>
                              <span className="text-gray-400 dark:text-gray-500">
                                vs
                              </span>
                              <div className="flex flex-col">
                                <span className="text-red-600 dark:text-red-400">
                                  {game.loser.nickname}
                                </span>
                                {game.loser.name && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    ({game.loser.name})
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                맵: {game.map.name}
                              </div>
                              <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {game.streak}연승
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
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
        <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
          🏟️ 대회 현황
        </h1>
      </div>

      {/* 대회 상태 */}
      {renderTournamentStatus()}

      {/* 참가자 목록 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
          👥 참가자 목록 ({playersData.length}명)
        </h2>
        {playersData.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playersData.map((player) => (
              <div
                key={player.id}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-black dark:text-white">
                      {player.nickname}
                    </span>
                    {isAdmin && player.name && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({player.name})
                      </span>
                    )}
                  </div>
                  <RaceBadge race={player.race} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-black dark:text-white text-center py-8">
            아직 참가자가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}

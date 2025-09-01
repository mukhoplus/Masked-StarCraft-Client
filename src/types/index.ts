// API 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// 사용자 관련 타입
export interface User {
  id: number;
  name?: string; // 관리자만 볼 수 있음
  nickname: string;
  race: Race;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  nickname: string;
  role: UserRole;
}

export type UserRole = "PLAYER" | "ADMIN";
export type Race = "PROTOSS" | "TERRAN" | "ZERG";

// 참가 신청 관련
export interface ApplyRequest {
  name: string;
  nickname: string;
  password: string;
  race: Race;
}

export interface PlayerRegistration {
  name: string;
  nickname: string;
  password: string;
  race: Race;
}

export interface LoginRequest {
  nickname: string;
  password: string;
}

// 맵 관련 타입
export interface Map {
  id: number;
  name: string;
}

export interface CreateMapRequest {
  name: string;
}

// 대회 관련 타입
export interface Tournament {
  id: number;
  status: TournamentStatus;
  currentGame?: CurrentGame;
  previousGames?: PreviousGame[];
  result?: TournamentResult;
}

export type TournamentStatus = "PREPARING" | "IN_PROGRESS" | "FINISHED";

export interface CurrentGame {
  player1: Player;
  player2: Player;
  map: Map;
  round: number;
}

export interface Player {
  id: number;
  name?: string; // 관리자만 볼 수 있음
  nickname: string;
  race: Race;
}

export interface PreviousGame {
  winner: Player;
  loser: Player;
  map: Map;
  round: number;
  streak: number;
}

export interface TournamentResult {
  winner: Player;
  winnerStreak: number;
  maxStreak: number;
  maxStreakPlayers: Player[];
}

export interface GameResultRequest {
  winnerId: number;
}

// 로그 관련 타입
export interface TournamentLog {
  tournamentId: number;
  status: TournamentStatus;
  startTime: string;
  endTime: string;
  winner?: Player;
  winnerStreak?: number;
  maxStreak?: number;
  maxStreakPlayer?: Player;
  maxStreakPlayers?: Player[];
  stats?: {
    totalGames: number;
    totalParticipants: number;
    maxStreak: number;
    duration: string;
  };
}

export interface Game {
  round: number;
  map: Map;
  playTime: string;
  player1: Player;
  player2: Player;
  winner: Player;
  winnerStreak: number;
}

export interface TournamentLogDetail extends TournamentLog {
  games: Game[];
}

"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
// @ts-expect-error - SockJS doesn't have proper TypeScript definitions
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

interface WebSocketContextType {
  subscribe: (
    destination: string,
    callback: (message: unknown) => void
  ) => void;
  unsubscribe: (destination: string) => void;
  isConnected: boolean;
  // 데이터 새로고침 콜백 등록 (대회 현황에만 사용)
  registerRefreshCallback: (type: "tournament", callback: () => void) => void;
  unregisterRefreshCallback: (type: "tournament") => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const clientRef = useRef<unknown>(null);
  const subscriptionsRef = useRef<Map<string, unknown>>(new Map());
  const refreshCallbacksRef = useRef<Map<string, () => void>>(new Map());
  const [isConnected, setIsConnected] = React.useState(false);

  // 데이터 새로고침 콜백 등록
  const registerRefreshCallback = (
    type: "tournament",
    callback: () => void
  ) => {
    refreshCallbacksRef.current.set(type, callback);
    // console.log(`Registered refresh callback for: ${type}`);
  };

  // 데이터 새로고침 콜백 해제
  const unregisterRefreshCallback = (
    type: "tournament" | "players" | "logs" | "games"
  ) => {
    refreshCallbacksRef.current.delete(type);
    // console.log(`Unregistered refresh callback for: ${type}`);
  };

  // 특정 타입의 데이터 새로고침 실행
  const triggerRefresh = (types: string[]) => {
    types.forEach((type) => {
      const callback = refreshCallbacksRef.current.get(type);
      if (callback) {
        // console.log(`Triggering refresh for: ${type}`);
        callback();
      }
    });
  };

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws";
    // console.log("Attempting to connect to WebSocket:", wsUrl);

    // SockJS와 STOMP 클라이언트 설정
    const socket = new SockJS(wsUrl);
    const client = Stomp.over(socket);

    // 디버그 모드 활성화 (개발 환경에서)
    client.debug =
      process.env.NODE_ENV === "development" ? console.log : () => {};

    // console.log("Starting WebSocket connection...");
    client.connect(
      {},
      (frame: unknown) => {
        // console.log("WebSocket Connected:", frame);
        setIsConnected(true);
        clientRef.current = client;

        // 대회 상태 변경 알림 구독
        // console.log("Subscribing to /topic/tournament");
        client.subscribe("/topic/tournament", (message: { body: string }) => {
          // console.log("Tournament update received:", message.body);

          // 대회 상태 변경 시에만 tournament 데이터 새로고침
          if (
            message.body === "update" ||
            message.body.includes("tournament_started") ||
            message.body.includes("tournament_finished")
          ) {
            triggerRefresh(["tournament"]);
          }
        });

        // 새로고침 요청 구독
        // console.log("Subscribing to /topic/refresh");
        client.subscribe("/topic/refresh", (message: { body: string }) => {
          // console.log("Refresh required received:", message.body);

          // 대회 데이터만 새로고침
          if (message.body === "refresh_required") {
            triggerRefresh(["tournament"]);
          }
        });

        // 게임 결과 구독
        // console.log("Subscribing to /topic/game-result");
        client.subscribe("/topic/game-result", (message: { body: string }) => {
          // console.log("Game result received:", message.body);

          // 게임 결과가 업데이트되면 대회 정보만 새로고침
          triggerRefresh(["tournament"]);
        });

        // console.log("All WebSocket subscriptions completed");
      },
      (error: unknown) => {
        // console.error("WebSocket Connection Error:", error);
        setIsConnected(false);

        // 재연결 시도
        setTimeout(() => {
          // console.log("Attempting to reconnect...");
          if (!(clientRef.current as { connected?: boolean })?.connected) {
            client.connect(
              {},
              () => {
                // console.log("Reconnected successfully");
                setIsConnected(true);
              },
              () => {
                // console.log("Reconnection failed");
                setIsConnected(false);
              }
            );
          }
        }, 5000);
      }
    );

    return () => {
      if (
        (clientRef.current as { connected?: boolean; disconnect?: () => void })
          ?.connected
      ) {
        (clientRef.current as { disconnect: () => void }).disconnect();
      }
    };
  }, []);

  const subscribe = (
    destination: string,
    callback: (message: unknown) => void
  ) => {
    if (!(clientRef.current as { connected?: boolean })?.connected) {
      console.warn("WebSocket not connected");
      return;
    }

    // 이미 구독중인 경우 기존 구독 해제
    if (subscriptionsRef.current.has(destination)) {
      const subscription = subscriptionsRef.current.get(destination) as {
        unsubscribe: () => void;
      };
      subscription.unsubscribe();
    }

    const subscription = (
      clientRef.current as {
        subscribe: (
          dest: string,
          cb: (msg: { body: string }) => void
        ) => unknown;
      }
    ).subscribe(destination, (message: { body: string }) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        callback(message.body);
      }
    });

    subscriptionsRef.current.set(destination, subscription);
  };

  const unsubscribe = (destination: string) => {
    const subscription = subscriptionsRef.current.get(destination) as
      | { unsubscribe: () => void }
      | undefined;
    if (subscription) {
      subscription.unsubscribe();
      subscriptionsRef.current.delete(destination);
    }
  };

  const value: WebSocketContextType = {
    subscribe,
    unsubscribe,
    isConnected,
    registerRefreshCallback,
    unregisterRefreshCallback,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

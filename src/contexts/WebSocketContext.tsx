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
  const [isConnected, setIsConnected] = React.useState(false);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws";

    // SockJS와 STOMP 클라이언트 설정
    const socket = new SockJS(wsUrl);
    const client = Stomp.over(socket);

    // 디버그 모드 비활성화 (프로덕션에서)
    client.debug =
      process.env.NODE_ENV === "development" ? console.log : () => {};

    client.connect(
      {},
      (frame: unknown) => {
        console.log("WebSocket Connected:", frame);
        setIsConnected(true);
        clientRef.current = client;
      },
      (error: unknown) => {
        console.error("WebSocket Connection Error:", error);
        setIsConnected(false);

        // 재연결 시도
        setTimeout(() => {
          console.log("Attempting to reconnect...");
          if (!(clientRef.current as { connected?: boolean })?.connected) {
            client.connect(
              {},
              () => setIsConnected(true),
              () => setIsConnected(false)
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
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

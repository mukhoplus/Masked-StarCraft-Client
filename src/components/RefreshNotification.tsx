"use client";

import { useWebSocket } from "@/contexts/WebSocketContext";
import { useRouter } from "next/navigation";

const RefreshNotification: React.FC = () => {
  //   const { showRefreshNotification, clearRefreshNotification } = useWebSocket();
  //   const router = useRouter();

  //   const handleRefresh = () => {
  //     clearRefreshNotification();
  //     window.location.reload();
  //   };

  //   const handleDismiss = () => {
  //     clearRefreshNotification();
  //   };

  //   if (!showRefreshNotification) {
  //     return null;
  //   }

  return (
    <div className="fixed top-20 right-4 z-50 bg-blue-600 text-white rounded-lg shadow-lg p-4 max-w-sm animate-slide-in">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">🔄</div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">
            대회 정보가 업데이트되었습니다!
          </h4>
          <p className="text-sm text-blue-100">
            최신 정보를 보려면 새로고침하세요.
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          //   onClick={handleRefresh}
          className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          새로고침
        </button>
        <button
          //   onClick={handleDismiss}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-400 transition-colors"
        >
          나중에
        </button>
      </div>
    </div>
  );
};

export default RefreshNotification;

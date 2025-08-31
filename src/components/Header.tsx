"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push("/");
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white shadow-lg backdrop-blur-sm bg-white/95 border-b border-gray-200 relative">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* 로고 */}
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            onClick={closeMenu}
          >
            🏆 복면스타왕
          </Link>

          {/* 햄버거 메뉴 버튼 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="메뉴 열기"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className="h-0.5 bg-gray-600 block"></span>
              <span className="h-0.5 bg-gray-600 block"></span>
              <span className="h-0.5 bg-gray-600 block"></span>
            </div>
          </button>
        </div>

        {/* 햄버거 메뉴 드롭다운 */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div className="py-2">
              {/* 사용자 정보 */}
              {isAuthenticated && (
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.nickname}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isAdmin ? "관리자" : "참가자"}
                  </p>
                </div>
              )}

              {/* 메뉴 항목들 */}
              <nav className="py-1">
                <Link
                  href="/apply"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  📝 신청
                </Link>

                <Link
                  href="/players"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  👥 신청 현황
                </Link>

                <Link
                  href="/tournament"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  🎮 진행 중인 대회
                </Link>

                {/* 관리자 전용 메뉴 */}
                {isAdmin && (
                  <Link
                    href="/maps"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    🗺️ 맵 관리
                  </Link>
                )}

                <div className="border-t border-gray-200 my-1"></div>

                {/* 로그인/로그아웃 */}
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    🚪 로그아웃
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    🔑 로그인
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}

        {/* 배경 클릭 시 메뉴 닫기 */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40" onClick={closeMenu}></div>
        )}
      </div>
    </header>
  );
};

export default Header;

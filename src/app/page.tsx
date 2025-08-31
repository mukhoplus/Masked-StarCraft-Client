import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* 히어로 섹션 */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">🏆 복면스타왕</h1>
        <p className="text-xl font-bold text-white mb-8">
          승자 연전(King of the Hill) 방식 토너먼트
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/apply"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            📝 지금 참가 신청하기
          </Link>
          <Link
            href="/tournament"
            className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-8 rounded-lg transition-all duration-200 border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl"
          >
            🎮 대회 현황 보기
          </Link>
        </div>
      </div>

      {/* 소개 섹션 */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
          <h2 className="text-2xl font-bold mb-4 text-black">🎯 대회 방식</h2>
          <ul className="space-y-3 text-blue-900 leading-relaxed">
            <li>• 승자 연전(King of the Hill) 방식으로 진행</li>
            <li>• 운영자가 직접 대회를 주도</li>
            <li>• 실시간으로 경기 결과 업데이트</li>
            <li>• 최종 우승자와 최다 연승자 선정</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
          <h2 className="text-2xl font-bold mb-4 text-black">📋 참가 방법</h2>
          <ol className="space-y-3 text-blue-900 leading-relaxed">
            <li>1. 이름, 닉네임, 종족 입력</li>
            <li>2. 4자리 숫자 비밀번호 설정</li>
            <li>3. 신청 완료 후 대회 시작 대기</li>
            <li>4. 실시간으로 대회 진행 관전</li>
          </ol>
        </div>
      </div>

      {/* 특징 섹션 */}
      <div className="bg-white rounded-xl p-10 shadow-lg border border-gray-200 mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-black">
          🌟 서비스 특징
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-bold mb-3 text-black">
              실시간 업데이트
            </h3>
            <p className="text-blue-800 leading-relaxed">
              경기 결과가 즉시 모든 사용자에게 전파됩니다
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-lg font-bold mb-3 text-black">운영자 주도</h3>
            <p className="text-blue-800 leading-relaxed">
              공정하고 체계적인 대회 진행을 보장합니다
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🏅</div>
            <h3 className="text-lg font-bold mb-3 text-black">승자 연전</h3>
            <p className="text-blue-800 leading-relaxed">
              연승을 통해 진정한 왕자를 가립니다
            </p>
          </div>
        </div>
      </div>

      {/* 진행 단계 */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8 text-white">
          📊 대회 진행 단계
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-6">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 text-center min-w-[120px]">
            <div className="text-blue-700 font-bold text-lg">1단계</div>
            <div className="text-blue-600 font-medium">참가자 모집</div>
          </div>
          <div className="text-gray-500 text-2xl">→</div>
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 text-center min-w-[120px]">
            <div className="text-yellow-700 font-bold text-lg">2단계</div>
            <div className="text-yellow-600 font-medium">대회 시작</div>
          </div>
          <div className="text-gray-500 text-2xl">→</div>
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 text-center min-w-[120px]">
            <div className="text-green-700 font-bold text-lg">3단계</div>
            <div className="text-green-600 font-medium">승자 연전</div>
          </div>
          <div className="text-gray-500 text-2xl">→</div>
          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6 text-center min-w-[120px]">
            <div className="text-purple-700 font-bold text-lg">완료</div>
            <div className="text-purple-600 font-medium">우승자 선정</div>
          </div>
        </div>
      </div>
    </div>
  );
}

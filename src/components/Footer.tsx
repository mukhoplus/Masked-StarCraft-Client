import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-lg font-bold mb-2 text-white">🏆 복면스타왕</h3>
          <p className="text-gray-300 mb-4">
            운영자가 주도하는 승자 연전(King of the Hill) 방식 토너먼트
          </p>
          <div className="text-sm text-gray-400">
            <p>Copyright &copy; 2025 Made By Mukho. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">FH</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Find Helper</span>
            </div>
            <div className="flex space-x-4">
              <a
                href="/login"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                Đăng Nhập
              </a>
              <a
                href="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Đăng Ký
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Tìm Người Giúp Việc
            <br />
            <span className="text-indigo-600">Tin Cậy & Chuyên Nghiệp</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Nền tảng kết nối khách hàng với người giúp việc nhà uy tín. 
            Đặt dịch vụ dễ dàng, thanh toán an toàn, chất lượng đảm bảo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="/register"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Bắt Đầu Ngay
            </a>
            <a
              href="/login"
              className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Đăng Nhập
            </a>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cho Khách Hàng</h3>
              <p className="text-gray-600">
                Tìm kiếm và đặt dịch vụ giúp việc nhà một cách nhanh chóng và tiện lợi.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cho Người Giúp Việc</h3>
              <p className="text-gray-600">
                Tìm kiếm cơ hội việc làm linh hoạt và tăng thu nhập từ kỹ năng của bạn.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cho Quản Trị</h3>
              <p className="text-gray-600">
                Quản lý hệ thống, duyệt người giúp việc và đảm bảo chất lượng dịch vụ.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Find Helper. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

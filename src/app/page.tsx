'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PageContainer, Section } from '../components/layout';

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
      <PageContainer className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </PageContainer>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <Section padding="xl" className="text-center">
        <PageContainer>
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
        </PageContainer>
      </Section>

      {/* Features Section */}
      <Section background="white" padding="xl">
        <PageContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cho Khách Hàng</h3>
              <p className="text-gray-600">
                Tìm kiếm và đặt dịch vụ giúp việc nhà một cách nhanh chóng và tiện lợi.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Tìm kiếm helper theo khu vực
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Đánh giá và nhận xét
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Thanh toán trực tuyến an toàn
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cho Người Giúp Việc</h3>
              <p className="text-gray-600">
                Tìm kiếm cơ hội việc làm linh hoạt và tăng thu nhập từ kỹ năng của bạn.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Đăng ký làm helper
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Nhận việc theo lịch trình
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Thu nhập ổn định
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cho Quản Trị</h3>
              <p className="text-gray-600">
                Quản lý hệ thống, duyệt người giúp việc và đảm bảo chất lượng dịch vụ.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Duyệt đơn ứng tuyển
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Quản lý người dùng
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Thống kê báo cáo
                </li>
              </ul>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* Statistics Section */}
      <Section background="blue" padding="lg">
        <PageContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại Sao Chọn Find Helper?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi tự hào về những con số ấn tượng và sự tin tưởng từ người dùng
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">1000+</div>
              <div className="text-gray-600">Người giúp việc</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">5000+</div>
              <div className="text-gray-600">Khách hàng hài lòng</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
              <div className="text-gray-600">Khu vực phủ sóng</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">4.8★</div>
              <div className="text-gray-600">Đánh giá trung bình</div>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* CTA Section */}
      <Section padding="xl">
        <PageContainer>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sẵn Sàng Bắt Đầu?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Tham gia ngay hôm nay để trải nghiệm dịch vụ tốt nhất
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Đăng Ký Miễn Phí
              </a>
              <a
                href="/search-helper"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Tìm Helper Ngay
              </a>
            </div>
          </div>
        </PageContainer>
      </Section>
    </div>
  );
}

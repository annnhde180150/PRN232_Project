'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../lib/api';
import { LoginRequest } from '../../types/auth';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [userType, setUserType] = useState<'user' | 'helper' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  // Color schemes for different user types
  const colorSchemes = {
    user: {
      primary: 'indigo',
      gradient: 'from-blue-50 to-indigo-100',
      button: 'bg-indigo-600 hover:bg-indigo-700',
      focus: 'focus:ring-indigo-500',
      text: 'text-indigo-600',
      link: 'text-indigo-600 hover:text-indigo-500',
      active: 'bg-white text-indigo-600',
    },
    helper: {
      primary: 'emerald',
      gradient: 'from-emerald-50 to-green-100',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      focus: 'focus:ring-emerald-500',
      text: 'text-emerald-600',
      link: 'text-emerald-600 hover:text-emerald-500',
      active: 'bg-white text-emerald-600',
    },
    admin: {
      primary: 'purple',
      gradient: 'from-purple-50 to-violet-100',
      button: 'bg-purple-600 hover:bg-purple-700',
      focus: 'focus:ring-purple-500',
      text: 'text-purple-600',
      link: 'text-purple-600 hover:text-purple-500',
      active: 'bg-white text-purple-600',
    },
  };

  const currentColors = colorSchemes[userType];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      switch (userType) {
        case 'user':
          response = await authAPI.loginUser(formData);
          if (response.success && response.data.token && response.data.user) {
            login(response.data.token, response.data.user, 'user');
          }
          break;
        case 'helper':
          response = await authAPI.loginHelper(formData);
          if (response.success && response.data.token && response.data.helper) {
            login(response.data.token, response.data.helper, 'helper');
          }
          break;
        case 'admin':
          response = await authAPI.loginAdmin(formData);
          if (response.success && response.data.token && response.data.admin) {
            login(response.data.token, response.data.admin, 'admin');
          }
          break;
      }

      // Redirect to dashboard or home page
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentColors.gradient} flex items-center justify-center px-4`}>
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center">
            <h2 className={`text-3xl font-bold text-gray-900 mb-2`}>Đăng Nhập</h2>
            <p className="text-gray-600">Chào mừng bạn trở lại!</p>
          </div>

          {/* User Type Selection */}
          <div className="mt-8">
            <div className="flex rounded-lg bg-gray-100 p-1">
              {[
                { key: 'user', label: 'Khách Hàng' },
                { key: 'helper', label: 'Người Giúp Việc' },
                { key: 'admin', label: 'Quản Trị' },
              ].map((type) => (
                <button
                  key={type.key}
                  type="button"
                  onClick={() => setUserType(type.key as 'user' | 'helper' | 'admin')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    userType === type.key
                      ? colorSchemes[type.key as 'user' | 'helper' | 'admin'].active
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${currentColors.focus} focus:border-transparent transition-colors`}
                  placeholder="Nhập email của bạn"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${currentColors.focus} focus:border-transparent transition-colors`}
                  placeholder="Nhập mật khẩu"
                />
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className={`text-sm ${currentColors.link} font-medium transition-colors`}
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white ${currentColors.button} focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentColors.focus} disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                'Đăng Nhập'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <a href="/register" className={`font-medium ${currentColors.link}`}>
                  Đăng ký ngay
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        userType={userType}
      />
    </div>
  );
} 
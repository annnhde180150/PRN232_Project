'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../lib/api';
import { RegisterUserRequest, RegisterHelperRequest } from '../../types/auth';

export default function RegisterPage() {
  const [userType, setUserType] = useState<'user' | 'helper'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [userForm, setUserForm] = useState<RegisterUserRequest>({
    email: '',
    fullName: '',
    password: '',
    phoneNumber: '',
  });

  const [helperForm, setHelperForm] = useState<RegisterHelperRequest>({
    email: '',
    fullName: '',
    password: '',
    phoneNumber: '',
    bio: '',
    dateOfBirth: '',
    gender: 'male',
  });

  const router = useRouter();

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleHelperChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setHelperForm({
      ...helperForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      if (userType === 'user') {
        response = await authAPI.registerUser(userForm);
      } else {
        response = await authAPI.registerHelper(helperForm);
      }

      if (response.success) {
        setSuccess(response.data.message);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng Ký</h2>
            <p className="text-gray-600">Tạo tài khoản mới</p>
          </div>

          {/* User Type Selection */}
          <div className="mt-8">
            <div className="flex rounded-lg bg-gray-100 p-1">
              {[
                { key: 'user', label: 'Khách Hàng' },
                { key: 'helper', label: 'Người Giúp Việc' },
              ].map((type) => (
                <button
                  key={type.key}
                  type="button"
                  onClick={() => setUserType(type.key as 'user' | 'helper')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    userType === type.key
                      ? 'bg-white text-green-600 shadow-sm'
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

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
                <br />
                <span className="text-sm">Đang chuyển hướng đến trang đăng nhập...</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Common fields */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={userType === 'user' ? userForm.email : helperForm.email}
                  onChange={userType === 'user' ? handleUserChange : handleHelperChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Nhập email của bạn"
                />
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={userType === 'user' ? userForm.fullName : helperForm.fullName}
                  onChange={userType === 'user' ? handleUserChange : handleHelperChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại *
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={userType === 'user' ? userForm.phoneNumber : helperForm.phoneNumber}
                  onChange={userType === 'user' ? handleUserChange : handleHelperChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={userType === 'user' ? userForm.password : helperForm.password}
                  onChange={userType === 'user' ? handleUserChange : handleHelperChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Nhập mật khẩu"
                />
              </div>

              {/* Helper-specific fields */}
              {userType === 'helper' && (
                <>
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh *
                    </label>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      required
                      value={helperForm.dateOfBirth}
                      onChange={handleHelperChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      value={helperForm.gender}
                      onChange={handleHelperChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Giới thiệu bản thân *
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      required
                      rows={3}
                      value={helperForm.bio}
                      onChange={handleHelperChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Viết vài dòng giới thiệu về bản thân và kinh nghiệm làm việc"
                    />
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Đang đăng ký...
                </div>
              ) : (
                'Đăng Ký'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <a href="/login" className="font-medium text-green-600 hover:text-green-500">
                  Đăng nhập ngay
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
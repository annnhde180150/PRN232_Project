'use client';

import { useState } from 'react';
import { authAPI } from '../lib/api';
import { ForgotPasswordRequest, ResetPasswordRequest } from '../types/auth';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'user' | 'helper' | 'admin';
}

type Step = 'email' | 'otp' | 'success';

export default function ForgotPasswordModal({ isOpen, onClose, userType }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestOTP = async () => {
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.forgotPassword(userType, { email });
      
      if (response.success) {
        setStep('otp');
        setSuccess('Mã OTP đã được gửi đến email của bạn');
      } else {
        setError(response.message || 'Không thể gửi mã OTP');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể gửi mã OTP. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Email không được để trống');
      return;
    }

    if (!otpCode) {
      setError('Mã OTP không được để trống');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const requestData = {
        email,
        otpCode,
        newPassword,
        confirmPassword
      };
      
      const response = await authAPI.resetPassword(userType, requestData);
      
      if (response.success) {
        setStep('success');
        setSuccess('Đặt lại mật khẩu thành công!');
      } else {
        setError(response.message || 'Không thể đặt lại mật khẩu');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setOtpCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    onClose();
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('email');
      setOtpCode('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setError('');
    setSuccess('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'email' && 'Quên Mật Khẩu'}
            {step === 'otp' && 'Đặt Lại Mật Khẩu'}
            {step === 'success' && 'Thành Công'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'email' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-12 h-1 mx-2 ${
              step === 'otp' || step === 'success' ? 'bg-indigo-600' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'otp' ? 'bg-indigo-600 text-white' : 
              step === 'success' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {/* Step 1: Email Input */}
        {step === 'email' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Nhập email của bạn"
              />
            </div>
            <button
              onClick={handleRequestOTP}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Đang gửi...
                </div>
              ) : (
                'Gửi Mã OTP'
              )}
            </button>
          </div>
        )}

        {/* Step 2: OTP and Password Reset */}
        {step === 'otp' && (
          <div className="space-y-4">
            
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Mã OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Nhập mã OTP 6 số"
                maxLength={6}
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition-colors"
              >
                Quay Lại
              </button>
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Đang đặt lại mật khẩu...
                  </div>
                ) : (
                  'Đặt Lại Mật Khẩu'
                )}
              </button>
            </div>
          </div>
        )}



        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Đổi mật khẩu thành công!</h3>
            <p className="text-gray-600">Bạn có thể đăng nhập bằng mật khẩu mới.</p>
            <button
              onClick={handleClose}
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 
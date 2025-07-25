import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface OtpVerifyModalProps {
  open: boolean;
  onClose: () => void;
  email?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const modalStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const dialogStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 8,
  padding: 32,
  minWidth: 320,
  boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

export const OtpVerifyModal: React.FC<OtpVerifyModalProps> = ({ open, onClose, email: initialEmail }) => {
  const [email, setEmail] = useState(initialEmail || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [message, router]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        setError('Vui lòng nhập email.');
        setLoading(false);
        return;
      }
      const res = await axios.post(`${BASE_URL}/api/Authentication/verify-otp`, {
        email: trimmedEmail,
        otpCode: otp,
      });
      const data = res.data;
      if (res.status === 200 && data.success) {
        setMessage(data.data?.message || 'OTP verified successfully.');
      } else {
        setError(data.message || 'Verification failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail(initialEmail || '');
    setOtp('');
    setMessage(null);
    setError(null);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-4 relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-center mb-2">Xác thực OTP</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={!!initialEmail}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-gray-100 disabled:opacity-70"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã OTP</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              maxLength={6}
              pattern="[0-9]{6}"
              inputMode="numeric"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors tracking-widest text-lg text-center"
              placeholder="Nhập mã OTP 6 số"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                Đang xác thực...
              </span>
            ) : (
              'Xác thực OTP'
            )}
          </button>
        </form>
        {message && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mt-2">
            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span>{message}</span>
            <span className="ml-2 text-sm text-green-600">Đang chuyển hướng đến trang đăng nhập...</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-2">
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpVerifyModal; 
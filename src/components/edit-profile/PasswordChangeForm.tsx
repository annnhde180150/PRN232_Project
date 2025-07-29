'use client';

import React, { useState } from 'react';
import { profileAPI } from '@/lib/api';
import { ChangePasswordRequest } from '@/types/auth';
import { TextInput } from '@/components/design-system/TextInput';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff, Shield, Check, X } from 'lucide-react';

interface PasswordChangeFormProps {
  userId: number;
  userType: 'user' | 'helper' | 'admin';
}

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  userId,
  userType,
}) => {
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [validation, setValidation] = useState<PasswordValidation>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const validatePassword = (password: string): PasswordValidation => {
    return {
      length: password.length >= 6,
      uppercase: true, // No longer required
      lowercase: true, // No longer required
      number: /\d/.test(password),
      special: true,
    };
  };

  const handleInputChange = (name: keyof ChangePasswordRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Validate new password on change
    if (name === 'newPassword') {
      setValidation(validatePassword(value));
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const isPasswordValid = () => {
    return Object.values(validation).every(Boolean);
  };

  const isFormValid = () => {
    return (
      formData.currentPassword.length > 0 &&
      isPasswordValid() &&
      formData.newPassword === formData.confirmPassword
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error('Vui lòng điền đầy đủ thông tin và đảm bảo mật khẩu hợp lệ');
      return;
    }

    setLoading(true);

    try {
      let response;
      
      switch (userType) {
        case 'admin':
          response = await profileAPI.changeAdminPassword(userId, formData);
          break;
        case 'helper':
          response = await profileAPI.changeHelperPassword(userId, formData);
          break;
        case 'user':
          response = await profileAPI.changeUserPassword(userId, formData);
          break;
      }

      if (response.success) {
        toast.success('Đổi mật khẩu thành công!');
        // Reset form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setValidation({
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false,
        });
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi đổi mật khẩu');
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const ValidationItem: React.FC<{ isValid: boolean; text: string }> = ({ isValid, text }) => (
    <div className={`flex items-center gap-2 text-sm ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
      {isValid ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <X className="w-4 h-4 text-gray-400" />
      )}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <TextInput
          label="Mật khẩu hiện tại"
          type={showPasswords.current ? 'text' : 'password'}
          value={formData.currentPassword}
          onChange={(e) => handleInputChange('currentPassword', e.target.value)}
          required
          startIcon={<Shield className="w-4 h-4" />}
          endIcon={
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
        />

        {/* New Password */}
        <TextInput
          label="Mật khẩu mới"
          type={showPasswords.new ? 'text' : 'password'}
          value={formData.newPassword}
          onChange={(e) => handleInputChange('newPassword', e.target.value)}
          required
          startIcon={<Shield className="w-4 h-4" />}
          endIcon={
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
        />

        {/* Password Validation */}
        {formData.newPassword && (
          <div className="p-4 bg-gray-50 rounded-lg max-w-lg mx-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">Yêu cầu mật khẩu:</h4>
            <div className="space-y-2">
              <ValidationItem isValid={validation.length} text="Ít nhất 6 ký tự" />
              <ValidationItem isValid={validation.number} text="Ít nhất 1 chữ số" />
            </div>
          </div>
        )}

        {/* Confirm Password */}
        <TextInput
          label="Xác nhận mật khẩu mới"
          type={showPasswords.confirm ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          required
          error={
            formData.confirmPassword && formData.newPassword !== formData.confirmPassword
              ? 'Mật khẩu xác nhận không khớp'
              : undefined
          }
          startIcon={<Shield className="w-4 h-4" />}
          endIcon={
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
        />

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <Button 
            type="submit" 
            disabled={loading || !isFormValid()}
            className="min-w-40 px-8"
          >
            {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
          </Button>
        </div>
      </form>

      {/* Security Tips */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg max-w-2xl mx-auto">
        <h4 className="text-sm font-medium text-blue-800 mb-4 flex items-center justify-center gap-2">
          <span className="text-yellow-500">💡</span>
          Mẹo bảo mật:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Sử dụng mật khẩu duy nhất cho mỗi tài khoản</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Không chia sẻ mật khẩu với bất kỳ ai</span>
            </li>
          </ul>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Thay đổi mật khẩu định kỳ (3-6 tháng)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Sử dụng trình quản lý mật khẩu nếu có thể</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 
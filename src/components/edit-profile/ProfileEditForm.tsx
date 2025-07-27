'use client';

import React, { useState } from 'react';
import { profileAPI } from '@/lib/api';
import { User, Helper, Admin, UpdateAdminProfileRequest, UpdateHelperProfileRequest, UpdateUserProfileRequest } from '@/types/auth';
import { TextInput } from '@/components/design-system/TextInput';
import { Select } from '@/components/design-system/Select';
import { Checkbox } from '@/components/design-system/Checkbox';
import { Button } from '@/components/ui/button';
import { ImageUpload } from './ImageUpload';
import { AddressManagement } from './AddressManagement';
import { SkillsDisplay } from './SkillsDisplay';
import { WorkAreasDisplay } from './WorkAreasDisplay';
import { DocumentsDisplay } from './DocumentsDisplay';
import { uploadImage, generateProfileImagePath } from '@/lib/firebase';
import { toast } from 'sonner';
import { Plus, Trash2, MapPin, FileText, Calendar } from 'lucide-react';

interface ProfileEditFormProps {
  profileData: User | Helper | Admin;
  userType: 'user' | 'helper' | 'admin';
  onUpdate: (data: User | Helper | Admin) => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  profileData,
  userType,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState(() => {
    // Initialize form data based on user type
    switch (userType) {
      case 'admin':
        const adminData = profileData as Admin;
        return {
          username: adminData.username || '',
          fullName: adminData.fullName || '',
          email: adminData.email || '',
          role: adminData.role || '',
          isActive: adminData.isActive || false,
        };
      case 'helper':
        const helperData = profileData as Helper;
        return {
          phoneNumber: helperData.phoneNumber || '',
          email: helperData.email || '',
          fullName: helperData.fullName || '',
          profilePictureUrl: helperData.profilePictureUrl || '',
          bio: helperData.bio || '',
          dateOfBirth: helperData.dateOfBirth ? helperData.dateOfBirth.split('T')[0] : '',
          gender: helperData.gender || '',
          isActive: helperData.isActive || false,
          skills: helperData.skills || [],
          workAreas: helperData.workAreas || [],
          documents: helperData.documents || [],
        };
      case 'user':
        const userData = profileData as User;
        return {
          phoneNumber: userData.phoneNumber || '',
          email: userData.email || '',
          fullName: userData.fullName || '',
          profilePictureUrl: userData.profilePictureUrl || '',
          isActive: userData.isActive || false,
          defaultAddressId: userData.defaultAddressId || 0
        };
    }
  });

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (path: string[], value: any) => {
    setFormData(prev => {
      const newData = { ...prev } as any;
      let current: any = newData;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const handleDefaultAddressChange = async (addressId: number) => {
    try {
      // Only handle for user type
      if (userType !== 'user') return;

      // Update the user profile with the new defaultAddressId
      const updateData = {
        ...formData,
        defaultAddressId: addressId,
      };

      const response = await profileAPI.updateUserProfile(
        profileData.id, 
        updateData as UpdateUserProfileRequest
      );

      if (response.success) {
        // Update the profile data in parent component
        onUpdate(response.data || { ...profileData, ...updateData });
        
        // Update local form data
        setFormData(prev => ({
          ...prev,
          defaultAddressId: addressId,
        } as any));
      }
    } catch (error: any) {
      toast.error('Có lỗi xảy ra khi cập nhật địa chỉ mặc định');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image first if a new file is selected
      let imageUrl = formData.profilePictureUrl;
      if (selectedImageFile) {
        try {
          const path = generateProfileImagePath(profileData.id, userType, selectedImageFile.name);
          imageUrl = await uploadImage(selectedImageFile, path);
        } catch (error) {
          console.error('Image upload error:', error);
          toast.error('Có lỗi xảy ra khi tải ảnh lên');
          setLoading(false);
          return;
        }
      }

      // Prepare update data with the new image URL
      const updateData = { ...formData, profilePictureUrl: imageUrl };

      let response;
      
      switch (userType) {
        case 'admin':
          response = await profileAPI.updateAdminProfile(
            profileData.id, 
            updateData as UpdateAdminProfileRequest
          );
          break;
        case 'helper':
          response = await profileAPI.updateHelperProfile(
            profileData.id, 
            updateData as UpdateHelperProfileRequest
          );
          break;
        case 'user':
          response = await profileAPI.updateUserProfile(
            profileData.id, 
            updateData as UpdateUserProfileRequest
          );
          break;
      }

      if (response.success) {
        toast.success('Cập nhật hồ sơ thành công!');
        // Update the profile data in parent component
        onUpdate(response.data || { ...profileData, ...updateData });
        setSelectedImageFile(null); // Clear selected file after successful update
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const renderAdminForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Tên đăng nhập"
          value={formData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          required
        />
        <TextInput
          label="Họ và tên"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          required
        />
      </div>
      <TextInput
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        required
      />
              <TextInput
          label="Vai trò"
          value={formData.role}
          onChange={(e) => handleInputChange('role', e.target.value)}
          required
        />
    </div>
  );

  const renderHelperForm = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Họ và tên"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            required
          />
          <TextInput
            label="Số điện thoại"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            required
          />
        </div>
        <TextInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
        
        {/* Profile Picture Upload */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ảnh đại diện
          </label>
          <ImageUpload
            currentImageUrl={formData.profilePictureUrl}
            userId={profileData.id}
            userType={userType}
            onImageUpload={(imageUrl) => handleInputChange('profilePictureUrl', imageUrl)}
            onFileSelect={(file) => setSelectedImageFile(file)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <TextInput
            label="Ngày sinh"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            startIcon={<Calendar className="w-4 h-4" />}
            max={(() => {
              const today = new Date();
              const minAge = 18;
              const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
              return maxDate.toISOString().split('T')[0];
            })()}
            helperText="Bạn phải từ 18 tuổi trở lên để đăng ký làm người giúp việc"
          />
          <Select
            label="Giới tính"
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            options={[
              { value: 'male', label: 'Nam' },
              { value: 'female', label: 'Nữ' },
              { value: 'other', label: 'Khác' },
            ]}
          />
        </div>
        <div className="mt-4">
          <TextInput
            label="Giới thiệu bản thân"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            helperText="Mô tả ngắn về bản thân và kinh nghiệm làm việc"
          />
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Kỹ năng đã đăng ký
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Xem các kỹ năng và kinh nghiệm đã đăng ký
        </p>
        <SkillsDisplay skills={formData.skills || []} />
      </div>

      {/* Work Areas Section */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Khu vực làm việc đã đăng ký
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Xem các khu vực bạn có thể phục vụ
        </p>
        <WorkAreasDisplay workAreas={formData.workAreas || []} />
      </div>

      {/* Documents Section */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Tài liệu đã đăng tải
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Xem trạng thái xác thực các tài liệu đã đăng tải
        </p>
        <DocumentsDisplay documents={formData.documents || []} />
      </div>
    </div>
  );

  const renderUserForm = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Họ và tên"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            required
          />
          <TextInput
            label="Số điện thoại"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            required
          />
        </div>
        <TextInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
        
        {/* Profile Picture Upload */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ảnh đại diện
          </label>
          <ImageUpload
            currentImageUrl={formData.profilePictureUrl}
            userId={profileData.id}
            userType={userType}
            onImageUpload={(imageUrl) => handleInputChange('profilePictureUrl', imageUrl)}
            onFileSelect={(file) => setSelectedImageFile(file)}
          />
        </div>
      </div>

      {/* Address Management Section */}
      <div>
        <AddressManagement 
          userId={profileData.id} 
          onDefaultAddressChange={handleDefaultAddressChange}
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {userType === 'admin' && renderAdminForm()}
      {userType === 'helper' && renderHelperForm()}
      {userType === 'user' && renderUserForm()}

      <div className="flex justify-end pt-6 border-t">
        <Button type="submit" disabled={loading} className="min-w-32">
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
    </form>
  );
}; 
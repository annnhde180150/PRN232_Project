'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileAPI } from '@/lib/api';
import { User, Helper, Admin } from '@/types/auth';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Layout } from '@/components/layout';
import { ProfileEditForm } from '@/components/edit-profile/ProfileEditForm';
import { PasswordChangeForm } from '@/components/edit-profile/PasswordChangeForm';
import { User as UserIcon, Lock, Settings, Shield, UserCheck } from 'lucide-react';

export default function ProfilePage() {
  const { user, userType, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState<User | Helper | Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user || !userType) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        let data;
        
        switch (userType) {
          case 'admin':
            data = await profileAPI.getAdminProfile(user.id);
            break;
          case 'helper':
            data = await profileAPI.getHelperProfile(user.id);
            break;
          case 'user':
            data = await profileAPI.getUserProfile(user.id);
            break;
          default:
            throw new Error('Invalid user type');
        }
        
        setProfileData(data);
      } catch (err: any) {
        setError(err.message || 'Không thể tải thông tin hồ sơ');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, userType, authLoading]);

  const getUserRoleIcon = () => {
    switch (userType) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'helper': return <UserCheck className="w-4 h-4" />;
      default: return <UserIcon className="w-4 h-4" />;
    }
  };

  const getUserRoleColor = () => {
    switch (userType) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'helper': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'user': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getUserRoleText = () => {
    switch (userType) {
      case 'admin': return 'Quản trị viên';
      case 'helper': return 'Người giúp việc';
      case 'user': return 'Khách hàng';
      default: return 'Người dùng';
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải thông tin hồ sơ...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-primary hover:underline"
            >
              Thử lại
            </button>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">Không tìm thấy thông tin hồ sơ</p>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
               {(profileData as any).profilePictureUrl ? (
                 <img src={(profileData as any).profilePictureUrl} alt="Profile" className="object-cover" />
               ) : (
                 <div className="flex items-center justify-center h-full w-full bg-primary/10">
                   {getUserRoleIcon()}
                 </div>
               )}
             </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{profileData.fullName}</h1>
              <p className="text-muted-foreground">{profileData.email}</p>
              <Badge className={`mt-2 ${getUserRoleColor()}`}>
                <div className="flex items-center gap-1">
                  {getUserRoleIcon()}
                  <span>{getUserRoleText()}</span>
                </div>
              </Badge>
            </div>
          </div>
          <Separator />
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Chỉnh sửa hồ sơ
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Đổi mật khẩu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Thông tin hồ sơ</h2>
                <p className="text-muted-foreground">
                  Cập nhật thông tin cá nhân của bạn. Những thay đổi sẽ được lưu sau khi bạn nhấn "Lưu thay đổi".
                </p>
              </div>
              <Separator className="mb-6" />
              <ProfileEditForm 
                profileData={profileData} 
                userType={userType!}
                onUpdate={setProfileData}
              />
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Đổi mật khẩu</h2>
                <p className="text-muted-foreground">
                  Đảm bảo tài khoản của bạn sử dụng mật khẩu mạnh để bảo mật.
                </p>
              </div>
              <Separator className="mb-6" />
              <PasswordChangeForm userId={profileData.id} userType={userType!} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
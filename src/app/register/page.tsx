'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../lib/api';
import { RegisterUserRequest, RegisterHelperRequest } from '../../types/auth';
import OtpVerifyModal from '../../components/OtpVerifyModal';
import { getAllServices, Service } from '../../lib/api';
import UploadFile from '../../components/UploadFile';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

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
    gender: 'Male',
    skills: [],
    workAreas: [],
    documents: [],
  });

  // For skills dropdown
  const [services, setServices] = useState<Service[]>([]);
  useEffect(() => {
    getAllServices().then(setServices).catch(() => setServices([]));
  }, []);

  // For document upload (CV and ID)
  const [cvUrl, setCvUrl] = useState<string>('');
  const [idUrl, setIdUrl] = useState<string>('');



  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

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

  const addSkill = () => {
    // Find the first available service that hasn't been selected yet
    const usedServiceIds = helperForm.skills.map(skill => skill.serviceId);
    const availableService = services.find(service => !usedServiceIds.includes(service.serviceId));
    
    if (!availableService) {
      setError('Tất cả dịch vụ đã được chọn. Không thể thêm kỹ năng mới.');
      return;
    }
    
    setHelperForm({
      ...helperForm,
      skills: [
        ...helperForm.skills,
        { 
          serviceId: availableService.serviceId, 
          yearsOfExperience: 0, 
          isPrimarySkill: helperForm.skills.length === 0 
        }
      ]
    });
    setError(''); // Clear any previous errors
  };

  const removeSkill = (index: number) => {
    const updated = helperForm.skills.filter((_, i) => i !== index);
    setHelperForm({ ...helperForm, skills: updated });
  };

  const updateSkill = (index: number, field: string, value: any) => {
    const updated = [...helperForm.skills];
    
    // Check for duplicate serviceId when updating serviceId
    if (field === 'serviceId' && value !== 0) {
      const isDuplicate = updated.some((skill, i) => 
        i !== index && skill.serviceId === value
      );
      if (isDuplicate) {
        setError('Dịch vụ này đã được chọn. Vui lòng chọn dịch vụ khác.');
        return;
      }
    }
    
    if (field === 'isPrimarySkill' && value) {
      // Reset all other primary skills
      updated.forEach((skill, i) => {
        if (i !== index) skill.isPrimarySkill = false;
      });
    }
    updated[index] = { ...updated[index], [field]: value };
    setHelperForm({ ...helperForm, skills: updated });
    setError(''); // Clear any previous errors
  };

  const addWorkArea = () => {
    setHelperForm({
      ...helperForm,
      workAreas: [
        ...helperForm.workAreas,
        { city: 'Da Nang', district: '', ward: '', latitude: 0, longitude: 0, radiusKm: 5 }
      ]
    });
  };

  const removeWorkArea = (index: number) => {
    const updated = helperForm.workAreas.filter((_, i) => i !== index);
    setHelperForm({ ...helperForm, workAreas: updated });
  };

  const updateWorkArea = (index: number, field: string, value: any) => {
    setHelperForm(prevForm => {
      const updated = [...prevForm.workAreas];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prevForm, workAreas: updated };
    });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate helper form
    if (userType === 'helper') {
      if (helperForm.skills.length === 0) {
        setError('Vui lòng thêm ít nhất một kỹ năng');
        setLoading(false);
        return;
      }
      
      // Validate that all skills have valid serviceId
      const invalidSkills = helperForm.skills.filter(skill => skill.serviceId === 0);
      if (invalidSkills.length > 0) {
        setError('Vui lòng chọn dịch vụ cho tất cả các kỹ năng');
        setLoading(false);
        return;
      }
      
      if (helperForm.workAreas.length === 0) {
        setError('Vui lòng thêm ít nhất một khu vực làm việc');
        setLoading(false);
        return;
      }
      
      // Validate that work areas have required fields
      const invalidWorkAreas = helperForm.workAreas.filter(area => 
        !area.city || !area.district || !area.ward
      );
      if (invalidWorkAreas.length > 0) {
        setError('Vui lòng điền đầy đủ thông tin cho tất cả khu vực làm việc');
        setLoading(false);
        return;
      }
      
      if (!cvUrl || !idUrl) {
        setError('Vui lòng tải lên đầy đủ tài liệu (CV và CMND/CCCD)');
        setLoading(false);
        return;
      }
    }

    // Prepare documents array
    const documents = [];
    const now = new Date().toISOString();
    if (cvUrl) {
      documents.push({
        documentType: 'CV' as 'CV',
        documentUrl: cvUrl,
        uploadDate: now,
        verificationStatus: 'Pending',
        verifiedByAdminId: 0,
        verificationDate: now,
        notes: ''
      });
    }
    if (idUrl) {
      documents.push({
        documentType: 'ID' as 'ID',
        documentUrl: idUrl,
        uploadDate: now,
        verificationStatus: 'Pending',
        verifiedByAdminId: 0,
        verificationDate: now,
        notes: ''
      });
    }

    try {
      let response;
      if (userType === 'user') {
        response = await authAPI.registerUser(userForm);
      } else {
        // Prepare the complete helper data
        const helperData = {
          ...helperForm,
          documents,
        };
        
        response = await authAPI.registerHelper(helperData);
      }

      if (response.success) {
        setSuccess(response.data.message);
        setRegisteredEmail(userType === 'user' ? userForm.email : helperForm.email);
        setShowOtpModal(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getServiceName = (serviceId: number) => {
    const service = services.find(s => s.serviceId === serviceId);
    return service ? service.serviceName : 'Chưa chọn';
  };

  const getAvailableServices = () => {
    const usedServiceIds = helperForm.skills.map(skill => skill.serviceId);
    return services.filter(service => !usedServiceIds.includes(service.serviceId));
  };

  // Da Nang coordinates mapping


  const getDaNangCoordinates = (district: string, ward: string) => {
    const coordinates: { [key: string]: { [key: string]: { lat: number; lng: number } } } = {
      'Hai Chau': {
        'Binh Hien': { lat: 16.0747, lng: 108.2237 },
        'Binh Thuan': { lat: 16.0758, lng: 108.2256 },
        'Hai Chau 1': { lat: 16.0769, lng: 108.2275 },
        'Hai Chau 2': { lat: 16.0780, lng: 108.2294 },
        'Hoa Cuong Bac': { lat: 16.0791, lng: 108.2313 },
        'Hoa Cuong Nam': { lat: 16.0802, lng: 108.2332 },
        'Hoa Thuan Dong': { lat: 16.0813, lng: 108.2351 },
        'Hoa Thuan Tay': { lat: 16.0824, lng: 108.2370 },
        'Nam Duong': { lat: 16.0835, lng: 108.2389 },
        'Phuoc Ninh': { lat: 16.0846, lng: 108.2408 },
        'Thach Thang': { lat: 16.0857, lng: 108.2427 },
        'Thanh Binh': { lat: 16.0868, lng: 108.2446 },
        'Thuan Phuoc': { lat: 16.0879, lng: 108.2465 }
      },
      'Thanh Khe': {
        'An Khe': { lat: 16.0890, lng: 108.2484 },
        'Chinh Gian': { lat: 16.0901, lng: 108.2503 },
        'Hoa Khe': { lat: 16.0912, lng: 108.2522 },
        'Tam Thuan': { lat: 16.0923, lng: 108.2541 },
        'Tan Chinh': { lat: 16.0934, lng: 108.2560 },
        'Thac Gian': { lat: 16.0945, lng: 108.2579 },
        'Thanh Khe Dong': { lat: 16.0956, lng: 108.2598 },
        'Thanh Khe Tay': { lat: 16.0967, lng: 108.2617 },
        'Vinh Trung': { lat: 16.0978, lng: 108.2636 },
        'Xuan Ha': { lat: 16.0989, lng: 108.2655 }
      },
      'Son Tra': {
        'An Hai Bac': { lat: 16.1000, lng: 108.2674 },
        'An Hai Dong': { lat: 16.1011, lng: 108.2693 },
        'An Hai Tay': { lat: 16.1022, lng: 108.2712 },
        'Man Thai': { lat: 16.1033, lng: 108.2731 },
        'Nai Hien Dong': { lat: 16.1044, lng: 108.2750 },
        'Phuoc My': { lat: 16.1055, lng: 108.2769 },
        'Tho Quang': { lat: 16.1066, lng: 108.2788 }
      },
      'Ngu Hanh Son': {
        'Hoa Hai': { lat: 16.1077, lng: 108.2807 },
        'Hoa Quy': { lat: 16.1088, lng: 108.2826 },
        'Khue My': { lat: 16.1099, lng: 108.2845 },
        'My An': { lat: 16.1110, lng: 108.2864 }
      },
      'Cam Le': {
        'Hoa An': { lat: 16.1121, lng: 108.2883 },
        'Hoa Phat': { lat: 16.1132, lng: 108.2902 },
        'Hoa Tho Dong': { lat: 16.1143, lng: 108.2921 },
        'Hoa Tho Tay': { lat: 16.1154, lng: 108.2940 },
        'Khue Trung': { lat: 16.1165, lng: 108.2959 }
      },
      'Lien Chieu': {
        'Hoa Hiep Bac': { lat: 16.1176, lng: 108.2978 },
        'Hoa Hiep Nam': { lat: 16.1187, lng: 108.2997 },
        'Hoa Khanh Bac': { lat: 16.1198, lng: 108.3016 },
        'Hoa Khanh Nam': { lat: 16.1209, lng: 108.3035 },
        'Hoa Minh': { lat: 16.1220, lng: 108.3054 }
      },
      'Hoa Vang': {
        'Hoa Bac': { lat: 16.1231, lng: 108.3073 },
        'Hoa Chau': { lat: 16.1242, lng: 108.3092 },
        'Hoa Khương': { lat: 16.1253, lng: 108.3111 },
        'Hoa Lien': { lat: 16.1264, lng: 108.3130 },
        'Hoa Nhon': { lat: 16.1275, lng: 108.3149 },
        'Hoa Ninh': { lat: 16.1286, lng: 108.3168 },
        'Hoa Phong': { lat: 16.1297, lng: 108.3187 },
        'Hoa Phu': { lat: 16.1308, lng: 108.3206 },
        'Hoa Phuoc': { lat: 16.1319, lng: 108.3225 },
        'Hoa Son': { lat: 16.1330, lng: 108.3244 },
        'Hoa Tien': { lat: 16.1341, lng: 108.3263 }
      },
      'Hoang Sa': {
        'Hoang Sa': { lat: 16.1352, lng: 108.3282 }
      }
    };

    return coordinates[district]?.[ward] || { lat: 16.0544, lng: 108.2022 }; // Default to Da Nang center
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng Ký</h2>
            <p className="text-gray-600">Tạo tài khoản mới</p>
          </div>

          {/* User Type Selection */}
          <div className="mb-8">
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
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
                <br />
                <span className="text-sm">Vui lòng xác thực OTP để hoàn tất đăng ký...</span>
              </div>
            )}

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </CardContent>
            </Card>

            {/* Helper-specific fields */}
            {userType === 'helper' && (
              <>
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh *
                    </label>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      required
                      max={(() => {
                        const today = new Date();
                        const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
                        return maxDate.toISOString().split('T')[0];
                      })()}
                      value={helperForm.dateOfBirth}
                      onChange={handleHelperChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Bạn phải từ 18 tuổi trở lên để đăng ký làm người giúp việc
                    </p>
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
                      <option value="Male">Nam</option>
                      <option value="Female">Nữ</option>
                      <option value="Other">Khác</option>
                    </select>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Giới thiệu bản thân *
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        required
                        rows={4}
                        value={helperForm.bio}
                        onChange={handleHelperChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Viết vài dòng giới thiệu về bản thân và kinh nghiệm làm việc của bạn..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>Kỹ năng & Dịch vụ</span>
                        <Badge variant="outline" className="text-xs">
                          {helperForm.skills.length}/{services.length} đã chọn
                        </Badge>
                      </div>
                      <Button 
                        type="button" 
                        onClick={addSkill} 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        disabled={getAvailableServices().length === 0}
                      >
                        + Thêm kỹ năng
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {helperForm.skills.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>Chưa có kỹ năng nào được thêm</p>
                        <p className="text-sm">Nhấn "Thêm kỹ năng" để bắt đầu</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {helperForm.skills.map((skill, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Badge variant={skill.isPrimarySkill ? "default" : "outline"}>
                                  {skill.isPrimarySkill ? "Kỹ năng chính" : "Kỹ năng phụ"}
                                </Badge>
                                <span className="text-sm text-gray-600">#{idx + 1}</span>
                              </div>
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                onClick={() => removeSkill(idx)}
                              >
                                Xóa
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Dịch vụ
                                </label>
                                <select
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  value={skill.serviceId}
                                  onChange={e => updateSkill(idx, 'serviceId', Number(e.target.value))}
                                >
                                  <option value={0}>Chọn dịch vụ</option>
                                  {services
                                    .filter(s => {
                                      // Show all services if this skill has no serviceId yet, or show only available ones
                                      if (skill.serviceId === 0) {
                                        // For new skills, exclude already selected services
                                        const usedServiceIds = helperForm.skills.map(skill => skill.serviceId);
                                        return !usedServiceIds.includes(s.serviceId);
                                      } else {
                                        // For existing skills, show the current service and available ones
                                        const usedServiceIds = helperForm.skills
                                          .filter((_, i) => i !== idx)
                                          .map(skill => skill.serviceId);
                                        return skill.serviceId === s.serviceId || !usedServiceIds.includes(s.serviceId);
                                      }
                                    })
                                    .map(s => (
                                      <option key={s.serviceId} value={s.serviceId}>{s.serviceName}</option>
                                    ))}
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Kinh nghiệm (năm)
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  placeholder="VD: 2"
                                  value={skill.yearsOfExperience}
                                  onChange={e => updateSkill(idx, 'yearsOfExperience', Number(e.target.value))}
                                />
                              </div>
                              
                              <div className="flex items-center pt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={skill.isPrimarySkill}
                                    onChange={e => updateSkill(idx, 'isPrimarySkill', e.target.checked)}
                                    className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                  />
                                  <span className="text-sm text-gray-700">Kỹ năng chính</span>
                                </label>
                              </div>
                            </div>

                            {skill.serviceId > 0 && (
                              <div className="mt-3 p-3 bg-white rounded-md border">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-700">Dịch vụ đã chọn:</span>
                                  <Badge variant="secondary">{getServiceName(skill.serviceId)}</Badge>
                                  <span className="text-sm text-gray-500">• {skill.yearsOfExperience} năm kinh nghiệm</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Work Areas Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Khu vực làm việc</span>
                      <Button type="button" onClick={addWorkArea} size="sm" className="bg-green-600 hover:bg-green-700">
                        + Thêm khu vực
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {helperForm.workAreas.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>Chưa có khu vực làm việc nào</p>
                        <p className="text-sm">Nhấn "Thêm khu vực" để bắt đầu</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {helperForm.workAreas.map((area, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900">Khu vực #{idx + 1}</h4>
                              <div className="flex items-center gap-2">

                                <Button 
                                  type="button" 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => removeWorkArea(idx)}
                                >
                                  Xóa
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Quận/Huyện
                                </label>
                                <select
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  value={area.district}
                                  onChange={e => {
                                    const selectedDistrict = e.target.value;
                                    updateWorkArea(idx, 'district', selectedDistrict);
                                    updateWorkArea(idx, 'city', 'Da Nang');
                                    // Reset ward when district changes
                                    updateWorkArea(idx, 'ward', '');
                                  }}
                                >
                                  <option value="">Chọn quận/huyện</option>
                                  <option value="Hai Chau">Hải Châu</option>
                                  <option value="Thanh Khe">Thanh Khê</option>
                                  <option value="Son Tra">Sơn Trà</option>
                                  <option value="Ngu Hanh Son">Ngũ Hành Sơn</option>
                                  <option value="Cam Le">Cẩm Lệ</option>
                                  <option value="Lien Chieu">Liên Chiểu</option>
                                  <option value="Hoa Vang">Hòa Vang</option>
                                  <option value="Hoang Sa">Hoàng Sa</option>
                                </select>
                              </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phường/Xã
                                  </label>
                                  <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    value={area.ward}
                                    onChange={e => {
                                      const selectedWard = e.target.value;
                                      updateWorkArea(idx, 'ward', selectedWard);
                                      
                                      // Auto-set coordinates when ward is selected
                                      if (selectedWard && area.district) {
                                        const coords = getDaNangCoordinates(area.district, selectedWard);
                                        updateWorkArea(idx, 'latitude', coords.lat);
                                        updateWorkArea(idx, 'longitude', coords.lng);
                                      }
                                    }}
                                    disabled={!area.district}
                                  >
                                    <option value="">Chọn phường/xã</option>
                                    {area.district === 'Hai Chau' && (
                                      <>
                                        <option value="Binh Hien">Bình Hiên</option>
                                        <option value="Binh Thuan">Bình Thuận</option>
                                        <option value="Hai Chau 1">Hải Châu 1</option>
                                        <option value="Hai Chau 2">Hải Châu 2</option>
                                        <option value="Hoa Cuong Bac">Hòa Cường Bắc</option>
                                        <option value="Hoa Cuong Nam">Hòa Cường Nam</option>
                                        <option value="Hoa Thuan Dong">Hòa Thuận Đông</option>
                                        <option value="Hoa Thuan Tay">Hòa Thuận Tây</option>
                                        <option value="Nam Duong">Nam Dương</option>
                                        <option value="Phuoc Ninh">Phước Ninh</option>
                                        <option value="Thach Thang">Thạch Thang</option>
                                        <option value="Thanh Binh">Thanh Bình</option>
                                        <option value="Thuan Phuoc">Thuận Phước</option>
                                      </>
                                    )}
                                    {area.district === 'Thanh Khe' && (
                                      <>
                                        <option value="An Khe">An Khê</option>
                                        <option value="Chinh Gian">Chính Gián</option>
                                        <option value="Hoa Khe">Hòa Khê</option>
                                        <option value="Tam Thuan">Tam Thuận</option>
                                        <option value="Tan Chinh">Tân Chính</option>
                                        <option value="Thac Gian">Thạc Gián</option>
                                        <option value="Thanh Khe Dong">Thanh Khê Đông</option>
                                        <option value="Thanh Khe Tay">Thanh Khê Tây</option>
                                        <option value="Vinh Trung">Vĩnh Trung</option>
                                        <option value="Xuan Ha">Xuân Hà</option>
                                      </>
                                    )}
                                    {area.district === 'Son Tra' && (
                                      <>
                                        <option value="An Hai Bac">An Hải Bắc</option>
                                        <option value="An Hai Dong">An Hải Đông</option>
                                        <option value="An Hai Tay">An Hải Tây</option>
                                        <option value="Man Thai">Mân Thái</option>
                                        <option value="Nai Hien Dong">Nại Hiên Đông</option>
                                        <option value="Phuoc My">Phước Mỹ</option>
                                        <option value="Tho Quang">Thọ Quang</option>
                                      </>
                                    )}
                                    {area.district === 'Ngu Hanh Son' && (
                                      <>
                                        <option value="Hoa Hai">Hòa Hải</option>
                                        <option value="Hoa Quy">Hòa Quý</option>
                                        <option value="Khue My">Khuê Mỹ</option>
                                        <option value="My An">Mỹ An</option>
                                      </>
                                    )}
                                    {area.district === 'Cam Le' && (
                                      <>
                                        <option value="Hoa An">Hòa An</option>
                                        <option value="Hoa Phat">Hòa Phát</option>
                                        <option value="Hoa Tho Dong">Hòa Thọ Đông</option>
                                        <option value="Hoa Tho Tay">Hòa Thọ Tây</option>
                                        <option value="Khue Trung">Khuê Trung</option>
                                      </>
                                    )}
                                    {area.district === 'Lien Chieu' && (
                                      <>
                                        <option value="Hoa Hiep Bac">Hòa Hiệp Bắc</option>
                                        <option value="Hoa Hiep Nam">Hòa Hiệp Nam</option>
                                        <option value="Hoa Khanh Bac">Hòa Khánh Bắc</option>
                                        <option value="Hoa Khanh Nam">Hòa Khánh Nam</option>
                                        <option value="Hoa Minh">Hòa Minh</option>
                                      </>
                                    )}
                                    {area.district === 'Hoa Vang' && (
                                      <>
                                        <option value="Hoa Bac">Hòa Bắc</option>
                                        <option value="Hoa Chau">Hòa Châu</option>
                                        <option value="Hoa Khương">Hòa Khương</option>
                                        <option value="Hoa Lien">Hòa Liên</option>
                                        <option value="Hoa Nhon">Hòa Nhơn</option>
                                        <option value="Hoa Ninh">Hòa Ninh</option>
                                        <option value="Hoa Phong">Hòa Phong</option>
                                        <option value="Hoa Phu">Hòa Phú</option>
                                        <option value="Hoa Phuoc">Hòa Phước</option>
                                        <option value="Hoa Son">Hòa Sơn</option>
                                        <option value="Hoa Tien">Hòa Tiến</option>
                                      </>
                                    )}
                                    {area.district === 'Hoang Sa' && (
                                      <>
                                        <option value="Hoang Sa">Hoàng Sa</option>
                                      </>
                                    )}
                                  </select>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thành phố
                                  </label>
                                  <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                                    value="Da Nang"
                                    disabled
                                  />
                                </div>
                              </div>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Bán kính làm việc (km)
                                </label>
                                <input
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  type="number"
                                  min={1}
                                  placeholder="VD: 10"
                                  value={area.radiusKm}
                                  onChange={e => updateWorkArea(idx, 'radiusKm', Number(e.target.value))}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Tọa độ sẽ được tự động điền khi bạn chọn địa chỉ từ danh sách gợi ý
                                </p>
                              </div>
                            </div>

                            {area.city && area.district && area.ward && (
                              <div className="mt-3 p-3 bg-white rounded-md border">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-700">Địa chỉ:</span>
                                  <Badge variant="secondary">{area.ward}, {area.district}, {area.city}</Badge>
                                  <span className="text-sm text-gray-500">• Bán kính {area.radiusKm}km</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Documents Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tài liệu xác thực</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">CV/Hồ sơ ứng tuyển</h4>
                          <Badge variant={cvUrl ? "default" : "outline"}>
                            {cvUrl ? "Đã tải lên" : "Chưa tải lên"}
                          </Badge>
                        </div>
                        <UploadFile 
                          onUploaded={(url: string) => setCvUrl(url)}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          maxSize={5}
                        />
                        <p className="text-xs text-gray-500">Tải lên CV để chứng minh kinh nghiệm và kỹ năng của bạn</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">CMND/CCCD</h4>
                          <Badge variant={idUrl ? "default" : "outline"}>
                            {idUrl ? "Đã tải lên" : "Chưa tải lên"}
                          </Badge>
                        </div>
                        <UploadFile 
                          onUploaded={(url: string) => setIdUrl(url)}
                          accept=".pdf,.jpg,.jpeg,.png"
                          maxSize={5}
                        />
                        <p className="text-xs text-gray-500">Tải lên CMND/CCCD để xác thực danh tính</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">ℹ️</span>
                        <div className="text-sm text-blue-800">
                          <strong>Lưu ý:</strong> Tất cả tài liệu sẽ được admin xem xét và xác thực trước khi tài khoản được kích hoạt. 
                          Vui lòng đảm bảo tài liệu rõ ràng và đầy đủ thông tin.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Đang đăng ký...
                </div>
              ) : (
                'Đăng Ký'
              )}
            </Button>

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

      {/* OTP Verify Modal */}
      <OtpVerifyModal
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={registeredEmail}
      />
    </div>
  );
} 
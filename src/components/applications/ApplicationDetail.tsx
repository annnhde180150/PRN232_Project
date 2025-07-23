'use client';

import React, { useState, useEffect } from 'react';
import { applicationsAPI } from '../../lib/api';
import {
  HelperApplicationDetail,
  ApplicationDecisionRequest,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS
} from '../../types/applications';

interface ApplicationDetailProps {
  helperId: number;
  onBack: () => void;
  onDecisionMade: () => void;
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({
  helperId,
  onBack,
  onDecisionMade
}) => {
  const [application, setApplication] = useState<HelperApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [decisionStatus, setDecisionStatus] = useState<'approved' | 'rejected' | 'revision_requested'>('approved');
  const [decisionComment, setDecisionComment] = useState('');

  useEffect(() => {
    fetchApplicationDetail();
  }, [helperId]);

  const fetchApplicationDetail = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await applicationsAPI.getApplicationDetail(helperId);
      
      if (response.success) {
        setApplication(response.data);
      } else {
        setError('Không thể tải thông tin chi tiết đơn đăng ký');
      }
    } catch (err: any) {
      setError('Đã xảy ra lỗi khi tải dữ liệu');
      console.error('Error fetching application detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async () => {
    if (!decisionComment.trim()) {
      alert('Vui lòng nhập nhận xét');
      return;
    }

    setDecisionLoading(true);

    try {
      const decisionRequest: ApplicationDecisionRequest = {
        status: decisionStatus,
        comment: decisionComment
      };

      const response = await applicationsAPI.makeDecision(helperId, decisionRequest);
      
      if (response.success) {
        alert('Đã xử lý đơn đăng ký thành công');
        setShowDecisionModal(false);
        onDecisionMade();
      } else {
        alert('Không thể xử lý đơn đăng ký');
      }
    } catch (err: any) {
      alert('Đã xảy ra lỗi khi xử lý đơn đăng ký');
      console.error('Error making decision:', err);
    } finally {
      setDecisionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-sm text-red-700">{error}</div>
        <button
          onClick={onBack}
          className="mt-2 text-sm text-red-600 hover:text-red-500"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <div className="text-sm text-gray-500">Không tìm thấy thông tin đơn đăng ký</div>
        <button
          onClick={onBack}
          className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-indigo-600 hover:text-indigo-500"
            >
              ← Quay lại danh sách
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Chi tiết đơn đăng ký #{application.helperId}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              APPLICATION_STATUS_COLORS[application.approvalStatus]
            }`}>
              {APPLICATION_STATUS_LABELS[application.approvalStatus]}
            </span>
            {application.approvalStatus === 'pending' && (
              <button
                onClick={() => setShowDecisionModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Xử lý đơn
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Thông tin cá nhân</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  {application.profilePictureUrl ? (
                    <img
                      src={application.profilePictureUrl}
                      alt={application.fullName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-xl">
                        {application.fullName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {application.fullName}
                    </h4>
                    <p className="text-sm text-gray-500">ID: {application.helperId}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{application.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                    <p className="text-sm text-gray-900">{application.phoneNumber}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày sinh</label>
                  <p className="text-sm text-gray-900">{formatDate(application.dateOfBirth)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Giới tính</label>
                  <p className="text-sm text-gray-900">{application.gender}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Tiểu sử</label>
                  <p className="text-sm text-gray-900 mt-1">{application.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Tài liệu ({application.documents.length})
              </h3>
            </div>
            <div className="p-6">
              {application.documents.length > 0 ? (
                <div className="space-y-4">
                  {application.documents.map((doc) => (
                    <div key={doc.documentId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {doc.documentType}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Tải lên: {formatDate(doc.uploadDate)}
                          </p>
                          {doc.notes && (
                            <p className="text-sm text-gray-600 mt-1">{doc.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            getVerificationStatusColor(doc.verificationStatus)
                          }`}>
                            {doc.verificationStatus === 'verified' ? 'Đã xác minh' :
                             doc.verificationStatus === 'pending' ? 'Chờ xác minh' : 'Bị từ chối'}
                          </span>
                          <a
                            href={doc.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-500 text-sm"
                          >
                            Xem tài liệu
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Chưa có tài liệu nào được tải lên
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Kỹ năng ({application.skills.length})
              </h3>
            </div>
            <div className="p-6">
              {application.skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {application.skills.map((skill) => (
                    <div key={skill.helperSkillId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Dịch vụ ID: {skill.serviceId}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Kinh nghiệm: {skill.yearsOfExperience} năm
                          </p>
                        </div>
                        {skill.isPrimarySkill && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Kỹ năng chính
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Chưa có kỹ năng nào được đăng ký
                </div>
              )}
            </div>
          </div>

          {/* Work Areas */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Khu vực làm việc ({application.workAreas.length})
              </h3>
            </div>
            <div className="p-6">
              {application.workAreas.length > 0 ? (
                <div className="space-y-4">
                  {application.workAreas.map((area) => (
                    <div key={area.workAreaId} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        {area.city} - {area.district}
                        {area.ward && ` - ${area.ward}`}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Bán kính: {area.radiusKm} km
                      </p>
                      <p className="text-sm text-gray-500">
                        Tọa độ: {area.latitude}, {area.longitude}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Chưa có khu vực làm việc nào được đăng ký
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Summary */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Tóm tắt</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Ngày đăng ký</label>
                <p className="text-sm text-gray-900">{formatDate(application.registrationDate)}</p>
              </div>
              {application.approvalDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày duyệt</label>
                  <p className="text-sm text-gray-900">{formatDate(application.approvalDate)}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Tổng tài liệu</label>
                <p className="text-sm text-gray-900">{application.totalDocuments}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Đã xác minh</label>
                <p className="text-sm text-gray-900">{application.verifiedDocuments}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Chờ xác minh</label>
                <p className="text-sm text-gray-900">{application.pendingDocuments}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Trạng thái tài khoản</label>
                <p className="text-sm text-gray-900">
                  {application.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Modal */}
      {showDecisionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Xử lý đơn đăng ký
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quyết định
                  </label>
                  <select
                    value={decisionStatus}
                    onChange={(e) => setDecisionStatus(e.target.value as any)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="approved">Duyệt đơn</option>
                    <option value="rejected">Từ chối</option>
                    <option value="revision_requested">Yêu cầu chỉnh sửa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhận xét
                  </label>
                  <textarea
                    value={decisionComment}
                    onChange={(e) => setDecisionComment(e.target.value)}
                    rows={4}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Nhập nhận xét về quyết định..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowDecisionModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDecision}
                  disabled={decisionLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {decisionLoading ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetail; 
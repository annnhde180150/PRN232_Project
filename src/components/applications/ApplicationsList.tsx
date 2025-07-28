'use client';

import React, { useState, useEffect } from 'react';
import { applicationsAPI } from '../../lib/api';
import {
  HelperApplication,
  ApplicationStatus,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  ApplicationDecisionRequest
} from '../../types/applications';

interface ApplicationsListProps {
  onApplicationSelect: (helperId: number) => void;
  refreshTrigger?: number;
  onDecisionMade?: () => void;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({
  onApplicationSelect,
  refreshTrigger,
  onDecisionMade
}) => {
  const [applications, setApplications] = useState<HelperApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | ''>('');
  const [pageSize] = useState(20);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  const statusOptions: { value: ApplicationStatus | ''; label: string }[] = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'Pending', label: 'Đang chờ duyệt' },
    { value: 'approved', label: 'Đã duyệt' },
    { value: 'rejected', label: 'Đã từ chối' },
    { value: 'revision_requested', label: 'Yêu cầu chỉnh sửa' },
  ];

  useEffect(() => {
    fetchApplications();
  }, [currentPage, selectedStatus, refreshTrigger]);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await applicationsAPI.getApplications(
        selectedStatus || undefined,
        currentPage,
        pageSize
      );

      if (response.success) {
        setApplications(response.data.applications);
        setTotalPages(response.data.pagination.totalPages);
        setTotalCount(response.data.pagination.totalCount);
      } else {
        setError('Không thể tải danh sách đơn đăng ký');
      }
    } catch (err: any) {
      setError('Đã xảy ra lỗi khi tải dữ liệu');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status: ApplicationStatus | '') => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  const handleQuickDecision = async (helperId: number, status: 'approved' | 'rejected', defaultComment?: string) => {
    const comment = defaultComment || prompt(
      status === 'approved' 
        ? 'Nhập lý do duyệt đơn (tùy chọn):' 
        : 'Nhập lý do từ chối đơn:'
    );

    if (status === 'rejected' && !comment?.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    setProcessingIds(prev => new Set(prev).add(helperId));

    try {
      const decisionRequest: ApplicationDecisionRequest = {
        status,
        comment: comment?.trim() || (status === 'approved' ? 'Đơn đăng ký đã được duyệt' : '')
      };

      const response = await applicationsAPI.makeDecision(helperId, decisionRequest);
      
      if (response.success) {
        alert(status === 'approved' ? 'Đã duyệt đơn thành công!' : 'Đã từ chối đơn thành công!');
        fetchApplications(); // Reload danh sách
        onDecisionMade?.(); // Gọi callback để thông báo đã có quyết định
      } else {
        alert('Không thể xử lý đơn đăng ký. Vui lòng thử lại.');
      }
    } catch (err: any) {
      alert('Đã xảy ra lỗi khi xử lý đơn đăng ký');
      console.error('Error making quick decision:', err);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(helperId);
        return newSet;
      });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Trước
      </button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border-t border-b border-r border-gray-300 ${
            i === currentPage
              ? 'bg-indigo-50 text-indigo-600 border-indigo-500'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sau
      </button>
    );

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Hiển thị {Math.min((currentPage - 1) * pageSize + 1, totalCount)} - {Math.min(currentPage * pageSize, totalCount)} trong tổng số {totalCount} kết quả
        </div>
        <div className="flex">{pages}</div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Đơn đăng ký người giúp việc
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Quản lý và duyệt các đơn đăng ký từ người giúp việc
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus | '')}
              className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={fetchApplications}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="px-6 py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      )}

      {/* Applications table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người giúp việc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dịch vụ chính
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
                <tr key={application.helperId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.fullName}
                      </div>
                      <div className="text-sm text-gray-500">ID: {application.helperId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.email}</div>
                    <div className="text-sm text-gray-500">{application.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.primaryService}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div>Tài liệu: {application.documentCount}</div>
                      <div>Kỹ năng: {application.skillCount}</div>
                      <div>Khu vực: {application.workAreaCount}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      APPLICATION_STATUS_COLORS[application.approvalStatus]
                    }`}>
                      {APPLICATION_STATUS_LABELS[application.approvalStatus]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(application.registrationDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {application.approvalStatus === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleQuickDecision(application.helperId, 'approved')}
                            disabled={processingIds.has(application.helperId)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingIds.has(application.helperId) ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            ) : (
                              'Duyệt'
                            )}
                          </button>
                          <button
                            onClick={() => handleQuickDecision(application.helperId, 'rejected')}
                            disabled={processingIds.has(application.helperId)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingIds.has(application.helperId) ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            ) : (
                              'Từ chối'
                            )}
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => onApplicationSelect(application.helperId)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {applications.length === 0 && (
            <div className="text-center py-12">
              <div className="text-sm text-gray-500">
                Không tìm thấy đơn đăng ký nào phù hợp với bộ lọc
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && renderPagination()}
    </div>
  );
};

export default ApplicationsList;

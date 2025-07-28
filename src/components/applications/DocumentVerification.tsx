'use client';

import React, { useState } from 'react';
import { documentAPI } from '../../lib/api';
import { HelperDocumentDetail } from '../../types/applications';
import { CheckCircle, XCircle, Clock, Eye, FileText } from 'lucide-react';

interface DocumentVerificationProps {
  document: HelperDocumentDetail;
  onVerificationUpdate: () => void;
  adminId: number;
}

const DocumentVerification: React.FC<DocumentVerificationProps> = ({
  document,
  onVerificationUpdate,
  adminId
}) => {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'Pending' | 'Approved' | 'Rejected' | 'Under Review'>(
    document.verificationStatus
  );
  const [notes, setNotes] = useState(document.notes || '');
  const [loading, setLoading] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Under Review':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Đã chấp nhận</span>;
      case 'Rejected':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Đã từ chối</span>;
      case 'Pending':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Đang chờ</span>;
      case 'Under Review':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Đang xem xét</span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Không xác định</span>;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'CV':
        return 'Sơ yếu lý lịch';
      case 'ID':
        return 'Chứng minh nhân dân';
      default:
        return type;
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

  const handleVerification = async () => {
    if (!notes.trim()) {
      alert('Vui lòng nhập ghi chú cho quyết định');
      return;
    }

    setLoading(true);

    try {
      const response = await documentAPI.updateDocumentStatus(
        document.documentId,
        verificationStatus,
        adminId,
        notes
      );

      if (response.success) {
        alert('Đã cập nhật trạng thái tài liệu thành công');
        setShowVerificationModal(false);
        onVerificationUpdate();
      } else {
        alert('Không thể cập nhật trạng thái tài liệu');
      }
    } catch (err: any) {
      alert('Đã xảy ra lỗi khi cập nhật trạng thái tài liệu');
      console.error('Error updating document status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <FileText className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="text-sm font-medium text-gray-900">
                  {getDocumentTypeLabel(document.documentType)}
                </h4>
                {getStatusIcon(document.verificationStatus)}
                {getStatusBadge(document.verificationStatus)}
              </div>
              
              <div className="space-y-1 text-sm text-gray-500">
                <div>Tải lên: {formatDate(document.uploadDate)}</div>
                {document.verificationDate && (
                  <div>Xác minh: {formatDate(document.verificationDate)}</div>
                )}
                {document.notes && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                    <strong>Ghi chú:</strong> {document.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => window.open(document.documentUrl, '_blank')}
              className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Eye className="w-3 h-3 mr-1" />
              Xem
            </button>
            <button
              onClick={() => setShowVerificationModal(true)}
              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Xác minh
            </button>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Xác minh tài liệu
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại tài liệu
                  </label>
                  <p className="text-sm text-gray-900">{getDocumentTypeLabel(document.documentType)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={verificationStatus}
                    onChange={(e) => setVerificationStatus(e.target.value as any)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="Approved">Chấp nhận</option>
                    <option value="Rejected">Từ chối</option>
                    <option value="Pending">Chờ xử lý</option>
                    <option value="Under Review">Đang xem xét</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Nhập ghi chú về quyết định..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleVerification}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentVerification; 
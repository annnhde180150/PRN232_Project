import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface Document {
  documentType: 'CV' | 'ID';
  documentUrl: string;
  uploadDate: string;
  verificationStatus: string;
  verifiedByAdminId?: number;
  verificationDate?: string;
  notes?: string;
}

interface DocumentsDisplayProps {
  documents: Document[];
}

export const DocumentsDisplay: React.FC<DocumentsDisplayProps> = ({ documents }) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-muted/10">
        <p className="text-sm text-muted-foreground text-center">
          Chưa có tài liệu nào được đăng tải
        </p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Under Review':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800">Đã xác thực</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800">Bị từ chối</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Đang chờ</Badge>;
      case 'Under Review':
        return <Badge className="bg-blue-100 text-blue-800">Đang xem xét</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
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
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-3">
      {documents.map((doc, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <FileText className="w-4 h-4 text-primary mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">
                    {getDocumentTypeLabel(doc.documentType)}
                  </h4>
                  {getStatusIcon(doc.verificationStatus)}
                  {getStatusBadge(doc.verificationStatus)}
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>Ngày đăng tải: {formatDate(doc.uploadDate)}</div>
                  
                  {doc.verificationDate && (
                    <div>Ngày xác thực: {formatDate(doc.verificationDate)}</div>
                  )}
                  
                  {doc.notes && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                      <strong>Ghi chú:</strong> {doc.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(doc.documentUrl, '_blank')}
                className="flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Xem
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}; 
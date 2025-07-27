'use client';

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Shield,
  CheckCircle,
  Star,
  Clock,
  Users,
  Award,
  Lock,
  Phone
} from 'lucide-react';

interface TrustIndicatorProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  value?: string;
  color?: string;
}

const TrustIndicator: React.FC<TrustIndicatorProps> = ({
  icon: Icon,
  title,
  description,
  value,
  color = 'text-blue-600'
}) => (
  <div className="text-center p-4">
    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-3`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
    {value && (
      <div className="text-2xl font-bold text-blue-600 mb-1">{value}</div>
    )}
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

interface VerificationBadgeProps {
  type: 'identity' | 'background' | 'skill' | 'insurance';
  verified: boolean;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type,
  verified,
  className = ''
}) => {
  const badgeConfig = {
    identity: {
      icon: CheckCircle,
      label: 'Danh tính',
      color: verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
    },
    background: {
      icon: Shield,
      label: 'Lý lịch',
      color: verified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
    },
    skill: {
      icon: Award,
      label: 'Kỹ năng',
      color: verified ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
    },
    insurance: {
      icon: Lock,
      label: 'Bảo hiểm',
      color: verified ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'
    }
  };

  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} ${className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
      {verified && <CheckCircle className="w-3 h-3 ml-1" />}
    </Badge>
  );
};

interface SafetyFeaturesProps {
  features: {
    emergencyContact: boolean;
    locationSharing: boolean;
    securePayment: boolean;
    support24h: boolean;
    insurance: boolean;
  };
}

export const SafetyFeatures: React.FC<SafetyFeaturesProps> = ({ features }) => (
  <Card className="bg-green-50 border-green-200">
    <CardContent className="p-6">
      <div className="flex items-center mb-4">
        <Shield className="w-6 h-6 text-green-600 mr-2" />
        <h3 className="text-lg font-semibold text-green-900">An toàn & Bảo mật</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {features.emergencyContact && (
          <div className="flex items-center text-green-800">
            <Phone className="w-4 h-4 mr-2" />
            <span className="text-sm">Liên hệ khẩn cấp</span>
          </div>
        )}
        
        {features.locationSharing && (
          <div className="flex items-center text-green-800">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">Chia sẻ vị trí real-time</span>
          </div>
        )}
        
        {features.securePayment && (
          <div className="flex items-center text-green-800">
            <Lock className="w-4 h-4 mr-2" />
            <span className="text-sm">Thanh toán bảo mật</span>
          </div>
        )}
        
        {features.support24h && (
          <div className="flex items-center text-green-800">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">Hỗ trợ 24/7</span>
          </div>
        )}
        
        {features.insurance && (
          <div className="flex items-center text-green-800">
            <Shield className="w-4 h-4 mr-2" />
            <span className="text-sm">Bảo hiểm toàn diện</span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export const TrustIndicators: React.FC = () => {
  const indicators = [
    {
      icon: Users,
      title: 'Helpers Đã Xác Thực',
      value: '1,000+',
      description: 'Đã kiểm tra lý lịch và kỹ năng',
      color: 'text-blue-600'
    },
    {
      icon: Star,
      title: 'Đánh Giá Trung Bình',
      value: '4.8/5',
      description: 'Từ hơn 10,000 khách hàng',
      color: 'text-yellow-500'
    },
    {
      icon: Shield,
      title: 'Bảo Hiểm Toàn Diện',
      value: '100%',
      description: 'Mọi dịch vụ đều được bảo hiểm',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      title: 'Hỗ Trợ 24/7',
      value: '24/7',
      description: 'Luôn sẵn sàng hỗ trợ bạn',
      color: 'text-purple-600'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tại Sao Chọn Homezy?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến trải nghiệm an toàn, tin cậy và chất lượng cao nhất
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {indicators.map((indicator, index) => (
            <TrustIndicator key={index} {...indicator} />
          ))}
        </div>

        {/* Additional Trust Elements */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Xác Thực Danh Tính</h3>
            <p className="text-sm text-gray-600">
              Tất cả helpers đều được xác thực CMND/CCCD và kiểm tra lý lịch
            </p>
          </Card>

          <Card className="text-center p-6">
            <Lock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Thanh Toán An Toàn</h3>
            <p className="text-sm text-gray-600">
              Hệ thống thanh toán được mã hóa và bảo mật theo chuẩn quốc tế
            </p>
          </Card>

          <Card className="text-center p-6">
            <Award className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Chất Lượng Đảm Bảo</h3>
            <p className="text-sm text-gray-600">
              Cam kết hoàn tiền 100% nếu không hài lòng với dịch vụ
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};
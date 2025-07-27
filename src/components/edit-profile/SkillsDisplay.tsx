import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Star, Clock, Briefcase } from 'lucide-react';
import { getAllServices, Service } from '@/lib/api';

interface Skill {
  serviceId: number;
  serviceName?: string;
  yearsOfExperience: number;
  isPrimarySkill: boolean;
}

interface SkillsDisplayProps {
  skills: Skill[];
}

export const SkillsDisplay: React.FC<SkillsDisplayProps> = ({ skills }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await getAllServices();
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getServiceName = (serviceId: number) => {
    const service = services.find(s => s.serviceId === serviceId);
    return service ? service.serviceName : `Dịch vụ #${serviceId}`;
  };

  if (!skills || skills.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-muted/10">
        <p className="text-sm text-muted-foreground text-center">
          Chưa có kỹ năng nào được đăng ký
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-muted/10">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
          <p className="text-sm text-muted-foreground">Đang tải thông tin kỹ năng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {skills.map((skill, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-primary" />
              <div>
                <h4 className="font-medium">
                  {getServiceName(skill.serviceId)}
                </h4>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{skill.yearsOfExperience} năm kinh nghiệm</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {skill.isPrimarySkill && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-600" />
                  Kỹ năng chính
                </Badge>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}; 
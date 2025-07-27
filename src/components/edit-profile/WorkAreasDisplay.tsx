import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';

interface WorkArea {
  city: string;
  district: string;
  ward: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
}

interface WorkAreasDisplayProps {
  workAreas: WorkArea[];
}

export const WorkAreasDisplay: React.FC<WorkAreasDisplayProps> = ({ workAreas }) => {
  if (!workAreas || workAreas.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-muted/10">
        <p className="text-sm text-muted-foreground text-center">
          Chưa có khu vực làm việc nào được đăng ký
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {workAreas.map((area, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">
                  {area.ward}, {area.district}, {area.city}
                </h4>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Navigation className="w-3 h-3" />
                    <span>Bán kính: {area.radiusKm}km</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Tọa độ: {area.latitude.toFixed(6)}, {area.longitude.toFixed(6)}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Khu vực #{index + 1}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}; 
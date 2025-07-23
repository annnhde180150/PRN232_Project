import React from 'react';
import { ReportPeriod } from '../../types/reports';

interface PeriodSelectorProps {
  selectedPeriod: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
  className?: string;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  className = ''
}) => {
  const periods: { key: ReportPeriod; label: string }[] = [
    { key: 'day', label: 'Ngày' },
    { key: 'week', label: 'Tuần' },
    { key: 'month', label: 'Tháng' },
    { key: 'quarter', label: 'Quý' },
    { key: 'year', label: 'Năm' },
  ];

  return (
    <div className={`flex rounded-lg bg-gray-100 p-1 ${className}`}>
      {periods.map((period) => (
        <button
          key={period.key}
          type="button"
          onClick={() => onPeriodChange(period.key)}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            selectedPeriod === period.key
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector; 
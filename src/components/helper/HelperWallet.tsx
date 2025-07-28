import { useEffect, useState } from 'react';
import { getHelperWallet } from '@/lib/helper-api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { FaMoneyBillWave } from 'react-icons/fa';

interface WalletInfo {
  walletId: number;
  helperId: number;
  balance: number;
  lastUpdatedTime: string;
  currencyCode: string;
}

interface HelperWalletProps {
  helperId: number;
}

export const HelperWallet = ({ helperId }: HelperWalletProps) => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWalletInfo = async () => {
      try {
        const response = await getHelperWallet(helperId);
        if (response.success) {
          setWalletInfo(response.data);
        } else {
          toast.error('Failed to get wallet information');
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
        toast.error('Failed to get wallet information');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletInfo();
  }, [helperId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!walletInfo) {
    return (
      <div className="text-center p-4 text-red-500">
        No wallet information available
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: walletInfo.currencyCode
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const handleWithdraw = () => {
    toast('Chức năng rút tiền sẽ sớm được cập nhật!', {
      icon: '💰',
      duration: 3000
    });
  };

  const getHelperName = () => {
    if (!user) return 'Helper';
    if ('fullName' in user) return user.fullName;
    return 'Helper';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Ví của Helper</h2>
        <button
          onClick={handleWithdraw}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FaMoneyBillWave className="text-lg" />
          <span>Rút Tiền</span>
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Helper Name */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="block text-sm text-gray-500">Tên Helper</span>
          <span className="font-medium text-gray-700">
            {getHelperName()}
          </span>
        </div>

        {/* Current Balance */}
        <div className="flex justify-between items-center p-6 bg-blue-50 rounded-lg">
          <span className="text-gray-600">Số Dư Hiện Tại</span>
          <span className="text-3xl font-bold text-blue-600">
            {formatCurrency(walletInfo.balance)}
          </span>
        </div>

        {/* Last Updated */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <span className="block text-sm text-gray-500">Cập Nhật Lần Cuối</span>
          <span className="font-medium text-gray-700">
            {formatDate(walletInfo.lastUpdatedTime)}
          </span>
        </div>
      </div>
    </div>
  );
}; 
import axios from 'axios';

const baseURL = 'https://helper-finder.azurewebsites.net';

interface WalletResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    walletId: number;
    helperId: number;
    balance: number;
    lastUpdatedTime: string;
    currencyCode: string;
  };
}

interface AddMoneyResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    isSuccess: boolean;
    message: string;
  };
}

export const getHelperWallet = async (helperId: number) => {
  try {
    const response = await axios.get<WalletResponse>(
      `${baseURL}/api/Helper/ViewIncome/${helperId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error getting helper wallet:', error);
    throw error;
  }
};

export const addMoneyToWallet = async (helperId: number, amount: number) => {
  try {
    const response = await axios.put<AddMoneyResponse>(
      `${baseURL}/api/Helper/addMoneyToWallet`,
      {
        helperId,
        amount
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding money to wallet:', error);
    throw error;
  }
}; 
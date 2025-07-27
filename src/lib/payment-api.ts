import axios from 'axios';
import crypto from 'crypto';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://helper-finder.azurewebsites.net';

interface PaymentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    paymentId: number;
    bookingId: number;
    userId: number;
    helperId: number;
    amount: number;
    paymentDate: string;
  };
}

interface UpdatePaymentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    paymentId: number;
    bookingId: number;
    userId: number;
    amount: number;
    paymentStatus: string;
  };
}

const TMN_CODE = 'XL9GZ0FP';
const HASH_SECRET = 'W4QW5YJI25H8K537YIZ5027QFGFN8K98';
const VNPAY_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

export const getPaymentInfo = async (userId: number, bookingId: number) => {
  try {
    const response = await axios.get<PaymentResponse>(
      `${baseURL}/api/Payment/GetPayment?userId=${userId}&bookingId=${bookingId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePaymentStatus = async (paymentId: number, action: 'Success' | 'Cancelled') => {
  try {
    const response = await axios.post<UpdatePaymentResponse>(
      `${baseURL}/api/Payment/UpdatePayment`,
      {
        paymentId,
        action,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generate random transaction reference (giống Android)
function generateRandom6DigitNumber(): string {
  let result = '';
  for (let i = 0; i < 5; i++) {
    const randomNumber = Math.floor(Math.random() * 9) + 1;
    result += randomNumber.toString();
  }
  return result;
}

// HMAC SHA512 function (giống Android)
function hmacSHA512(key: string, data: string): string {
  try {
    if (!key || !data) {
      throw new Error('Key and data cannot be null');
    }
    
    const hmac = crypto.createHmac('sha512', key);
    hmac.update(data, 'utf8');
    return hmac.digest('hex');
  } catch (error) {
    console.error('Error creating HMAC:', error);
    return '';
  }
}

export const createVnpayPaymentUrl = async (
  amount: number,
  paymentId: number,
  returnUrl: string,
  ipAddr?: string
) => {
  try {
    // Tạo timestamp giống Android
    const date = new Date();
    const createDate = `${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date
      .getHours()
      .toString()
      .padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;

    // Tạo transaction reference
    const vnp_TxnRef = generateRandom6DigitNumber();
    
    // Tạo parameters giống Android
    const vnp_Params: { [key: string]: string } = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: TMN_CODE,
      vnp_Amount: (amount * 100).toString(), // VNPay yêu cầu amount * 100
      vnp_CurrCode: 'VND', // Android dùng 'vnd' nhưng standard là 'VND'
      vnp_BankCode: 'NCB',
      vnp_TxnRef: vnp_TxnRef,
      vnp_OrderInfo: 'Thanh+toan+don+hang', // Giống Android
      vnp_OrderType: 'other',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr || '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    // Sắp xếp các field names (giống Android)
    const fieldNames = Object.keys(vnp_Params).sort();
    
    const hashData: string[] = [];
    const query: string[] = [];
    
    // Build hash data và query giống Android
    for (const fieldName of fieldNames) {
      const fieldValue = vnp_Params[fieldName];
      
      if (fieldValue && fieldValue.length > 0) {
        try {
          // Encode giống Android - sử dụng encodeURIComponent thay vì URLEncoder.encode với US-ASCII
          const encodedFieldName = encodeURIComponent(fieldName);
          const encodedFieldValue = encodeURIComponent(fieldValue);
          
          // Build hash data - fieldName KHÔNG encode trong hash data (giống Android)
          hashData.push(`${fieldName}=${encodedFieldValue}`);
          
          // Build query - cả fieldName và fieldValue đều encode
          query.push(`${encodedFieldName}=${encodedFieldValue}`);
        } catch (error) {
          console.error('Error encoding field:', error);
        }
      }
    }
    
    // Join với & 
    const hashDataStr = hashData.join('&');
    const queryStr = query.join('&');
    
    console.log('Hash Data String:', hashDataStr);
    console.log('Query String:', queryStr);
    
    // Tạo hash 
    const vnp_SecureHash = hmacSHA512(HASH_SECRET, hashDataStr);
    
    console.log('Generated Hash:', vnp_SecureHash);
    
    // Build final URL
    const finalUrl = `${VNPAY_URL}?${queryStr}&vnp_SecureHash=${vnp_SecureHash}`;
    
    console.log('Final URL:', finalUrl);
    
    return finalUrl;
  } catch (error) {
    console.error('Error creating VNPay payment URL:', error);
    throw error;
  }
};

// Function để verify return URL 
export const verifyVnpayReturn = (vnpParams: any): boolean => {
  try {
    const secureHash = vnpParams.vnp_SecureHash;
    

    const paramsToVerify = { ...vnpParams };
    delete paramsToVerify.vnp_SecureHash;
    delete paramsToVerify.vnp_SecureHashType;
    

    const fieldNames = Object.keys(paramsToVerify).sort();
    
    const hashData: string[] = [];
    

    for (const fieldName of fieldNames) {
      const fieldValue = paramsToVerify[fieldName];
      
      if (fieldValue && fieldValue.toString().length > 0) {
        const encodedFieldValue = encodeURIComponent(fieldValue.toString());
        hashData.push(`${fieldName}=${encodedFieldValue}`);
      }
    }
    
    const hashDataStr = hashData.join('&');
    const calculatedHash = hmacSHA512(HASH_SECRET, hashDataStr);
    
    console.log('Verify Hash Data:', hashDataStr);
    console.log('Received Hash:', secureHash);
    console.log('Calculated Hash:', calculatedHash);
    
    return secureHash === calculatedHash;
  } catch (error) {
    console.error('Error verifying VNPay return:', error);
    return false;
  }
};

// Response code mapping
export const getVnpayResponseMessage = (responseCode: string): string => {
  const messages: { [key: string]: string } = {
    '00': 'Giao dịch thành công',
    '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
    '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ Internet Banking tại ngân hàng.',
    '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
    '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
    '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
    '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
    '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
    '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
    '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
    '75': 'Ngân hàng thanh toán đang bảo trì.',
    '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
    '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
  };
  
  return messages[responseCode] || 'Lỗi không xác định';
};
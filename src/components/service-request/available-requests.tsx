import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { serviceRequestApi } from '@/lib/api/service-request';
import { bookingAPI } from '@/lib/booking-api';
import { addressAPI } from '@/lib/api';
import { ServiceRequest } from '@/types/service-request';
import { Address } from '@/types/service-request';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

interface AvailableRequestsProps {
  helperId: number;
}

interface RequestWithAddress extends ServiceRequest {
  address?: Address;
}

export const AvailableRequests: React.FC<AvailableRequestsProps> = ({ helperId }) => {
  const [requests, setRequests] = useState<RequestWithAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [acceptingRequestId, setAcceptingRequestId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAvailableRequests = async () => {
      try {
        setLoading(true);
        const response = await serviceRequestApi.getAvailableRequests();
        if (response.success) {
          // Fetch address information for each request
          const requestsWithAddresses = await Promise.all(
            response.data.map(async (request) => {
              try {
                const addressData = await addressAPI.getAddress(request.addressId);
                return {
                  ...request,
                  address: addressData
                };
              } catch (error) {
                console.error(`Error fetching address for request ${request.requestId}:`, error);
                return {
                  ...request,
                  address: undefined
                };
              }
            })
          );
          setRequests(requestsWithAddresses);
        }
      } catch (error) {
        console.error('Error fetching available requests:', error);
        toast.error('Không thể tải danh sách yêu cầu có sẵn');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableRequests();
  }, []);

  const handleAcceptRequest = async (requestId: number) => {
    try {
      setAcceptingRequestId(requestId);
      const success = await bookingAPI.acceptRequest(requestId, helperId);
      
      if (success) {
        toast.success('Chấp nhận yêu cầu thành công');
        // Remove the accepted request from the list
        setRequests(requests.filter(req => req.requestId !== requestId));
      } else {
        toast.error('Không thể chấp nhận yêu cầu');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Đã xảy ra lỗi khi chấp nhận yêu cầu');
    } finally {
      setAcceptingRequestId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Đang tải danh sách yêu cầu...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Không có yêu cầu nào có sẵn.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {requests.map((request) => (
        <Card key={request.requestId} className="overflow-hidden">
          <CardHeader>
            <CardTitle>Yêu cầu dịch vụ #{request.requestId}</CardTitle>
            <CardDescription>
              ID Dịch vụ: {request.serviceId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Thời gian bắt đầu:</span>
                <span>{formatDate(request.requestedStartTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Thời lượng:</span>
                <span>{request.requestedDurationHours} giờ</span>
              </div>
              {request.address && (
                <div className="mt-2">
                  <span className="font-medium">Địa chỉ:</span>
                  <p className="text-sm mt-1 text-gray-600">{request.address.fullAddress}</p>
                </div>
              )}
              {request.specialNotes && (
                <div className="mt-2">
                  <span className="font-medium">Ghi chú:</span>
                  <p className="text-sm mt-1">{request.specialNotes}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white" 
              onClick={() => handleAcceptRequest(request.requestId)}
              disabled={acceptingRequestId === request.requestId}
            >
              {acceptingRequestId === request.requestId ? 'Đang chấp nhận...' : 'Chấp nhận yêu cầu'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default AvailableRequests; 
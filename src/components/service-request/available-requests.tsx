import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { serviceRequestApi } from '@/lib/api/service-request';
import { bookingAPI } from '@/lib/booking-api';
import { ServiceRequest } from '@/types/service-request';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

interface AvailableRequestsProps {
  helperId: number;
}

export const AvailableRequests: React.FC<AvailableRequestsProps> = ({ helperId }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [acceptingRequestId, setAcceptingRequestId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAvailableRequests = async () => {
      try {
        setLoading(true);
        const response = await serviceRequestApi.getAvailableRequests();
        if (response.success) {
          setRequests(response.data);
        }
      } catch (error) {
        console.error('Error fetching available requests:', error);
        toast.error('Failed to load available requests');
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
        toast.success('Request accepted successfully');
        // Remove the accepted request from the list
        setRequests(requests.filter(req => req.requestId !== requestId));
      } else {
        toast.error('Failed to accept request');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('An error occurred while accepting the request');
    } finally {
      setAcceptingRequestId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading available requests...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>No available requests found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {requests.map((request) => (
        <Card key={request.requestId} className="overflow-hidden">
          <CardHeader>
            <CardTitle>Service Request #{request.requestId}</CardTitle>
            <CardDescription>
              Service ID: {request.serviceId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Start Time:</span>
                <span>{formatDate(request.requestedStartTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Duration:</span>
                <span>{request.requestedDurationHours} hours</span>
              </div>
              {request.specialNotes && (
                <div className="mt-2">
                  <span className="font-medium">Special Notes:</span>
                  <p className="text-sm mt-1">{request.specialNotes}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => handleAcceptRequest(request.requestId)}
              disabled={acceptingRequestId === request.requestId}
            >
              {acceptingRequestId === request.requestId ? 'Accepting...' : 'Accept Request'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default AvailableRequests; 
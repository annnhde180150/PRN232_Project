'use client';

import { useState, useEffect } from 'react';
import { AvailableRequests } from '@/components/service-request';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';

export default function AvailableRequestsPage() {
  const [helperId, setHelperId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get helper ID from local storage
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData.role === 'Helper') {
          setHelperId(parsedUserData.id);
        } else {
          // If user is not a helper, redirect to dashboard
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
      }
    } else {
      // If no user data, redirect to login
      router.push('/login');
    }
  }, [router]);

  if (!helperId) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-40">
              <p>Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Available Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="available">Available Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="available" className="mt-6">
              <AvailableRequests helperId={helperId} />
            </TabsContent>
            <TabsContent value="accepted" className="mt-6">
              <p className="text-center text-gray-500">
                View your accepted requests in the Active Bookings section.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Filter, RefreshCw } from 'lucide-react';
import { bookingAPI } from '@/lib/booking-api';
import { Booking, PendingBooking, BookingStatus, BookingFilter } from '@/types/bookings';
import { authUtils } from '@/lib/api';
import { BookingCard } from '@/components/bookings';

const BookingHistoryPage = () => {
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<(Booking | PendingBooking)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<BookingFilter>({});
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const userData = authUtils.getUserData();
    if (userData.user && 'id' in userData.user) {
      setUserId(userData.user.id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  useEffect(() => {
    applyFilters();
  }, [activeBookings, pendingBookings, filter]);

  const fetchBookings = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await bookingAPI.getBookingsWithFilter(userId, filter);
      setActiveBookings(result.active);
      setPendingBookings(result.pending);
    } catch (err) {
      setError('Failed to fetch booking history');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...activeBookings, ...pendingBookings];

    if (filter.status) {
      filtered = filtered.filter(booking => booking.status === filter.status);
    }

    if (filter.startDate) {
      const startDate = new Date(filter.startDate);
      filtered = filtered.filter(booking => 
        new Date(booking.scheduledStartTime) >= startDate
      );
    }

    if (filter.endDate) {
      const endDate = new Date(filter.endDate);
      filtered = filtered.filter(booking => 
        new Date(booking.scheduledStartTime) <= endDate
      );
    }

    // Sort by scheduled start time (newest first)
    filtered.sort((a, b) => 
      new Date(b.scheduledStartTime).getTime() - new Date(a.scheduledStartTime).getTime()
    );

    setFilteredBookings(filtered);
  };



  const clearFilters = () => {
    setFilter({});
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading booking history...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchBookings} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking History</h1>
        <p className="text-gray-600">View and manage your service bookings</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={filter.status || 'All'}
                onValueChange={(value) => setFilter(prev => ({ 
                  ...prev, 
                  status: value === 'All' ? undefined : value as BookingStatus 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="InProgress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={filter.startDate || ''}
                onChange={(e) => setFilter(prev => ({ ...prev, startDate: e.target.value || undefined }))}
              />
            </div>

            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={filter.endDate || ''}
                onChange={(e) => setFilter(prev => ({ ...prev, endDate: e.target.value || undefined }))}
              />
            </div>

            <div className="flex items-end space-x-2">
              <Button onClick={clearFilters} variant="outline" className="flex-1">
                Clear Filters
              </Button>
              <Button onClick={fetchBookings} variant="outline">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
          </p>
          {Object.keys(filter).length > 0 && (
            <Badge variant="secondary">
              Filters Applied
            </Badge>
          )}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {Object.keys(filter).length > 0 
                  ? 'Try adjusting your filters to see more results.'
                  : 'You haven\'t made any bookings yet.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.bookingId} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage; 
export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
    requestId: string;
}

export interface Address {
    addressId: number;
    userId: number;
    addressLine1: string;
    addressLine2?: string;
    ward: string;
    district: string;
    city: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
    isDefault: boolean;
}

export interface Service {
    serviceId: number;
    serviceName: string;
    description: string;
    iconUrl?: string;
    basePrice: number;
    priceUnit: string;
    isActive: boolean;
    parentServiceId?: number;
}

export interface ServiceRequest {
    requestId: number;
    userId: number;
    serviceId: number;
    addressId: number;
    requestedStartTime: string;
    requestedDurationHours: number;
    specialNotes?: string;
    status: 'Pending' | 'Cancelled' | 'Completed' | 'InProgress';
    requestCreationTime?: string;
    latitude?: number;
    longitude?: number;
}

export interface CreateServiceRequestData {
    userId: number;
    serviceId: number;
    addressId: number;
    requestedStartTime: string;
    requestedDurationHours: number;
    specialNotes?: string;
}

export interface Booking {
    bookingId: number;
    userId: number;
    serviceId: number;
    requestId: number;
    helperId: number;
    scheduledStartTime: string;
    scheduledEndTime: string;
    actualStartTime?: string;
    actualEndTime?: string;
    status: 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';
    cancellationReason?: string;
    cancelledBy?: string;
    cancellationTime?: string;
    freeCancellationDeadline: string;
    estimatedPrice: number;
    finalPrice?: number;
    bookingCreationTime?: string;
}

export interface BookHelperData {
    userId: number;
    serviceId: number;
    addressId: number;
    requestedStartTime: string;
    requestedDurationHours: number;
    specialNotes?: string;
}

export interface CancelBookingData {
    bookingId: number;
    cancellationReason: string;
    cancelledBy: 'User' | 'Helper';
}

export interface Review {
    reviewId: number;
    bookingId: number;
    helperId: number;
    userId: number;
    rating: number;
    comment: string;
    reviewDate: string;
}

export interface BookingServiceName {
    bookingId: number;
    serviceName: string;
}

export interface HelperApplication {
    applicationId: number;
    requestId: number;
    helperId: number;
    helperName: string;
    helperAvatar?: string;
    applicationTime: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
    helperRating?: number;
    completedJobs?: number;
}

export interface HelperApplicationResponse {
    applicationId: number;
    requestId: number;
    helperId: number;
    accepted: boolean;
}

export interface HelperProfile {
    helperId: number;
    userId: number;
    name: string;
    avatar?: string;
    bio?: string;
    rating: number;
    completedJobs: number;
    services: Service[];
}
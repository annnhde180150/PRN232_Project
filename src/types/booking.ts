// Booking Flow Types
export interface BookingStep {
    id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    isActive: boolean;
}

export interface ServiceSelection {
    serviceId: string;
    serviceName: string;
    category: string;
    icon?: React.ReactNode;
    priceRange: {
        min: number;
        max: number;
        currency: string;
    };
    duration: string;
    description?: string;
}

export interface DateTimeSelection {
    date: Date;
    startTime: string;
    endTime?: string;
    duration?: number; // in hours
    isFlexible: boolean;
    preferredTimeSlots?: string[];
}

export interface AddressInfo {
    id?: string;
    fullAddress: string;
    ward: string;
    district: string;
    city: string;
    latitude?: number;
    longitude?: number;
    addressType: 'home' | 'office' | 'other';
    contactName?: string;
    contactPhone?: string;
    specialInstructions?: string;
}

export interface BookingFormData {
    serviceSelection: ServiceSelection;
    dateTime: DateTimeSelection;
    address: AddressInfo;
    specialInstructions?: string;
    estimatedPrice?: number;
    helperId?: string;
}

export interface BookingValidationErrors {
    serviceSelection?: string;
    dateTime?: string;
    address?: string;
    specialInstructions?: string;
}

export interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    price?: number;
}

export interface AvailableDate {
    date: Date;
    timeSlots: TimeSlot[];
    isFullyBooked: boolean;
}

// Address autocomplete types
export interface AddressSuggestion {
    id: string;
    fullAddress: string;
    ward: string;
    district: string;
    city: string;
    latitude?: number;
    longitude?: number;
}

export interface AddressAutocompleteResponse {
    suggestions: AddressSuggestion[];
    hasMore: boolean;
}

// Booking submission types
export interface BookingSubmissionData extends BookingFormData {
    userId: string;
    paymentMethod?: string;
    promoCode?: string;
}

export interface BookingSubmissionResponse {
    success: boolean;
    bookingId?: string;
    message: string;
    estimatedPrice?: number;
    confirmationCode?: string;
}

export type BookingStepId = 'service' | 'datetime' | 'address' | 'confirmation';

export const BOOKING_STEPS: Record<BookingStepId, BookingStep> = {
    service: {
        id: 'service',
        title: 'Chọn dịch vụ',
        description: 'Chọn loại dịch vụ bạn cần',
        isCompleted: false,
        isActive: true,
    },
    datetime: {
        id: 'datetime',
        title: 'Chọn thời gian',
        description: 'Chọn ngày và giờ phù hợp',
        isCompleted: false,
        isActive: false,
    },
    address: {
        id: 'address',
        title: 'Địa chỉ',
        description: 'Nhập địa chỉ thực hiện dịch vụ',
        isCompleted: false,
        isActive: false,
    },
    confirmation: {
        id: 'confirmation',
        title: 'Xác nhận',
        description: 'Xem lại và xác nhận đặt dịch vụ',
        isCompleted: false,
        isActive: false,
    },
};
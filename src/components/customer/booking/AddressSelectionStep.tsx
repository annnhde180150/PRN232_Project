'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AddressInfo, AddressSuggestion } from '@/types/booking';
import {
    MapPin,
    Search,
    Home,
    Building,
    Plus,
    Check,
    Loader2,
    Navigation,
    Phone,
    User
} from 'lucide-react';

interface AddressSelectionStepProps {
    initialData?: AddressInfo;
    onDataUpdate: (data: AddressInfo) => void;
    error?: string;
}

// Mock address suggestions
const mockAddressSuggestions: AddressSuggestion[] = [
    {
        id: '1',
        fullAddress: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
        ward: 'Phường Bến Nghé',
        district: 'Quận 1',
        city: 'TP.HCM',
        latitude: 10.7769,
        longitude: 106.7009
    },
    {
        id: '2',
        fullAddress: '456 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM',
        ward: 'Phường Bến Thành',
        district: 'Quận 1',
        city: 'TP.HCM',
        latitude: 10.7756,
        longitude: 106.7019
    },
    {
        id: '3',
        fullAddress: '789 Đồng Khởi, Phường Bến Nghé, Quận 1, TP.HCM',
        ward: 'Phường Bến Nghé',
        district: 'Quận 1',
        city: 'TP.HCM',
        latitude: 10.7774,
        longitude: 106.7035
    }
];

// Mock saved addresses
const mockSavedAddresses: AddressInfo[] = [
    {
        id: 'home-1',
        fullAddress: '123 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM',
        ward: 'Phường 4',
        district: 'Quận 5',
        city: 'TP.HCM',
        addressType: 'home',
        contactName: 'Nguyễn Văn A',
        contactPhone: '0901234567'
    },
    {
        id: 'office-1',
        fullAddress: '456 Lý Tự Trọng, Phường Bến Nghé, Quận 1, TP.HCM',
        ward: 'Phường Bến Nghé',
        district: 'Quận 1',
        city: 'TP.HCM',
        addressType: 'office',
        contactName: 'Nguyễn Văn A',
        contactPhone: '0901234567'
    }
];

const addressTypes = [
    { value: 'home', label: 'Nhà riêng', icon: <Home className="w-4 h-4" /> },
    { value: 'office', label: 'Văn phòng', icon: <Building className="w-4 h-4" /> },
    { value: 'other', label: 'Khác', icon: <MapPin className="w-4 h-4" /> }
] as const;

export const AddressSelectionStep: React.FC<AddressSelectionStepProps> = ({
    initialData,
    onDataUpdate,
    error
}) => {
    const [addressInput, setAddressInput] = useState(initialData?.fullAddress || '');
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<AddressInfo | null>(initialData || null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Form fields for manual address entry
    const [formData, setFormData] = useState({
        contactName: initialData?.contactName || '',
        contactPhone: initialData?.contactPhone || '',
        addressType: (initialData?.addressType as 'home' | 'office' | 'other') || 'home',
        specialInstructions: initialData?.specialInstructions || ''
    });

    // Mock address search with debounce
    useEffect(() => {
        if (addressInput.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            setIsLoading(true);
            // Mock API call
            setTimeout(() => {
                const filtered = mockAddressSuggestions.filter(addr =>
                    addr.fullAddress.toLowerCase().includes(addressInput.toLowerCase())
                );
                setSuggestions(filtered);
                setShowSuggestions(true);
                setIsLoading(false);
            }, 500);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [addressInput]);

    // Handle address suggestion selection
    const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
        const addressData: AddressInfo = {
            fullAddress: suggestion.fullAddress,
            ward: suggestion.ward,
            district: suggestion.district,
            city: suggestion.city,
            latitude: suggestion.latitude,
            longitude: suggestion.longitude,
            addressType: formData.addressType,
            contactName: formData.contactName,
            contactPhone: formData.contactPhone,
            specialInstructions: formData.specialInstructions
        };

        setSelectedAddress(addressData);
        setAddressInput(suggestion.fullAddress);
        setShowSuggestions(false);
        onDataUpdate(addressData);
    };

    // Handle saved address selection
    const handleSavedAddressSelect = (address: AddressInfo) => {
        setSelectedAddress(address);
        setAddressInput(address.fullAddress);
        setFormData({
            contactName: address.contactName || '',
            contactPhone: address.contactPhone || '',
            addressType: address.addressType,
            specialInstructions: address.specialInstructions || ''
        });
        onDataUpdate(address);
    };

    // Handle form data change
    const handleFormDataChange = (field: string, value: string) => {
        const newFormData = { ...formData, [field]: value };
        setFormData(newFormData);

        if (selectedAddress) {
            const updatedAddress = {
                ...selectedAddress,
                [field]: value
            };
            setSelectedAddress(updatedAddress);
            onDataUpdate(updatedAddress);
        }
    };

    // Get current location
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Trình duyệt không hỗ trợ định vị');
            return;
        }

        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                // Mock reverse geocoding
                setTimeout(() => {
                    const mockAddress = `Vị trí hiện tại, Phường 1, Quận 1, TP.HCM`;
                    const addressData: AddressInfo = {
                        fullAddress: mockAddress,
                        ward: 'Phường 1',
                        district: 'Quận 1',
                        city: 'TP.HCM',
                        latitude,
                        longitude,
                        addressType: formData.addressType,
                        contactName: formData.contactName,
                        contactPhone: formData.contactPhone,
                        specialInstructions: formData.specialInstructions
                    };

                    setSelectedAddress(addressData);
                    setAddressInput(mockAddress);
                    setIsGettingLocation(false);
                    onDataUpdate(addressData);
                }, 1000);
            },
            (error) => {
                console.error('Geolocation error:', error);
                setIsGettingLocation(false);
                alert('Không thể lấy vị trí hiện tại');
            }
        );
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-6">
            {/* Saved Addresses */}
            {mockSavedAddresses.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Địa chỉ đã lưu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {mockSavedAddresses.map((address) => {
                                const isSelected = selectedAddress?.id === address.id;
                                const addressType = addressTypes.find(type => type.value === address.addressType);

                                return (
                                    <Card
                                        key={address.id}
                                        className={cn(
                                            'cursor-pointer transition-all hover:shadow-md border-2',
                                            isSelected
                                                ? 'border-primary bg-primary/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                        )}
                                        onClick={() => handleSavedAddressSelect(address)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        'p-1.5 rounded-lg',
                                                        isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                                                    )}>
                                                        {addressType?.icon}
                                                    </div>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {addressType?.label}
                                                    </Badge>
                                                </div>
                                                {isSelected && (
                                                    <div className="p-1 bg-primary rounded-full">
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-sm text-gray-900 mb-1 line-clamp-2">
                                                {address.fullAddress}
                                            </p>

                                            {address.contactName && (
                                                <p className="text-xs text-gray-500">
                                                    {address.contactName} • {address.contactPhone}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Address Search */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Search className="w-5 h-5" />
                            Tìm kiếm địa chỉ
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleGetCurrentLocation}
                            disabled={isGettingLocation}
                            className="flex items-center gap-2"
                        >
                            {isGettingLocation ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Navigation className="w-4 h-4" />
                            )}
                            Vị trí hiện tại
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                ref={inputRef}
                                type="text"
                                placeholder="Nhập địa chỉ (số nhà, tên đường, phường, quận)..."
                                value={addressInput}
                                onChange={(e) => setAddressInput(e.target.value)}
                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                className="pl-10"
                            />
                            {isLoading && (
                                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                            )}
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div
                                ref={suggestionsRef}
                                className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                            >
                                {suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion.id}
                                        onClick={() => handleSuggestionSelect(suggestion)}
                                        className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-900">{suggestion.fullAddress}</p>
                                                <p className="text-xs text-gray-500">
                                                    {suggestion.ward}, {suggestion.district}, {suggestion.city}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Manual Address Entry Toggle */}
                    <div className="mt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAddressForm(!showAddressForm)}
                            className="flex items-center gap-2 text-primary"
                        >
                            <Plus className="w-4 h-4" />
                            Nhập địa chỉ thủ công
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Manual Address Form */}
            {showAddressForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Nhập địa chỉ chi tiết</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="ward">Phường/Xã</Label>
                                <Input
                                    id="ward"
                                    placeholder="Nhập phường/xã"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="district">Quận/Huyện</Label>
                                <Input
                                    id="district"
                                    placeholder="Nhập quận/huyện"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="city">Tỉnh/Thành phố</Label>
                                <Input
                                    id="city"
                                    placeholder="Nhập tỉnh/thành phố"
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Contact Information */}
            {selectedAddress && (
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin liên hệ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Address Type */}
                        <div>
                            <Label>Loại địa chỉ</Label>
                            <div className="flex gap-2 mt-2">
                                {addressTypes.map((type) => (
                                    <Button
                                        key={type.value}
                                        variant={formData.addressType === type.value ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleFormDataChange('addressType', type.value)}
                                        className="flex items-center gap-2"
                                    >
                                        {type.icon}
                                        {type.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Contact Name */}
                        <div>
                            <Label htmlFor="contactName" className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Tên người liên hệ
                            </Label>
                            <Input
                                id="contactName"
                                placeholder="Nhập tên người liên hệ"
                                value={formData.contactName}
                                onChange={(e) => handleFormDataChange('contactName', e.target.value)}
                                className="mt-1"
                            />
                        </div>

                        {/* Contact Phone */}
                        <div>
                            <Label htmlFor="contactPhone" className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Số điện thoại
                            </Label>
                            <Input
                                id="contactPhone"
                                placeholder="Nhập số điện thoại"
                                value={formData.contactPhone}
                                onChange={(e) => handleFormDataChange('contactPhone', e.target.value)}
                                className="mt-1"
                            />
                        </div>

                        {/* Special Instructions */}
                        <div>
                            <Label htmlFor="specialInstructions">Ghi chú đặc biệt</Label>
                            <Textarea
                                id="specialInstructions"
                                placeholder="Hướng dẫn tìm đường, ghi chú đặc biệt..."
                                value={formData.specialInstructions}
                                onChange={(e) => handleFormDataChange('specialInstructions', e.target.value)}
                                className="mt-1"
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Selected Address Summary */}
            {selectedAddress && (
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                <Check className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-green-900 mb-1">
                                    Địa chỉ đã chọn
                                </h4>
                                <p className="text-sm text-green-700 mb-2">
                                    {selectedAddress.fullAddress}
                                </p>
                                {(selectedAddress.contactName || selectedAddress.contactPhone) && (
                                    <div className="flex items-center gap-4 text-xs text-green-600">
                                        {selectedAddress.contactName && (
                                            <span>👤 {selectedAddress.contactName}</span>
                                        )}
                                        {selectedAddress.contactPhone && (
                                            <span>📞 {selectedAddress.contactPhone}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
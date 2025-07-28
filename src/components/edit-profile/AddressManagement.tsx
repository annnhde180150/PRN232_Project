'use client';

import React, { useState, useEffect } from 'react';
import { addressAPI } from '@/lib/api';
import { UserAddress, CreateAddressRequest, UpdateAddressRequest } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TextInput } from '@/components/design-system/TextInput';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, MapPin, Star } from 'lucide-react';

interface AddressManagementProps {
  userId: number;
  currentDefaultAddressId?: number;
  onDefaultAddressChange?: (addressId: number) => void;
}

export const AddressManagement: React.FC<AddressManagementProps> = ({ userId, currentDefaultAddressId, onDefaultAddressChange }) => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [selectedDefaultAddressId, setSelectedDefaultAddressId] = useState<number | null>(currentDefaultAddressId || null);
  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    ward: '',
    district: '',
    city: '',
    fullAddress: '',
  });

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await addressAPI.getUserAddresses(userId);
      setAddresses(data);
    } catch (error: any) {
      toast.error('Không thể tải danh sách địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      addressLine1: '',
      addressLine2: '',
      ward: '',
      district: '',
      city: '',
      fullAddress: '',
    });
    setEditingAddress(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateFullAddress = () => {
    const parts = [
      formData.addressLine1,
      formData.addressLine2,
      formData.ward,
      formData.district,
      formData.city
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const fullAddress = generateFullAddress();
      const addressData = {
        ...formData,
        fullAddress,
        userId,
      };

      if (editingAddress) {
        // Update existing address
        const updateData: UpdateAddressRequest = {
          ...addressData,
          latitude: editingAddress.latitude,
          longitude: editingAddress.longitude,
          isDefault: editingAddress.isDefault,
        };
        await addressAPI.updateAddress(editingAddress.addressId, updateData);
        toast.success('Cập nhật địa chỉ thành công!');
      } else {
        // Create new address
        const createData: CreateAddressRequest = addressData;
        await addressAPI.createAddress(createData);
        toast.success('Thêm địa chỉ thành công!');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi lưu địa chỉ');
    }
  };

  const handleDelete = async (addressId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

    try {
      await addressAPI.deleteAddress(addressId);
      toast.success('Xóa địa chỉ thành công!');
      fetchAddresses();
    } catch (error: any) {
      toast.error('Có lỗi xảy ra khi xóa địa chỉ');
    }
  };

  const handleEdit = (address: UserAddress) => {
    console.log('handleEdit called for address:', address.addressId);
    setEditingAddress(address);
    setFormData({
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      ward: address.ward,
      district: address.district,
      city: address.city,
      fullAddress: address.fullAddress,
    });
    setIsDialogOpen(true);
  };

  const handleSetDefault = (addressId: number) => {
    console.log('handleSetDefault called with addressId:', addressId);
    
    if (selectedDefaultAddressId === addressId) {
      console.log('Address is already selected as default, skipping update');
      return; // Already selected as default, no need to update
    }

    // Update the selected default address ID
    setSelectedDefaultAddressId(addressId);
    

    if (onDefaultAddressChange) {
      onDefaultAddressChange(addressId);
    }
    
    // Update local state to reflect the selection
    setAddresses(prev => prev.map(address => ({
      ...address,
      isDefault: address.addressId === addressId
    })));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Quản lý địa chỉ
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm địa chỉ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                label="Địa chỉ"
                value={formData.addressLine1}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                required
              />
              <TextInput
                label="Địa chỉ bổ sung (tùy chọn)"
                value={formData.addressLine2}
                onChange={(e) => handleInputChange('addressLine2', e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextInput
                  label="Phường/Xã"
                  value={formData.ward}
                  onChange={(e) => handleInputChange('ward', e.target.value)}
                  required
                />
                <TextInput
                  label="Quận/Huyện"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  required
                />
                <TextInput
                  label="Thành phố"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">
                  {editingAddress ? 'Cập nhật' : 'Thêm'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card className="p-6 text-center">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Chưa có địa chỉ nào được thêm</p>
          <Button 
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm địa chỉ đầu tiên
          </Button>
        </Card>
      ) : (
        <RadioGroup 
          value={selectedDefaultAddressId?.toString() || addresses.find(addr => addr.isDefault)?.addressId?.toString() || ''}
          onValueChange={(value) => {
            console.log('RadioGroup onValueChange called with value:', value);
            handleSetDefault(parseInt(value));
          }}
          className="space-y-3"
        >
          {addresses.map((address) => (
            <Card key={address.addressId} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <RadioGroupItem 
                    value={address.addressId.toString()} 
                    id={`address-${address.addressId}`}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={`address-${address.addressId}`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="font-medium">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {address.ward}, {address.district}, {address.city}
                        </div>
                        {(address.isDefault || address.addressId === selectedDefaultAddressId) && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-yellow-600 dark:text-yellow-400">
                              Địa chỉ mặc định
                            </span>
                          </div>
                        )}
                      </div>
                    </Label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEdit(address);
                    }}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Sửa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(address.addressId);
                    }}
                    className="flex items-center gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </RadioGroup>
      )}
    </div>
  );
}; 
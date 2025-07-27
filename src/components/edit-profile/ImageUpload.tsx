'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { uploadImage, generateProfileImagePath } from '@/lib/firebase';
import { toast } from 'sonner';
import { Upload, X, User } from 'lucide-react';

interface ImageUploadProps {
  currentImageUrl?: string | null;
  userId: number;
  userType: 'user' | 'helper' | 'admin';
  onImageUpload: (imageUrl: string) => void;
  onFileSelect?: (file: File) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  userId,
  userType,
  onImageUpload,
  onFileSelect,
  className = '',
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Store the file for later upload
    setSelectedFile(file);
    
    // Notify parent component about file selection
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(currentImageUrl || null);
    setSelectedFile(null);
    onImageUpload(currentImageUrl || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Image Preview */}
      <div className="relative inline-block">
        <Avatar className="h-24 w-24 border-2 border-gray-200">
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt="Profile preview" />
          ) : (
            <AvatarFallback className="bg-gray-100">
              <User className="h-8 w-8 text-gray-400" />
            </AvatarFallback>
          )}
        </Avatar>
        
        {/* Remove button */}
        {previewUrl && (
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-4 hover:bg-red-600 transition-colors shadow-sm"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex flex-col items-center space-y-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleUploadClick}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Tải ảnh lên
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          JPG, PNG hoặc GIF (tối đa 5MB)
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}; 
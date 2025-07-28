'use client';

import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

type UploadFileProps = {
  onUploaded?: (url: string) => void;
  accept?: string;
  maxSize?: number; // in MB
};

const UploadFile: React.FC<UploadFileProps> = ({
  onUploaded,
  accept = "*/*",
  maxSize = 10 // 10MB default
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size <= maxSize * 1024 * 1024) {
        setFile(droppedFile);
      } else {
        alert(`File size must be less than ${maxSize}MB`);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size <= maxSize * 1024 * 1024) {
        setFile(selectedFile);
      } else {
        alert(`File size must be less than ${maxSize}MB`);
        e.target.value = '';
      }
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(percent);
      },
      (error) => {
        alert(`Tải lên thất bại: ${error.message}`);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(downloadURL);
          setUploading(false);
          if (onUploaded) onUploaded(downloadURL);
        });
      }
    );
  };

  const removeFile = () => {
    setFile(null);
    setUrl("");
    setProgress(0);
  };

  return (
    <div className="w-full">
      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${dragActive
            ? 'border-green-500 bg-green-50'
            : file
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            {/* Upload Icon */}
            <div className="mx-auto w-12 h-12 mb-4 flex items-center justify-center bg-gray-200 rounded-full">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>

            {/* Upload Text */}
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                Chọn file hoặc kéo thả vào đây
              </p>
              <p className="text-sm text-gray-500">
                Tối đa {maxSize}MB • {accept === "*/*" ? "Tất cả file types" : accept}
              </p>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </>
        ) : (
          <>
            {/* File Selected State */}
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-3">
              {!uploading && !url && (
                <>
                  <button
                    onClick={handleUpload}
                    disabled={!file}
                    className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tải lên ngay
                  </button>
                  <button
                    onClick={removeFile}
                    className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Chọn lại
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Đang tải lên...</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Success State */}
      {url && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-green-800">Tải lên thành công!</span>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:text-green-800 underline"
              >
                Xem file
              </a>
              <button
                onClick={removeFile}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadFile; 
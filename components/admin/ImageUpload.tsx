'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
// import { createClient } from '@supabase/supabase-js';

// Supabase client (currently unused but kept for future functionality)
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// const supabase = createClient(supabaseUrl, supabaseKey);

interface ImageUploadProps {
  djId: string;
  imageType: 'front' | 'back' | 'icon';
  currentImageUrl?: string;
  onImageUpdate: (url: string) => void;
  label: string;
  aspectRatio?: string;
  maxSize?: number;
}

export default function ImageUpload({
  djId,
  imageType,
  currentImageUrl,
  onImageUpdate,
  label,
  aspectRatio = '1/1',
  maxSize = 10
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);

  // Update preview when currentImageUrl changes
  useEffect(() => {
    if (currentImageUrl && currentImageUrl !== previewUrl) {
      setPreviewUrl(currentImageUrl);
    }
  }, [currentImageUrl, previewUrl]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WebP, or SVG)');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Create preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file (this will update the preview with the server URL)
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('djId', djId);
      formData.append('imageType', imageType);

      const response = await fetch('/api/admin/images/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setPreviewUrl(result.url);
        onImageUpdate(result.url);
        setError(null);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!currentImageUrl) return;

    try {
      // Update the DJ record to set the image URL to null
      const updateData: any = { id: djId };
      
      if (imageType === 'front') {
        updateData.image_url = null;
      } else if (imageType === 'back') {
        updateData.back_image_url = null;
      }

      const response = await fetch('/api/admin/djs/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok && result.data) {
        setPreviewUrl(null);
        onImageUpdate('');
        setError(null);
      } else {
        setError(result.error || 'Delete failed');
      }
    } catch (err) {
      setError('Delete failed. Please try again.');
      console.error('Delete error:', err);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-gray-300 text-sm font-medium">
        {label}
      </label>
      
      <div className="space-y-2">
        {/* Image Preview */}
        <div 
          className={`
            relative border-2 border-dashed border-gray-600 rounded-lg overflow-hidden
            ${aspectRatio === '1/1' ? 'aspect-square' : aspectRatio === '16/9' ? 'aspect-video' : 'aspect-auto'}
            ${previewUrl ? 'border-solid border-green-500' : 'hover:border-gray-500'}
          `}
        >
          {previewUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={previewUrl}
                alt={`${label} preview`}
                fill
                className="object-cover"
                onError={(e) => {
                  console.error('Image load error:', previewUrl, e);
                  setPreviewUrl(null);
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={handleRemoveImage}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="flex flex-col items-center justify-center h-full p-8 cursor-pointer hover:bg-gray-800/50 transition-colors"
              onClick={triggerFileSelect}
            >
              <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-sm text-center">
                {isUploading ? 'Uploading...' : `Click to upload ${label.toLowerCase()}`}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Max {maxSize}MB • JPEG, PNG, WebP, SVG
              </p>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex space-x-2">
          <button
            onClick={triggerFileSelect}
            disabled={isUploading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? 'Uploading...' : previewUrl ? 'Change Image' : 'Upload Image'}
          </button>
          
          {previewUrl && (
            <button
              onClick={handleRemoveImage}
              disabled={isUploading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Remove
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}

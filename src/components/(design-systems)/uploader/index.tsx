'use client';

import React, { useRef, useState } from 'react';
import { FieldValues, UseFormSetValue, Path, PathValue } from 'react-hook-form';
import { Upload } from 'lucide-react';

import { useUploader } from '@/hooks/useUploader';
import { cn } from '@/lib/utils';
import { SupabaseImage } from '../supabaseImage';

type Variant = 'button' | 'icon' | 'drag';
type Mode = 'single' | 'multi';

interface UploaderProps<T extends FieldValues> {
  name: Path<T>;
  bucket: string;
  setValue: UseFormSetValue<T>;
  variant?: Variant;
  mode?: Mode;
  className?: string;
}

export function Uploader<T extends FieldValues>({
  name,
  bucket,
  setValue,
  variant = 'button',
  mode = 'single',
  className,
}: UploaderProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, removeFile, uploading } = useUploader(bucket);

  const [files, setFiles] = useState<string[]>([]);

  const handleFiles = async (selected: FileList | null) => {
    if (!selected) return;

    const uploadedUrls: string[] = [];

    for (const file of Array.from(selected)) {
      const url = await uploadFile(file);
      if (url) uploadedUrls.push(url);
    }

    const newFiles =
      mode === 'multi' ? [...files, ...uploadedUrls] : uploadedUrls;

    setFiles(newFiles);

    setValue(name, newFiles as PathValue<T, typeof name>, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {variant === 'button' && (
        <button
          type="button"
          onClick={onClickUpload}
          disabled={uploading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      )}

      {variant === 'icon' && (
        <button
          type="button"
          onClick={onClickUpload}
          className="rounded-full border p-2 hover:bg-gray-100"
        >
          <Upload size={20} />
        </button>
      )}

      {variant === 'drag' && (
        <div
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={onClickUpload}
          className="cursor-pointer rounded-xl border-2 border-dashed border-gray-400 p-6 text-center hover:bg-gray-50"
        >
          {uploading ? 'Uploading...' : 'Drag & Drop or Click to Upload'}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple={mode === 'multi'}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {files.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-3">
          {files.map((path, i) => (
            <div key={path} className="relative">
              <SupabaseImage
                bucket={bucket}
                path={path}
                width={150}
                height={150}
                alt={`Uploaded file ${i + 1}`}
                className="h-32 w-full rounded-lg border object-cover"
              />

              <button
                type="button"
                onClick={() => removeFile(path)}
                className="mt-1 text-xs text-red-600 hover:underline"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

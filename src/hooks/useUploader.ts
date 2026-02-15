'use client';

import { supabase } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export function useUploader(bucket: string) {
  const [progress, setProgress] = useState<number>(0);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      return new Promise<string>((resolve, reject) => {
        const filePath = `${Date.now()}-${file.name}`;
        console.log(filePath);
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setProgress(percent);
          }
        });

        xhr.addEventListener('load', async () => {
          if (xhr.status === 200 || xhr.status === 201) {
            setProgress(100);
            resolve(filePath);
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed due to network error'));
        });

        supabase.storage
          .from(bucket)
          .createSignedUploadUrl(filePath)
          .then(({ data, error }) => {
            if (error) return reject(error);
            const formData = new FormData();
            formData.append('file', file);
            xhr.open('PUT', data.signedUrl, true);
            xhr.send(formData);
          })
          .catch(reject);
      });
    },
  });

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setProgress(0);
      const path = await mutation.mutateAsync(file);
      return path;
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  };

  const removeFile = async (path: string): Promise<boolean> => {
    try {
      const res = await supabase.storage.from(bucket).remove([path]);

      console.log('REMOVE RESULT:', res);

      if (res.error) {
        console.error('Supabase error:', res.error);
        throw res.error;
      }

      return true;
    } catch (err) {
      console.error('Failed to remove file:', err);
      return false;
    }
  };

  return {
    uploadFile,
    removeFile,
    uploading: mutation.isPending,
    progress,
  };
}

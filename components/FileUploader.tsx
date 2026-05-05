'use client';

import { ChangeEvent, useState } from 'react';
import { Upload } from 'lucide-react';

export function FileUploader({
  accept,
  helper,
  onFileChange,
}: {
  accept: string;
  helper: string;
  onFileChange: (file: File | null) => void;
}) {
  const [fileName, setFileName] = useState('');

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setFileName(file?.name || '');
    onFileChange(file);
  }

  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-accent hover:bg-white">
      <Upload className="h-8 w-8 text-accent" />
      <p className="mt-4 text-sm font-semibold text-ink">点击上传文件</p>
      <p className="mt-2 text-sm text-slate-500">{fileName || helper}</p>
      <input type="file" accept={accept} className="hidden" onChange={handleChange} />
    </label>
  );
}

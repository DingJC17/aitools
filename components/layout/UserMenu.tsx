'use client';

import Link from 'next/link';
import { LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export function UserMenu() {
  const { user, loading, signOut } = useAuth();
  if (loading) return null;
  if (!user) {
    return (
      <>
        <Link href="/tools" className="btn-secondary">免费试用</Link>
        <Link href="/auth/login" className="btn-secondary">登录</Link>
        <Link href="/custom" className="btn-primary"><MessageSquare className="mr-2 h-4 w-4" />添加微信定制</Link>
      </>
    );
  }
  return (
    <>
      <span className="text-sm text-slate-600">{user.email}</span>
      <Link href="/tools" className="btn-secondary">免费试用</Link>
      <button onClick={signOut} className="btn-secondary inline-flex items-center gap-1"><LogOut className="h-4 w-4" />退出</button>
      <Link href="/custom" className="btn-primary"><MessageSquare className="mr-2 h-4 w-4" />添加微信定制</Link>
    </>
  );
}

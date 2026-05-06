import Link from 'next/link';
import Image from 'next/image';
import type { Route } from 'next';
import { Github, LogOut, Menu, MessageSquare, User } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { useAuth } from '@/components/AuthProvider';

const navItems: Array<{ href: Route; label: string }> = [
  { href: '/', label: '首页' },
  { href: '/tools', label: '免费工具' },
  { href: '/custom', label: '定制服务' },
  { href: '/cases', label: '案例' },
  { href: '/about', label: '联系我' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-mist/80 backdrop-blur-xl">
      <div className="container-shell flex h-18 items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt={siteConfig.name} width={40} height={40} className="rounded-2xl" priority />
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-ink">{siteConfig.name}</p>
            <p className="text-xs text-slate-500">试用工具 + 定制获客站</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-accentDeep">
              {item.label}
            </Link>
          ))}
          <a href={siteConfig.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-accentDeep">
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <UserMenu />
        </div>

        <Link href="/tools" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white lg:hidden">
          <Menu className="h-5 w-5 text-ink" />
        </Link>
      </div>
    </header>
  );
}


function UserMenu() {
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
import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/lib/site';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - 免费试用文档转表格、Office 文档摘要、评论分析工具`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'AI 自动化工具',
    'AI 文档处理',
    'PDF 转 Excel',
    'Office 文档摘要',
    '商品评论分析',
    'AI 定制开发',
    '办公自动化',
    '私有化部署',
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-mist text-ink font-sans antialiased">
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

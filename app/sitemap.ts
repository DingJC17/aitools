import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['/', '/tools', '/tools/document-to-table', '/tools/document-summary', '/tools/review-analysis', '/custom', '/cases', '/about', '/privacy', '/disclaimer', '/github'];
  return routes.map((route) => ({
    url: `${siteConfig.url.replace(/\/$/, '')}${route}`,
    lastModified: new Date(),
  }));
}

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://bkruthik.github.io/kruthikfolio';

  return [
    { url: `${base}/`, lastModified: new Date(), priority: 1.0 },
    { url: `${base}/admin-panel`, lastModified: new Date(), priority: 0.3 },
    { url: `${base}/project-detail`, lastModified: new Date(), priority: 0.8 },
  ];
}
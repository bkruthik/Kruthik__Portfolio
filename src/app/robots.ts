import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://bkruthik.github.io/kruthikfolio';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin-panel'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
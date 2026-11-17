// robots.txt : tout est ouvert aux moteurs de recherche, et l'adresse du plan du site suit SITE.url.
import type { APIRoute } from 'astro';
import { SITE } from '../config';

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', SITE.url).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

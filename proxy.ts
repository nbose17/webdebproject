import { i18nRouter } from 'next-i18n-router';
import i18nConfig from './i18nConfig';
import { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Skip i18n routing for API routes - let them pass through unchanged
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/api/')) {
    return; // Return undefined to skip middleware processing
  }
  return i18nRouter(request, i18nConfig);
}

export const config = {
  // Match all routes EXCEPT:
  // - /api/* (API routes)
  // - /static/* (static files)
  // - /_next/* (Next.js internals)
  // - Files with extensions (.*\..*)
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Files with extensions (e.g., .png, .jpg, .svg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};



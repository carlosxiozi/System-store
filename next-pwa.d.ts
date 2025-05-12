// types/next-pwa.d.ts
declare module 'next-pwa' {
  import { NextConfig } from 'next';

  interface PWAOptions {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    buildExcludes?: string[];
    [key: string]: unknown;
  }

  function withPWA(options: PWAOptions): (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}

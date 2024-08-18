import { withSentryConfig } from '@sentry/nextjs';
/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {

        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
            }
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};


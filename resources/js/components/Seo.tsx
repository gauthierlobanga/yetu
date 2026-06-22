import { Head, usePage } from '@inertiajs/react';
import React from 'react';

interface SeoProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'product';
    jsonLd?: Record<string, any>;
    keywords?: string;
}

export default function Seo({
    title,
    description,
    image,
    url,
    type = 'website',
    jsonLd,
    keywords,
}: SeoProps) {
    const { seo } = usePage().props as any;

    const metaTitle = title ? `${title} | ${seo?.appName || 'Yetu'}` : seo?.appName || 'Yetu';
    const metaDescription = description || seo?.defaultDescription || '';
    const metaImage = image || seo?.defaultImage || '/default-share-image.jpg';
    const metaUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    return (
        <Head>
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={metaUrl} />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            <link rel="canonical" href={metaUrl} />

            {/* JSON-LD Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Head>
    );
}

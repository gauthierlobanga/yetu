import React from 'react';
import { AnnouncementBanner } from '@/components/global/AnnouncementBanner';

export function GlobalLayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AnnouncementBanner />
            {children}
        </>
    );
}

import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import type { Auth } from './auth';

// Extension du type User pour la page profil
export interface UserProfile extends NonNullable<Auth['user']> {
    preferences?: {
        locale?: string;
        currency?: string;
        phone?: string;
        city?: string;
        country?: string;
    };
    adresses?: Array<{
        type: string;
        est_defaut: boolean;
        rue: string;
        code_postal: string;
        ville: string;
        pays?: string;
    }>;
}

// Extension du type Auth pour la page profil
export interface ProfileAuth extends Omit<Auth, 'user'> {
    user: UserProfile;
    client?: {
        phone?: string;
        city?: string;
        country?: string;
    };
}

// Props de la page Profil – hérite d'InertiaPageProps (donc signature d'index OK)
export interface ProfilePageProps extends InertiaPageProps {
    mustVerifyEmail: boolean;
    status?: string;
    auth: ProfileAuth;
}

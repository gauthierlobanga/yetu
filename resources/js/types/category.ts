// types/category.ts
export interface Category {
    id: number;
    parent_id: number | null;
    nom: string;
    slug: string;
    description: string | null;
    color: string | null;
    metadata: Record<string, any> | null;
    ordre: number;
    est_active: boolean;
    est_visible_dans_menu: boolean;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    created_at: string;
    updated_at: string;

    // Relations optionnelles
    parent?: {
        id: number;
        nom: string;
        slug: string;
    } | null;

    enfants?: Array<{
        id: number;
        nom: string;
        slug: string;
    }>;

    posts?: Array<{
        id: number;
        title: string;
        slug: string;
    }>;

    // Accesseurs
    url?: string;
    full_path?: string;
    count_posts?: number;
}

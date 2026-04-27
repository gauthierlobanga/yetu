export interface Post {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    featured_image: string | null;
    images: string[] | null;
    metadata: Record<string, any> | null;
    status: 'draft' | 'published' | 'scheduled' | 'expired' | 'archived';
    is_pinned: boolean;
    views_count: number;
    likes_count: number;
    comments_count: number;
    reading_time_minutes: number | null;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    published_at: string | null;
    scheduled_for: string | null;
    expires_at: string | null;
    created_at: string;
    updated_at: string;

    // Relations
    user?: {
        id: number;
        name: string;
        email: string;
        avatar_url?: string;
    };

    categories?: Array<{
        id: number;
        nom: string;
        slug: string;
        color: string;
        pivot?: {
            is_primary: boolean;
            order: number;
        };
    }>;

    media?: Array<{
        id: number;
        collection_name: string;
        name: string;
        file_name: string;
        mime_type: string;
        size: number;
        url?: string;
        thumb_url?: string;
    }>;

    // Accesseurs
    url?: string;
    status_label?: string;
    status_color?: string;
    is_published?: boolean;
    featured_image_url?: string | null;
    featured_image_thumb?: string | null;
    gallery_images?: GalleryImage[];
}

export interface GalleryImage {
    id: number;
    url: string;
    thumb: string;
    medium: string;
    large: string;
    name: string;
    size: number;
}

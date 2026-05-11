import { useEffect, useState, useRef } from 'react';

interface Suggestion {
    id: number;
    nom: string;
    slug: string;
    prix: number;
    image?: string;
}

export function useSearchSuggestions(query: string, delay = 300) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

    useEffect(() => {
        if (!query || query.length < 2) {
            setSuggestions([]);

            return;
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);

            try {
                const res = await fetch(`/product/search/suggestions?q=${encodeURIComponent(query)}`, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });
                const data = await res.json();
                setSuggestions(data.suggestions || []);
            } catch {
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, delay);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query, delay]);

    return { suggestions, loading };
}

// resources/js/pages/searchInput.tsx
'use client';

import SearchInput from '@/components/search-my-input';

export default function SearchInputPage() {
    return (
        <div className="relative my-4 flex items-center justify-center">
            <SearchInput
                placeholder="Rechercher des articles, catégories..."
                hitsPerPage={8}
                openResultsInNewTab={false}
                buttonText="Rechercher"
                onResultClick={(result) => {
                    console.log('Résultat sélectionné:', result);
                }}
            />
        </div>
    );
}

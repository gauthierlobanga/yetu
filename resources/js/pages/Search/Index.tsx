import { Head, Link } from '@inertiajs/react';
import { FolderTree, PackageSearch, SearchIcon } from 'lucide-react';
import type { FormEvent } from 'react';
import type { SearchResult } from '@/components/search-my-input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/main-layout';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import { home, search as searchPage } from '@/routes/tenant';
import { show as productShow } from '@/routes/tenant/product';
import {
    index as categoryIndex,
    show as categoryShow,
} from '@/routes/tenant/product/category';

interface Props {
    results: SearchResult[];
    query: string;
}

function formatPrice(price?: number | null): string | null {
    if (typeof price !== 'number' || !Number.isFinite(price)) {
        return null;
    }

    return new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency: 'CDF',
        maximumFractionDigits: 0,
    }).format(price);
}

function resultType(result: SearchResult): 'product' | 'category' {
    return result._type ?? result.type;
}

function resultUrl(result: SearchResult): string {
    if (resultType(result) === 'product') {
        return productShow.url(result.slug);
    }

    return categoryShow.url(result.slug);
}

export default function SearchIndex({ results, query }: Props) {
    const trimmedQuery = query.trim();
    const breadcrumbs = [
        { title: 'Accueil', href: home.url() },
        { title: 'Recherche', href: searchPage.url() },
        ...(trimmedQuery
            ? [
                  {
                      title: `"${trimmedQuery}"`,
                      href: searchPage.url({ query: { q: trimmedQuery } }),
                  },
              ]
            : []),
    ];

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        const formData = new FormData(event.currentTarget);
        const submittedQuery = String(formData.get('q') ?? '').trim();

        if (submittedQuery.length < 2) {
            event.preventDefault();
        }
    };

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head
                title={
                    trimmedQuery
                        ? `Recherche produits: ${trimmedQuery}`
                        : 'Recherche produits'
                }
            />

            <div className="container mx-auto max-w-5xl px-4 py-10">
                <div className="mb-8 space-y-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-slate-50">
                            Recherche produits
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {trimmedQuery
                                ? `${results.length} résultat${results.length > 1 ? 's' : ''} pour « ${trimmedQuery} »`
                                : 'Recherchez un produit ou une catégorie produit.'}
                        </p>
                    </div>

                    <form
                        action={searchPage.url()}
                        method="get"
                        onSubmit={submitSearch}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <label className="relative flex-1">
                            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                name="q"
                                defaultValue={trimmedQuery}
                                minLength={2}
                                placeholder="Rechercher un produit, une catégorie..."
                                className="h-11 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-10 text-sm text-slate-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/40"
                            />
                        </label>
                        <Button type="submit" className="h-11">
                            Rechercher
                        </Button>
                    </form>
                </div>

                {results.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm dark:bg-slate-800">
                            <PackageSearch className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-800 dark:text-slate-100">
                                Aucun produit trouvé
                            </p>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Essayez un autre mot-clé ou parcourez les
                                catégories.
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href={categoryIndex.url()}>
                                Voir les catégories
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {results.map((result) => {
                            const type = resultType(result);
                            const price = formatPrice(result.prix_actuel);

                            return (
                                <Link
                                    key={`${type}-${result.id}`}
                                    href={resultUrl(result)}
                                    className="group flex gap-4 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-emerald-600"
                                >
                                    {type === 'product' ? (
                                        <img
                                            src={resolveImageUrl(
                                                result.image_principale,
                                            )}
                                            alt={result.nom ?? 'Produit'}
                                            onError={handleImageFallback()}
                                            className="h-20 w-20 shrink-0 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                            <FolderTree className="h-7 w-7" />
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="truncate text-base font-semibold text-slate-900 group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-400">
                                                {result.nom ?? result.name}
                                            </h2>
                                            <Badge
                                                variant="outline"
                                                className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                                            >
                                                {type === 'product'
                                                    ? 'Produit'
                                                    : 'Catégorie'}
                                            </Badge>
                                            {type === 'product' &&
                                                result.badge && (
                                                    <Badge>
                                                        {result.badge}
                                                    </Badge>
                                                )}
                                        </div>

                                        {result.description && (
                                            <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                                                {result.description}
                                            </p>
                                        )}

                                        <div className="mt-2 text-sm">
                                            {type === 'product' && price ? (
                                                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                                    {price}
                                                </span>
                                            ) : (
                                                <span className="text-slate-500 dark:text-slate-400">
                                                    {result.produits_count ?? 0}{' '}
                                                    produit
                                                    {result.produits_count !== 1
                                                        ? 's'
                                                        : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

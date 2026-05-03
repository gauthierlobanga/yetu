/* eslint-disable @typescript-eslint/no-unused-vars */
import { Head, Link, usePage } from '@inertiajs/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// eslint-disable-next-line import/order
import {
    ShoppingBagIcon,
    StarIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
// eslint-disable-next-line import/order
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import AppHeaderTenantLayout from '@/layouts/tenants/app/app-header-tenant-layout';

interface Product {
    id: string;
    nom: string;
    slug: string;
    prix_ttc: number;
    prix_promotion: number | null;
    image: string;
    average_rating: number;
    reviews_count: number;
    brand: string;
    in_stock: boolean;
}

interface Category {
    id: string;
    nom: string;
    slug: string;
    icon: string;
    products_count: number;
}

interface Brand {
    id: string;
    name: string;
    slug: string;
    logo: string;
}

export default function TenantHome({
    tenant,
    featuredProducts,
    newArrivals,
    categories,
    brands,
}: any) {
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('fr-CD', {
            style: 'currency',
            currency: 'CDF',
            minimumFractionDigits: 0,
        }).format(price);

    return (
        <AppHeaderTenantLayout>
            <Head title={tenant.raison_sociale} />

            {/* ---------- HERO SECTION ---------- */}
            <section className="relative flex min-h-150 items-center bg-linear-to-r from-amber-700 to-amber-900 text-white">
                {/* Image de fond optionnelle */}
                {tenant.banner && (
                    <img
                        src={tenant.banner}
                        alt={tenant.raison_sociale}
                        className="absolute inset-0 h-full w-full object-cover opacity-30"
                    />
                )}
                <div className="relative z-10 container mx-auto px-4 py-24">
                    <div className="max-w-3xl">
                        {tenant.logo && (
                            <img
                                src={tenant.logo}
                                alt={tenant.raison_sociale}
                                className="mb-6 h-16 rounded-xl"
                            />
                        )}
                        <h1 className="mb-6 text-5xl leading-tight font-extrabold md:text-7xl">
                            {tenant.raison_sociale}
                        </h1>
                        <p className="mb-10 text-xl text-amber-100 md:text-2xl">
                            {tenant.description}
                        </p>

                        {/* Barre de recherche */}
                        <form
                            action={route('tenant.products.index')}
                            method="GET"
                            className="flex max-w-xl flex-col gap-3 sm:flex-row"
                        >
                            <div className="relative flex-1">
                                <MagnifyingGlassIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="recherche"
                                    placeholder="Que cherchez-vous ?"
                                    className="w-full rounded-xl border-0 py-3 pr-4 pl-12 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
                                />
                            </div>
                            <button
                                type="submit"
                                className="rounded-xl bg-amber-500 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-amber-400"
                            >
                                Rechercher
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* ---------- CATÉGORIES ---------- */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-900">
                            Nos catégories
                        </h2>
                        <p className="text-lg text-gray-500">
                            Explorez la diversité de notre artisanat
                        </p>
                    </div>
                    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-4">
                        {categories.map((cat: Category) => (
                            <Link
                                key={cat.id}
                                href={route('tenant.categories.show', cat.slug)}
                                className="group rounded-2xl bg-gray-50 p-8 text-center transition-all duration-300 hover:bg-amber-50 hover:shadow-lg"
                            >
                                <span className="mb-4 block text-5xl">
                                    {cat.icon}
                                </span>
                                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-amber-700">
                                    {cat.nom}
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    {cat.products_count} produit(s)
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- PRODUITS EN VEDETTE ---------- */}
            <section className="bg-amber-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-12 flex items-end justify-between">
                        <div>
                            <h2 className="mb-2 text-4xl font-bold text-gray-900">
                                Produits en vedette
                            </h2>
                            <p className="text-lg text-gray-500">
                                Sélectionnés avec soin par nos artisans
                            </p>
                        </div>
                        <Link
                            href={route('tenant.products.index', {
                                sort: 'rating',
                            })}
                            className="hidden items-center gap-2 font-semibold text-amber-700 hover:underline md:inline-flex"
                        >
                            Voir tout
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={24}
                        navigation={true}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                        }}
                        modules={[Navigation, Pagination]}
                        className="pb-16"
                    >
                        {featuredProducts.map((product: Product) => (
                            <SwiperSlide key={product.id}>
                                <Link
                                    href={route(
                                        'tenant.product.show',
                                        product.slug,
                                    )}
                                    className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                                >
                                    <div className="aspect-square overflow-hidden bg-gray-100">
                                        <img
                                            src={product.image}
                                            alt={product.nom}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="mb-1 text-sm font-medium text-amber-700">
                                            {product.brand}
                                        </div>
                                        <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">
                                            {product.nom}
                                        </h3>
                                        <div className="mb-3 flex items-center gap-1">
                                            {[...Array(5)].map((_, i) =>
                                                i <
                                                Math.round(
                                                    product.average_rating,
                                                ) ? (
                                                    <StarSolid
                                                        key={i}
                                                        className="h-4 w-4 text-yellow-400"
                                                    />
                                                ) : (
                                                    <StarIcon
                                                        key={i}
                                                        className="h-4 w-4 text-gray-300"
                                                    />
                                                ),
                                            )}
                                            <span className="ml-1 text-xs text-gray-500">
                                                ({product.reviews_count})
                                            </span>
                                        </div>
                                        <div className="mt-auto">
                                            {product.prix_promotion ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl font-bold text-amber-700">
                                                        {formatPrice(
                                                            product.prix_promotion,
                                                        )}
                                                    </span>
                                                    <span className="text-sm text-gray-400 line-through">
                                                        {formatPrice(
                                                            product.prix_ttc,
                                                        )}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xl font-bold text-amber-700">
                                                    {formatPrice(
                                                        product.prix_ttc,
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* ---------- NOUVEAUTÉS ---------- */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-12 flex items-end justify-between">
                        <div>
                            <h2 className="mb-2 text-4xl font-bold text-gray-900">
                                Nouveautés
                            </h2>
                            <p className="text-lg text-gray-500">
                                Tout juste sortis de l’atelier
                            </p>
                        </div>
                        <Link
                            href={route('tenant.products.index', {
                                sort: 'newest',
                            })}
                            className="hidden items-center gap-2 font-semibold text-amber-700 hover:underline md:inline-flex"
                        >
                            Voir tout →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        {newArrivals.map((product: Product) => (
                            <Link
                                key={product.id}
                                href={route(
                                    'tenant.product.show',
                                    product.slug,
                                )}
                                className="group overflow-hidden rounded-2xl bg-gray-50 transition hover:shadow-lg"
                            >
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.nom}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="line-clamp-1 font-medium text-gray-900">
                                        {product.nom}
                                    </h3>
                                    <span className="font-bold text-amber-700">
                                        {formatPrice(
                                            product.prix_promotion ??
                                                product.prix_ttc,
                                        )}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- ARTISANS / MARQUES ---------- */}
            {brands.length > 0 && (
                <section className="bg-amber-50 py-20">
                    <div className="container mx-auto px-4">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-4xl font-bold text-gray-900">
                                Nos artisans
                            </h2>
                            <p className="text-lg text-gray-500">
                                Des talents passionnés à votre service
                            </p>
                        </div>
                        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-6">
                            {brands.map((brand: Brand) => (
                                <Link
                                    key={brand.id}
                                    href={route(
                                        'tenant.brands.show',
                                        brand.slug,
                                    )}
                                    className="group text-center"
                                >
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="mx-auto h-24 w-24 rounded-full object-cover shadow-md transition group-hover:shadow-lg"
                                    />
                                    <h3 className="mt-3 font-medium text-gray-800">
                                        {brand.name}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ---------- FOOTER DE LA BOUTIQUE ---------- */}
            <footer className="bg-gray-900 py-12 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="mb-2 text-xl font-bold">
                        {tenant.raison_sociale}
                    </h3>
                    <p className="mb-4 text-gray-400">
                        Artisanat congolais authentique
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href={route('tenant.products.index')}
                            className="transition hover:text-amber-400"
                        >
                            Tous nos produits
                        </Link>
                        <span className="text-gray-600">|</span>
                        <Link
                            href={route('tenant.contact.index')}
                            className="transition hover:text-amber-400"
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            </footer>
        </AppHeaderTenantLayout>
    );
}

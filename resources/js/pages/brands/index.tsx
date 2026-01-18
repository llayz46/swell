import { show } from '@/actions/App/Http/Controllers/BrandController';
import { PaginationComponent } from '@/components/swell/pagination-component';
import { PlaceholderImage } from '@/components/ui/placeholder-image';
import BaseLayout from '@/layouts/base-layout';
import { Brand, PaginatedResponse } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface IndexProps {
    brands: PaginatedResponse<Brand>;
}

export default function Index({ brands }: IndexProps) {
    return (
        <BaseLayout>
            <Head title="Marques" />

            <main className="layout-container">
                <h1 className="mb-6 text-2xl font-bold">Marques</h1>

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {brands.data.map((brand) => (
                        <div key={brand.id} className="overflow-hidden rounded-lg border">
                            <div className="flex flex-col items-center p-4">
                                <div className="mb-4 flex h-32 w-32 items-center justify-center">
                                    {brand.logo_url ? (
                                        <img
                                            src={brand.logo_url}
                                            alt={`Logo ${brand.name}`}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    ) : (
                                        <PlaceholderImage className="size-full" />
                                    )}
                                </div>
                                <Link href={show.url(brand.slug)} className="text-center text-lg font-semibold hover:underline">
                                    {brand.name}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <PaginationComponent pagination={{ links: brands.links, meta: brands.meta }} preserveQuery={['sort']} />
            </main>
        </BaseLayout>
    );
}

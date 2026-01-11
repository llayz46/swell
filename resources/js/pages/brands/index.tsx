import { PaginationComponent } from '@/components/swell/pagination-component';
import BaseLayout from '@/layouts/base-layout';
import { Brand, PaginatedResponse } from '@/types';
import { useStorageUrl } from '@/utils/format-storage-url';
import { Head, Link } from '@inertiajs/react';

interface IndexProps {
    brands: PaginatedResponse<Brand>;
}

export default function Index({ brands }: IndexProps) {
    const getStorageUrl = useStorageUrl();

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
                                            src={getStorageUrl(brand.logo_url)}
                                            alt={`Logo ${brand.name}`}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    ) : (
                                        <span>{brand.name}</span>
                                    )}
                                </div>
                                <Link href={route('brand.show', brand.slug)} className="text-center text-lg font-semibold hover:underline">
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

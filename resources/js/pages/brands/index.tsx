import BaseLayout from '@/layouts/base-layout';
import { Head, Link } from '@inertiajs/react';
import { Brand, PaginatedResponse } from '@/types';
import { PaginationComponent } from '@/components/pagination-component';
import { show } from "@/actions/App/Http/Controllers/BrandController";
import { getStorageUrl } from '@/utils/format-storage-url';

interface IndexProps {
    brands: PaginatedResponse<Brand>;
}

export default function Index({ brands }: IndexProps) {
    return (
        <BaseLayout>
            <Head title="Marques" />

            <main className="layout-container">
                <h1 className="text-2xl font-bold mb-6">Marques</h1>

                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {brands.data.map(brand => (
                        <div key={brand.id} className="border rounded-lg overflow-hidden">
                            <div className="p-4 flex flex-col items-center">
                                <div className="w-32 h-32 flex items-center justify-center mb-4">
                                    {brand.logo_url ? (
                                        <img
                                            src={getStorageUrl(brand.logo_url)}
                                            alt={`Logo ${brand.name}`}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    ) : (
                                        <span>
                                            {brand.name}
                                        </span>
                                    )}
                                </div>
                                <Link href={show(brand.slug).url} className="text-lg font-semibold text-center hover:underline">{brand.name}</Link>
                            </div>
                        </div>
                    ))}
                </div>

                <PaginationComponent
                    pagination={{ links: brands.links, meta: brands.meta }}
                    preserveQuery={['sort']}
                />
            </main>
        </BaseLayout>
    );
}

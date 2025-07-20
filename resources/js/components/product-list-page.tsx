import { FilterSheet } from '@/components/filter-sheet';
import { PaginationComponent } from '@/components/pagination-component';
import { ProductCard } from '@/components/product-card';
import { ProductQuickViewDialog } from '@/components/product-quick-view-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BaseLayout from '@/layouts/base-layout';
import type { PaginatedResponse, Product } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type SortType = 'news' | 'price_asc' | 'price_desc';

interface ProductListPageProps {
    title: string;
    products: PaginatedResponse<Product>;
    sort: SortType;
    stock: { in: boolean, out: boolean }
}

export function ProductListPage({ title, products, sort = 'news', stock }: ProductListPageProps) {
    const [selectedSort, setSelectedSort] = useState<SortType>(sort);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    useEffect(() => {
        setSelectedSort(sort);
    }, [sort]);

    const handleSortChange = (value: SortType) => {
        setSelectedSort(value);
        router.get(
            window.location.pathname,
            {
                sort: value,
                page: products.meta.current_page,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <BaseLayout>
            <Head title={title} />

            <main className="layout-container">
                <div className="flex items-center justify-between">
                    <FilterSheet stock={stock} />

                    <Select onValueChange={handleSortChange} defaultValue={sort} value={selectedSort}>
                        <SelectTrigger className="w-52">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="news">Nouveautés</SelectItem>
                            <SelectItem value="price_asc">Prix ordre croissant</SelectItem>
                            <SelectItem value="price_desc">Prix ordre décroissant</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <section className="mb-8 space-y-6">
                    <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.data.map((product) => (
                            <li key={product.id}>
                                <ProductCard product={product} onQuickView={() => setQuickViewProduct(product)} />
                            </li>
                        ))}
                    </ul>

                    {products.data.length === 0 && (
                        <div className="text-center text-muted-foreground">
                            Aucun produit trouvé.
                        </div>
                    )}

                    <PaginationComponent pagination={{ links: products.links, meta: products.meta }} preserveQuery={['sort']} />
                </section>

                <ProductQuickViewDialog product={quickViewProduct} open={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
            </main>
        </BaseLayout>
    );
}

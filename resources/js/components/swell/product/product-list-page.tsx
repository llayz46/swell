import { FilterSheet } from '@/components/swell/filter-sheet';
import { PaginationComponent } from '@/components/swell/pagination-component';
import { ProductCard } from '@/components/swell/product/product-card';
import { ProductQuickViewDialog } from '@/components/swell/product/product-quick-view-dialog';
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
    stock: { in: boolean; out: boolean };
    price?: { min: number | null; max: number | null; max_available: number };
}

export function ProductListPage({ title, products, sort = 'news', stock, price }: ProductListPageProps) {
    const [selectedSort, setSelectedSort] = useState<SortType>(sort);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    useEffect(() => {
        setSelectedSort(sort);
    }, [sort]);

    const handleSortChange = (value: SortType) => {
        setSelectedSort(value);

        // Préserver tous les paramètres de requête existants
        const currentParams = new URLSearchParams(window.location.search);
        const paramsObj: Record<string, string> = {};

        currentParams.forEach((paramValue, key) => {
            paramsObj[key] = paramValue;
        });

        // Mettre à jour le tri
        paramsObj['sort'] = value;
        paramsObj['page'] = products.meta.current_page.toString();

        router.get(window.location.pathname, paramsObj, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <BaseLayout>
            <Head title={title} />

            <main className="layout-container">
                <div className="flex items-center justify-between">
                    <FilterSheet stock={stock} price={price} />

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
                    <ul className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {products.data.map((product) => (
                            <li key={product.id}>
                                <ProductCard product={product} onQuickView={() => setQuickViewProduct(product)} />
                            </li>
                        ))}
                    </ul>

                    {products.data.length === 0 && <div className="text-center text-muted-foreground">Aucun produit trouvé.</div>}

                    <PaginationComponent
                        pagination={{ links: products.links, meta: products.meta }}
                        preserveQuery={['sort', 'min_price', 'max_price', 'in', 'out']}
                    />
                </section>

                <ProductQuickViewDialog product={quickViewProduct} open={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
            </main>
        </BaseLayout>
    );
}

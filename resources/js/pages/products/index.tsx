import { ProductListPage } from '@/components/swell/product/product-list-page';
import type { PaginatedResponse, Product } from '@/types';

interface IndexProductProps {
    data: PaginatedResponse<Product>;
    sort: SortType;
    search: string;
    stock: { in: boolean; out: boolean };
    price: { min: number | null; max: number | null; max_available: number };
}

type SortType = 'news' | 'price_asc' | 'price_desc';

export default function Index({ data, sort = 'news', search, stock, price }: IndexProductProps) {
    return (
        <ProductListPage
            title={search ? `Résultats de recherche pour "${search}"` : 'Tous les produits'}
            products={data}
            sort={sort}
            stock={stock}
            price={price}
        />
    );
}

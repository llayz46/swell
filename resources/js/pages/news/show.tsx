import type { PaginatedResponse, Product } from '@/types';
import { ProductListPage } from '@/components/product-list-page';

interface PromotionsProps {
    products: PaginatedResponse<Product>;
    sort: SortType;
    stock: { in: boolean, out: boolean }
}

type SortType = 'news' | 'price_asc' | 'price_desc';

export default function Show({ products, sort = 'news', stock }: PromotionsProps) {
    return (
        <ProductListPage
            title="Nouveautés"
            products={products}
            sort={sort}
            stock={stock}
        />
    )
}

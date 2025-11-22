import { ProductListPage } from '@/components/swell/product/product-list-page';
import type { PaginatedResponse, Product } from '@/types';

interface PromotionsProps {
    products: PaginatedResponse<Product>;
    sort: SortType;
    stock: { in: boolean; out: boolean };
}

type SortType = 'news' | 'price_asc' | 'price_desc';

export default function Show({ products, sort = 'news', stock }: PromotionsProps) {
    return <ProductListPage title="Promotions" products={products} sort={sort} stock={stock} />;
}

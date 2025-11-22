import { ProductListPage } from '@/components/swell/product/product-list-page';
import type { Category, PaginatedResponse, Product } from '@/types';

interface ShowProductProps {
    category: Category;
    data: PaginatedResponse<Product>;
    sort: SortType;
    stock: { in: boolean; out: boolean };
    price: { min: number | null; max: number | null; max_available: number };
}

type SortType = 'news' | 'price_asc' | 'price_desc';

export default function Show({ category, data, sort = 'news', stock, price }: ShowProductProps) {
    return <ProductListPage title={`${category.parent?.name} - ${category.name}`} products={data} sort={sort} stock={stock} price={price} />;
}

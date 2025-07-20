import type { Category, PaginatedResponse, Product } from '@/types';
import { ProductListPage } from '@/components/product-list-page';

interface ShowProductProps {
    category: Category;
    data: PaginatedResponse<Product>;
    sort: SortType;
    stock: { in: boolean, out: boolean }
}

type SortType = 'news' | 'price_asc' | 'price_desc';

export default function Show({ category, data, sort = 'news', stock }: ShowProductProps) {
    return (
        <ProductListPage
            title={`${category.parent?.name} - ${category.name}`}
            products={data}
            sort={sort}
            stock={stock}
        />
    )
}

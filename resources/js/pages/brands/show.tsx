import { ProductListPage } from '@/components/swell/product/product-list-page';
import type { Brand, PaginatedResponse, Product } from '@/types';

interface BrandProps {
    brand: Brand;
    products: PaginatedResponse<Product>;
    sort: SortType;
    stock: { in: boolean; out: boolean };
    price: { min: number | null; max: number | null; max_available: number };
}

type SortType = 'news' | 'price_asc' | 'price_desc';

export default function Show({ brand, products, sort = 'news', stock, price }: BrandProps) {
    return <ProductListPage title={brand.name} products={products} sort={sort} stock={stock} price={price} />;
}

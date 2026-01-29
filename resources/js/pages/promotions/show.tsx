import { ProductListPage } from '@/components/swell/product/product-list-page';
import type { PaginatedResponse, Product } from '@/types';
import { useTranslation } from 'react-i18next';

interface PromotionsProps {
    products: PaginatedResponse<Product>;
    sort: SortType;
    stock: { in: boolean; out: boolean };
}

type SortType = 'news' | 'price_asc' | 'price_desc';

export default function Show({ products, sort = 'news', stock }: PromotionsProps) {
    const { t } = useTranslation();

    return <ProductListPage title={t('nav.promotions')} products={products} sort={sort} stock={stock} />;
}

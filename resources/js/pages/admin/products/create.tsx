import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, Product } from '@/types';
import { ProductFormPage } from '@/components/swell/product/product-form-page';

interface ProductCreateType {
    breadcrumbs: BreadcrumbItem[];
    brands: { id: number; name: string }[];
    collections: { id: number; title: string, products: { id: number; name: string; collection_id: number }[] }[];
    product?: Product;
    duplicate: boolean;
}

export default function Create({ breadcrumbs, brands, collections, product, duplicate }: ProductCreateType) {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer un produit" />

            <ProductFormPage
                brands={brands}
                collections={collections}
                product={product}
                isDuplicate={duplicate}
            />
        </AdminLayout>
    )
}

import { ProductFormPage } from '@/components/swell/product/product-form-page';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, Product } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface ProductCreateType {
    breadcrumbs: BreadcrumbItem[];
    brands: { id: number; name: string }[];
    collections: { id: number; title: string; products: { id: number; name: string; collection_id: number }[] }[];
    product?: Product;
    duplicate: boolean;
}

export default function Create({ breadcrumbs, brands, collections, product, duplicate }: ProductCreateType) {
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1]);
    const collectionId = params.get('collection_id');

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer un produit" />

            <ProductFormPage
                brands={brands}
                collections={collections}
                product={product}
                isDuplicate={duplicate}
                preselectedCollectionId={collectionId ?? undefined}
            />
        </AdminLayout>
    );
}

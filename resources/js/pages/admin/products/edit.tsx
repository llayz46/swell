import { destroy } from '@/actions/App/Http/Controllers/Admin/ProductController';
import { ConfirmDeleteDialog } from '@/components/swell/confirm-delete-dialog';
import { ProductFormPage } from '@/components/swell/product/product-form-page';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, Product } from '@/types';
import { Head } from '@inertiajs/react';
import { Package } from 'lucide-react';
import { useState } from 'react';

interface ProductType {
    breadcrumbs: BreadcrumbItem[];
    product: Product;
    brands: {
        id: number;
        name: string;
    }[];
    collections: {
        id: number;
        title: string;
        products: {
            id: number;
            name: string;
        }[];
    }[];
}

export default function Edit({ breadcrumbs, product, brands, collections }: ProductType) {
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modification : ${product.name}`} />

            <ProductFormPage product={product} brands={brands} collections={collections} isDuplicate={false} setDeleteProduct={setDeleteProduct} />

            <ConfirmDeleteDialog
                item={deleteProduct}
                open={!!deleteProduct}
                onClose={() => setDeleteProduct(null)}
                itemNameKey="name"
                deleteRoute={(item) => destroy.url(item.slug)}
                itemLabel="produit"
                icon={<Package className="size-4" />}
                prefix="Le"
            />
        </AdminLayout>
    );
}

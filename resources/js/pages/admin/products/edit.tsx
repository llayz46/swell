import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem, Product } from '@/types';
import { Package } from 'lucide-react';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import { useState } from 'react';
import { ProductFormPage } from '@/components/product-form-page';

interface ProductType {
    breadcrumbs: BreadcrumbItem[];
    product: Product;
    brands: {
        id: number;
        name: string;
    }[];
    groups: {
        id: number;
        name: string;
        products: {
            id: number;
            name: string;
        }[];
    }[]
}

export default function Edit({ breadcrumbs, product, brands, groups }: ProductType) {
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modification : ${product.name}`} />

            <ProductFormPage
                product={product}
                brands={brands}
                groups={groups}
                isDuplicate={false}
                setDeleteProduct={setDeleteProduct}
            />

            <ConfirmDeleteDialog
                item={deleteProduct}
                open={!!deleteProduct}
                onClose={() => setDeleteProduct(null)}
                itemNameKey="name"
                deleteRoute={(item) => route('admin.products.destroy', item.slug)}
                itemLabel="produit"
                icon={<Package className="size-4" />}
                prefix="Le"
            />
        </AdminLayout>
    );
}

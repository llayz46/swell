import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Heart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/hooks/use-wishlist';
import { getStorageUrl } from '@/utils/format-storage-url';

export function ProductCard({ product, onQuickView }: { product: Product, onQuickView?: () => void }) {
    const [isHovered, setIsHovered] = useState(false)
    const { addItem } = useWishlist();

    return (
        <Card className="group gap-0 overflow-hidden h-full rounded-md p-0 transition-all duration-300 hover:shadow-md">
            <div
                className="relative aspect-[4/3] overflow-hidden bg-gray-100"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img
                    src={getStorageUrl(product.featured_image?.image_url)}
                    alt={product.featured_image?.alt_text}
                    className="size-full object-cover transition-transform duration-500 bg-muted group-hover:scale-103"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                <div
                    className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
                        isHovered ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
                    }`}
                >
                    <Button
                        size="sm"
                        variant="secondary"
                        className="size-10 cursor-pointer bg-white p-0 shadow-md backdrop-blur-sm hover:bg-gray-100"
                        onClick={() => addItem(product)}
                    >
                        <Heart className="size-4 dark:text-background" />
                        <span className="sr-only">Ajouter à la wishlist</span>
                    </Button>

                    <Button
                        size="sm"
                        variant="secondary"
                        className="size-10 cursor-pointer bg-white p-0 shadow-md backdrop-blur-sm hover:bg-gray-100"
                        onClick={onQuickView}
                    >
                        <Eye className="size-4 dark:text-background" />
                        <span className="sr-only">Voir les détails</span>
                    </Button>
                </div>
            </div>

            <CardContent className="flex flex-1 flex-col p-4">
                <div className="h-6 mb-1">
                    {product.isNew && (
                        <Badge variant="secondary" className="flex w-fit items-center gap-1.5 rounded-sm px-1.5 py-0.75 text-[10px] font-semibold dark:text-white">
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                            NEW
                        </Badge>
                    )}
                </div>

                <div className="mb-2">
                    <Link href={route('product.show', product.slug)} className="mt-3 mb-1 line-clamp-1 text-base leading-tight font-semibold hover:underline">
                        {product.brand.name} {product.name}
                    </Link>

                    <span className="text-sm font-bold">{product.discount_price?.toFixed(2) ?? product.price.toFixed(2)} €</span>
                </div>

                <div className="mt-auto flex items-center gap-2">
                    <span className={cn("block size-2 rounded-full", product.stock === 0 ? "bg-red-500/90" : product.stock < 11 ? "bg-orange-500/90" : "bg-green-500/90")} />
                    <span className="text-xs font-medium text-muted-foreground">{product.stock === 0 ? 'Indisponible' : product.stock < 11 ? `Reste ${product.stock}` : 'En stock'}</span>
                </div>
            </CardContent>
        </Card>
    );
}

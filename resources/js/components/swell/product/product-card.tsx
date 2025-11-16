import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Heart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Product, type SharedData } from '@/types';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/hooks/use-wishlist';
import { getStorageUrl } from '@/utils/format-storage-url';

export function ProductCard({ product, onQuickView }: { product: Product, onQuickView?: () => void }) {
    const [isHovered, setIsHovered] = useState(false)
    const { addItem } = useWishlist();
    const { swell } = usePage<SharedData>().props

    return (
        <Card className="bg-slate-light shadow-inner border-transparent p-1 gap-0 overflow-hidden h-full rounded-xl">
            <div
                className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-xs-with-border"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img
                    src={getStorageUrl(product.featured_image?.url)}
                    alt={product.featured_image?.alt_text}
                    className="rounded-lg size-full object-cover bg-muted"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                <div
                    className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
                        isHovered ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
                    }`}
                >
                    {swell.wishlist.enabled && (
                        <Button
                            size="sm"
                            variant="secondary"
                            className="size-9 cursor-pointer p-0 rounded-md !bg-slate-light shadow-inner"
                            onClick={() => addItem(product)}
                        >
                            <Heart className="size-4 dark:text-background" />
                            <span className="sr-only">Ajouter à la wishlist</span>
                        </Button>
                    )}

                    <Button
                        size="sm"
                        variant="secondary"
                        className="size-9 cursor-pointer p-0 rounded-md !bg-slate-light shadow-inner"
                        onClick={onQuickView}
                    >
                        <Eye className="size-4 dark:text-background" />
                        <span className="sr-only">Voir les détails</span>
                    </Button>
                </div>
            </div>

            <CardContent className="flex flex-1 flex-col p-3">
                <div className="mb-2">
                    <Link href={route('product.show', product.slug)} className="mb-1 line-clamp-1 text-base leading-tight font-semibold hover:underline">
                        {product.brand.name} {product.name}
                    </Link>

                    {product.discount_price != null ? (
                        <div className="flex items-baseline gap-2">
                            <span className="text-base font-bold">{product.discount_price.toFixed(2)} €</span>
                            <span className="text-sm mb-auto line-through text-muted-foreground">{product.price.toFixed(2)} €</span>
                        </div>
                    ) : (
                        <span className="text-sm font-bold">{product.price.toFixed(2)} €</span>
                    )}
                </div>

                <div className="mt-auto flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <span className={cn("block size-2 rounded-full", product.stock === 0 ? "bg-red-500/90" : product.stock < 11 ? "bg-orange-500/90" : "bg-green-500/90")} />
                        <span className="text-xs font-medium text-muted-foreground">{product.stock === 0 ? 'Indisponible' : product.stock < 11 ? `Reste ${product.stock}` : 'En stock'}</span>
                    </div>
                    {product.isNew && (
                        <Badge variant="secondary" className="bg-muted flex w-fit items-center gap-1.5 rounded-md px-1.5 py-0.75 text-[10px] font-semibold dark:text-white">
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                            NEW
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

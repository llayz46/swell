import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWishlist } from '@/hooks/use-wishlist';
import { cn } from '@/lib/utils';
import { Product, type SharedData } from '@/types';
import { getStorageUrl } from '@/utils/format-storage-url';
import { Link, usePage } from '@inertiajs/react';
import { Heart, Star } from 'lucide-react';
import { useState } from 'react';

export function ProductCard({ product, onQuickView }: { product: Product; onQuickView?: () => void }) {
    const [isHovered, setIsHovered] = useState(false);
    const [, setIsClicked] = useState(false);
    const { addItem } = useWishlist();
    const { swell } = usePage<SharedData>().props;

    const handleImageClick = () => {
        if (!onQuickView) return;

        setIsClicked(true);

        setTimeout(() => {
            setIsClicked(false);
        }, 200);

        onQuickView();
    };

    return (
        <Card className="h-full gap-0 overflow-hidden rounded-xl border-transparent bg-slate-light p-1 shadow-inner">
            <div
                className="shadow-xs-with-border relative aspect-4/3 overflow-hidden rounded-lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img
                    onClick={handleImageClick}
                    src={getStorageUrl(product.featured_image?.url)}
                    alt={product.featured_image?.alt_text}
                    className="size-full rounded-lg bg-muted object-cover transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
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
                            className="size-9 cursor-pointer rounded-md bg-slate-light! p-0 shadow-inner"
                            onClick={() => addItem(product)}
                        >
                            <Heart className="size-4 dark:text-background" />
                            <span className="sr-only">Ajouter à la wishlist</span>
                        </Button>
                    )}
                </div>
            </div>

            <CardContent className="flex flex-1 flex-col p-3">
                <div className="mb-2">
                    <Link
                        href={route('product.show', product.slug)}
                        className="mb-1 line-clamp-1 text-base leading-tight font-semibold hover:underline"
                    >
                        {product.brand.name} {product.name}
                    </Link>

                    {product.discount_price != null ? (
                        <div className="flex items-baseline gap-2">
                            <span className="text-base font-bold">{product.discount_price.toFixed(2)} €</span>
                            <span className="mb-auto text-sm text-muted-foreground line-through">{product.price.toFixed(2)} €</span>
                        </div>
                    ) : (
                        <span className="text-sm font-bold">{product.price.toFixed(2)} €</span>
                    )}
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span
                            className={cn(
                                'block size-2 rounded-full',
                                product.stock === 0 ? 'bg-red-500/90' : product.stock < 11 ? 'bg-orange-500/90' : 'bg-green-500/90',
                            )}
                        />
                        <span className="text-xs font-medium text-muted-foreground">
                            {product.stock === 0 ? 'Indisponible' : product.stock < 11 ? `Reste ${product.stock}` : 'En stock'}
                        </span>
                    </div>
                    {product.isNew && (
                        <Badge
                            variant="secondary"
                            className="flex w-fit items-center gap-1.5 rounded-md bg-muted px-1.5 py-0.75 text-[10px] font-semibold dark:text-white"
                        >
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                            Nouveauté
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

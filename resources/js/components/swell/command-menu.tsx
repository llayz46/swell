import { index as indexProduct } from "@/routes/product";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Product, SharedData } from "@/types";
import { Link, router, usePage } from '@inertiajs/react';
import { cn } from "@/lib/utils"
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function CommandMenu() {
    const { defaultSearchProducts } = usePage<SharedData>().props;
    
    const [open, setOpen] = useState<boolean>(false);
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    // Recherche debounced
    const searchProducts = useMemo(
        () =>
            debounce(async (searchQuery: string) => {
                if (searchQuery.length < 2) {
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                try {
                    const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
                    const data = await response.json();
                    setProducts(data.products);
                } catch (error) {
                    console.error('Search error:', error);
                    setProducts([]);
                } finally {
                    setLoading(false);
                }
            }, 300),
        [],
    );

    const handleSearch = useCallback(
        (value: string) => {
            setQuery(value);
            if (value.length >= 2) {
                setLoading(true);
            }
            searchProducts(value);
        },
        [searchProducts],
    );

    const handleSelectProduct = (slug: string) => {
        setOpen(false);
        router.visit(`/products/${slug}`);
    };

    // const handleViewAllResults = () => {
    //     setOpen(false);
    //     router.visit(index.url({ query: { search: query } }));
    // };

    // const handleOpenChange = (isOpen: boolean) => {
    //     setOpen(isOpen);
    //     if (!isOpen) {
    //         setQuery('');
    //         setProducts([]);
    //     }
    // };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "text-foreground dark:bg-card hover:bg-muted/50 relative h-8 min-w-full justify-start pl-3 font-normal shadow-none sm:pr-12 md:w-48 lg:w-56 xl:w-64"
                    )}
                >
                    <span className="hidden lg:inline-flex">Search documentation...</span>
                    <span className="inline-flex lg:hidden">Search...</span>
                    <div className="absolute top-1.5 right-1.5 hidden gap-1 group-has-data-[slot=designer]/body:hidden sm:flex">
                    <Kbd>⌘K</Kbd>
                    </div>
                </Button>
            </DialogTrigger>
            
            <DialogContent
                showCloseButton={false}
                className="bg-transparent border-none p-0"
            >
                <Command
                    shouldFilter={false}
                    className="bg-background p-2 shadow-dialog rounded-2xl **:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input-wrapper]:border-input `**:data-[slot=command-input]:h-9! **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:!h-9 **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border"
                >
                    <CommandInput placeholder="Rechercher un produit..." value={query} onValueChange={handleSearch} />
                    <CommandList className="no-scrollbar">
                        {loading && (
                            <div className="flex items-center justify-center py-6">
                                <Spinner />
                            </div>
                        )}
                        
                        {!loading && query.length >= 2 && products.length === 0 && (
                            <div className="text-muted-foreground py-6 text-center text-sm">
                                Aucun produit trouvé.
                            </div>
                        )}
                      
                        <CommandGroup heading="Produits">
                            {defaultSearchProducts.map(product => (
                                <CommandItem
                                    key={product.id}
                                    value={product.name}
                                    onSelect={() => handleSelectProduct(product.slug)}
                                    className="flex cursor-pointer items-center gap-3 py-2"
                                >
                                    <div className="flex-1 overflow-hidden">
                                        <p className="truncate font-medium">{product.brand?.name} - {product.name}</p>
                                    </div>
                                    <div className="text-right">
                                        {product.discount_price != null ? (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm font-medium">{product.discount_price.toFixed(2)} €</span>
                                                <span className="mb-auto text-xs text-muted-foreground line-through">{product.price.toFixed(2)} €</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm font-medium">{product.price.toFixed(2)} €</span>
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>  
                        
                        {!loading && products.length > 0 && (
                            <CommandGroup
                                heading="Produits"
                                headingAction={
                                    <Link
                                        href={indexProduct.url({
                                            query: { search: query },
                                        })}
                                        className="text-xs hover:underline"
                                    >
                                        Voir les résultats
                                    </Link>
                                }
                            >
                                {products.map((product) => (
                                    <CommandItem
                                        key={product.id}
                                        value={product.name}
                                        onSelect={() => handleSelectProduct(product.slug)}
                                        className="flex cursor-pointer items-center gap-3 py-2"
                                    >
                                        <div className="flex-1 overflow-hidden">
                                            <p className="truncate font-medium">{product.brand?.name} - {product.name}</p>
                                        </div>
                                        <div className="text-right">
                                            {product.discount_price != null ? (
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-sm font-medium">{product.discount_price.toFixed(2)} €</span>
                                                    <span className="mb-auto text-xs text-muted-foreground line-through">{product.price.toFixed(2)} €</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm font-medium">{product.price.toFixed(2)} €</span>
                                            )}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                        
                        <CommandGroup heading="Settings">
                            <CommandItem>Profile</CommandItem>
                            <CommandItem>Billing</CommandItem>
                            <CommandItem>Settings</CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
}
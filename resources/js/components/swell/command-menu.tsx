import { index as brandIndex } from '@/routes/brand';
import { index as ordersIndex } from '@/routes/orders';
import { index as productIndex } from '@/routes/product';
import { edit as profileEdit } from '@/routes/profile';
import { index as loyaltyIndex } from '@/routes/loyalty';
import { index as wishlistIndex } from '@/routes/wishlist';
import { home, login, register, logout } from '@/routes';
import { overview } from '@/routes/workspace/my-issues';
import { dashboard } from '@/routes/admin';
import { index as indexProduct } from '@/routes/product';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';
import { Spinner } from '@/components/ui/spinner';
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { Product, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import debounce from 'lodash.debounce';
import {
    ArrowLeft,
    Check,
    ChevronRight,
    Gift,
    Heart,
    Home,
    LogIn,
    LogOut,
    Monitor,
    Moon,
    Package,
    Settings,
    ShieldCheck,
    ShoppingBag,
    Sun,
    Tag,
    UserPlus,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Page = 'home' | 'theme';

const themeItems: { value: Appearance; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Clair' },
    { value: 'dark', icon: Moon, label: 'Sombre' },
    { value: 'system', icon: Monitor, label: 'Système' },
];

export function CommandMenu() {
    const page = usePage<SharedData>();
    const { defaultSearchProducts, swell, auth } = page.props;
    const { appearance, updateAppearance } = useAppearance();

    const [open, setOpen] = useState<boolean>(false);
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>('home');

    const isAuthenticated = !!auth.user;
    const isAdmin = isAuthenticated && auth.user.roles.some((role) => (typeof role === 'string' ? role === 'admin' : role.name === 'admin'));

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

    const handleThemeChange = (theme: Appearance) => {
        updateAppearance(theme);
        setCurrentPage('home');
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            setQuery('');
            setProducts([]);
            setCurrentPage('home');
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'text-foreground dark:bg-card hover:bg-muted/50 relative h-8 min-w-full justify-start pl-3 font-normal shadow-none sm:pr-12 md:w-48 lg:w-56 xl:w-64',
                    )}
                >
                    <span className="inline-flex">Rechercher...</span>
                    <div className="absolute top-1.5 right-1.5 hidden gap-1 group-has-data-[slot=designer]/body:hidden sm:flex">
                        <Kbd>⌘K</Kbd>
                    </div>
                </Button>
            </DialogTrigger>

            <DialogContent showCloseButton={false} className="border-none bg-transparent p-0">
                <Command
                    shouldFilter={false}
                    className="bg-background shadow-dialog rounded-2xl p-2 **:data-[slot=command-input-wrapper]:border-input **:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:!h-9 **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border **:data-[slot=command-input]:py-0"
                >
                    {currentPage === 'home' && (
                        <>
                            <CommandInput placeholder="Rechercher..." value={query} onValueChange={handleSearch} />
                            
                            <CommandList className="no-scrollbar">
                                {loading && (
                                    <div className="flex items-center justify-center py-6">
                                        <Spinner />
                                    </div>
                                )}

                                {!loading && query.length >= 2 && products.length === 0 && (
                                    <div className="text-muted-foreground py-6 text-center text-sm">Aucun résultat trouvé.</div>
                                )}

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
                                                Voir tout
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
                                                <Package className="size-4" />
                                                
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="truncate">
                                                        <span className="font-medium">{product.brand?.name}</span> - {product.name}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    {product.discount_price != null ? (
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-sm font-medium">{product.discount_price.toFixed(2)} €</span>
                                                            <span className="text-muted-foreground mb-auto text-xs line-through">
                                                                {product.price.toFixed(2)} €
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm font-medium">{product.price.toFixed(2)} €</span>
                                                    )}
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}

                                {!loading && query.length < 2 && (
                                    <>
                                        {defaultSearchProducts.length > 0 && (
                                            <CommandGroup heading="Suggestions">
                                                {defaultSearchProducts.map((product) => (
                                                    <CommandItem
                                                        key={product.id}
                                                        value={product.name}
                                                        onSelect={() => handleSelectProduct(product.slug)}
                                                        className="flex cursor-pointer items-center gap-3 py-2"
                                                    >
                                                        <Package className="size-4" />
                                                        
                                                        <div className="flex-1 overflow-hidden">
                                                            <p className="truncate">
                                                                <span className="font-medium">{product.brand?.name}</span> - {product.name}
                                                            </p>
                                                        </div>
                                                        
                                                        <div className="text-right">
                                                            {product.discount_price != null ? (
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className="text-sm font-medium">{product.discount_price.toFixed(2)} €</span>
                                                                    <span className="text-muted-foreground mb-auto text-xs line-through">
                                                                        {product.price.toFixed(2)} €
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-sm font-medium">{product.price.toFixed(2)} €</span>
                                                            )}
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        )}

                                        <CommandSeparator className="my-2" />

                                        <CommandGroup heading="Navigation">
                                            <CommandItem asChild className="cursor-pointer">
                                                <Link prefetch href={home()}>
                                                    <Home className="size-4" />
                                                    <span>Accueil</span>
                                                </Link>
                                            </CommandItem>
                                            <CommandItem asChild className="cursor-pointer">
                                                <Link href={productIndex()}>
                                                    <ShoppingBag className="size-4" />
                                                    <span>Produits</span>
                                                </Link>
                                            </CommandItem>
                                            <CommandItem asChild className="cursor-pointer">
                                                <Link href={brandIndex()}>
                                                    <Tag className="size-4" />
                                                    <span>Marques</span>
                                                </Link>
                                            </CommandItem>
                                        </CommandGroup>

                                        <CommandSeparator className="my-2" />

                                        {isAuthenticated ? (
                                            <CommandGroup heading="Compte">
                                                <CommandItem asChild className="cursor-pointer">
                                                    <Link prefetch href={profileEdit()}>
                                                        <Settings className="size-4" />
                                                        <span>Paramètres</span>
                                                    </Link>
                                                </CommandItem>
                                                <CommandItem asChild className="cursor-pointer">
                                                    <Link href={ordersIndex()}>
                                                        <ShoppingBag className="size-4" />
                                                        <span>Mes commandes</span>
                                                    </Link>
                                                </CommandItem>
                                                {swell.wishlist.enabled && (
                                                    <CommandItem asChild className="cursor-pointer">
                                                        <Link href={wishlistIndex()}>
                                                            <Heart className="size-4" />
                                                            <span>Ma wishlist</span>
                                                        </Link>
                                                    </CommandItem>
                                                )}
                                                {swell.loyalty.enabled && (
                                                    <CommandItem asChild className="cursor-pointer">
                                                        <Link href={loyaltyIndex()}>
                                                            <Gift className="size-4" />
                                                            <span>Fidélité</span>
                                                        </Link>
                                                    </CommandItem>
                                                )}
                                            </CommandGroup>
                                        ) : (
                                            <CommandGroup heading="Compte">
                                                <CommandItem asChild className="cursor-pointer">
                                                    <Link href={login()}>
                                                        <LogIn className="size-4" />
                                                        <span>Connexion</span>
                                                    </Link>
                                                </CommandItem>
                                                <CommandItem asChild className="cursor-pointer">
                                                    <Link href={register()}>
                                                        <UserPlus className="size-4" />
                                                        <span>Inscription</span>
                                                    </Link>
                                                </CommandItem>
                                            </CommandGroup>
                                        )}

                                        <CommandSeparator className="my-2" />

                                        <CommandGroup heading="Préférences">
                                            <CommandItem onSelect={() => setCurrentPage('theme')} className="cursor-pointer">
                                                {appearance === 'light' ? (
                                                    <Sun className="size-4" />
                                                ) : appearance === 'dark' ? (
                                                    <Moon className="size-4" />
                                                ) : (
                                                    <Monitor className="size-4" />
                                                )}
                                                <span>Thème</span>
                                                <ChevronRight className="ml-auto size-4" />
                                            </CommandItem>
                                        </CommandGroup>

                                        {isAdmin && (
                                            <>
                                                <CommandSeparator className="my-2" />
                                                
                                                <CommandGroup heading="Administration">
                                                    <CommandItem asChild className="cursor-pointer">
                                                        <Link href={dashboard()}>
                                                            <ShieldCheck className="size-4" />
                                                            <span>Admin Dashboard</span>
                                                        </Link>
                                                    </CommandItem>
                                                </CommandGroup>
                                            </>
                                        )}
                                        
                                        {auth.isWorkspaceUser && (
                                            <>
                                                <CommandSeparator className="my-2" />
                                                
                                                <CommandGroup heading="Gestion de projet">
                                                    <CommandItem asChild className="cursor-pointer">
                                                        <Link href={overview()}>
                                                            <ShieldCheck className="size-4" />
                                                            <span>Workspace</span>
                                                        </Link>
                                                    </CommandItem>
                                                </CommandGroup>
                                            </>
                                        )}

                                        {isAuthenticated && (
                                            <>
                                                <CommandSeparator className="my-2" />
                                                
                                                <CommandGroup>
                                                    <CommandItem asChild className="w-full cursor-pointer">
                                                        <Link href={logout()}>
                                                            <LogOut className="size-4" />
                                                            <span>Déconnexion</span>
                                                        </Link>
                                                    </CommandItem>
                                                </CommandGroup>
                                            </>
                                        )}
                                    </>
                                )}
                            </CommandList>
                        </>
                    )}

                    {currentPage === 'theme' && (
                        <>
                            <div className="flex items-center gap-2 border-b px-3 py-2">
                                <button
                                    onClick={() => setCurrentPage('home')}
                                    className="hover:bg-muted rounded-md p-1 transition-colors"
                                >
                                    <ArrowLeft className="size-4" />
                                </button>
                                <span className="text-sm font-medium">Choisir un thème</span>
                            </div>
                            
                            <CommandList className="mt-2 no-scrollbar">
                                <CommandGroup>
                                    {themeItems.map(({ value, icon: Icon, label }) => (
                                        <CommandItem
                                            key={value}
                                            onSelect={() => handleThemeChange(value)}
                                            className="cursor-pointer"
                                        >
                                            <Icon className="size-4" />
                                            <span>{label}</span>
                                            {appearance === value && <Check className="ml-auto size-4" />}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </>
                    )}
                </Command>
            </DialogContent>
        </Dialog>
    );
}
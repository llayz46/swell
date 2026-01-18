import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';
import { Spinner } from '@/components/ui/spinner';
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { home, login, logout, register } from '@/routes';
import { dashboard } from '@/routes/admin';
import { index as brandIndex } from '@/routes/brand';
import { index as loyaltyIndex } from '@/routes/loyalty';
import { index as ordersIndex } from '@/routes/orders';
import { index as indexProduct, index as productIndex, show as productShow } from '@/routes/product';
import { edit as profileEdit } from '@/routes/profile';
import { index as wishlistIndex } from '@/routes/wishlist';
import { overview } from '@/routes/workspace/my-issues';
import { Product, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import debounce from 'lodash.debounce';
import {
    ArrowLeft,
    Check,
    ChevronRight,
    Gift,
    Heart,
    Home,
    LayoutGrid,
    LogIn,
    LogOut,
    Monitor,
    Moon,
    Package,
    Search,
    Settings,
    ShieldCheck,
    ShoppingBag,
    Sun,
    Tag,
    Terminal,
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

    const isCommandMode = query.startsWith('>');
    const searchQuery = isCommandMode ? query.slice(1).trim() : query;
    const isSearching = !isCommandMode && searchQuery.length >= 2;

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
            debounce(async (q: string) => {
                if (q.length < 2) {
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                try {
                    const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
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

            if (value.startsWith('>')) {
                setProducts([]);
                setLoading(false);
                return;
            }

            if (value.length >= 2) {
                setLoading(true);
            } else {
                setProducts([]);
            }
            searchProducts(value);
        },
        [searchProducts],
    );

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

    const handleOpenTheme = async () => {
        const queryCommandMode = query.startsWith('>');

        await setQuery('');

        setCurrentPage('theme');

        if (queryCommandMode) setQuery('>');
    };

    const customFilter = useCallback((value: string, search: string) => {
        const cleanSearch = search.startsWith('>') ? search.slice(1).trim().toLowerCase() : search.toLowerCase();
        if (!cleanSearch) return 1;
        return value.toLowerCase().includes(cleanSearch) ? 1 : 0;
    }, []);

    const shouldAlwaysRenderSeparator = !isCommandMode || !searchQuery;

    const CommandMenuItems = () => (
        <>
            <CommandGroup heading="Navigation" className="px-1">
                <CommandItem asChild className="cursor-pointer" value="accueil home">
                    <Link prefetch href={home()}>
                        <Home className="size-4" />
                        <span>Accueil</span>
                    </Link>
                </CommandItem>
                <CommandItem asChild className="cursor-pointer" value="produits products catalogue">
                    <Link href={productIndex()}>
                        <ShoppingBag className="size-4" />
                        <span>Produits</span>
                    </Link>
                </CommandItem>
                <CommandItem asChild className="cursor-pointer" value="marques brands">
                    <Link href={brandIndex()}>
                        <Tag className="size-4" />
                        <span>Marques</span>
                    </Link>
                </CommandItem>
            </CommandGroup>

            <CommandSeparator alwaysRender={shouldAlwaysRenderSeparator} className="my-2" />

            {isAuthenticated ? (
                <CommandGroup heading="Compte" className="px-1">
                    <CommandItem asChild className="cursor-pointer" value="parametres paramètres settings configuration">
                        <Link prefetch href={profileEdit()}>
                            <Settings className="size-4" />
                            <span>Paramètres</span>
                        </Link>
                    </CommandItem>
                    <CommandItem asChild className="cursor-pointer" value="mes commandes orders historique">
                        <Link href={ordersIndex()}>
                            <LayoutGrid className="size-4" />
                            <span>Mes commandes</span>
                        </Link>
                    </CommandItem>
                    {swell.wishlist.enabled && (
                        <CommandItem asChild className="cursor-pointer" value="wishlist favoris liste souhaits">
                            <Link href={wishlistIndex()}>
                                <Heart className="size-4" />
                                <span>Ma wishlist</span>
                            </Link>
                        </CommandItem>
                    )}
                    {swell.loyalty.enabled && (
                        <CommandItem asChild className="cursor-pointer" value="fidelite fidélité loyalty points recompenses récompenses">
                            <Link href={loyaltyIndex()}>
                                <Gift className="size-4" />
                                <span>Fidélité</span>
                            </Link>
                        </CommandItem>
                    )}
                </CommandGroup>
            ) : (
                <CommandGroup heading="Compte" className="px-1">
                    <CommandItem asChild className="cursor-pointer" value="connexion login se connecter">
                        <Link href={login()}>
                            <LogIn className="size-4" />
                            <span>Connexion</span>
                        </Link>
                    </CommandItem>
                    <CommandItem asChild className="cursor-pointer" value="inscription register creer créer compte">
                        <Link href={register()}>
                            <UserPlus className="size-4" />
                            <span>Inscription</span>
                        </Link>
                    </CommandItem>
                </CommandGroup>
            )}

            <CommandSeparator alwaysRender={shouldAlwaysRenderSeparator} className="my-2" />

            <CommandGroup heading="Préférences" className="px-1">
                <CommandItem onSelect={() => handleOpenTheme()} className="cursor-pointer" value="thème theme apparence appearance dark light">
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
                    <CommandSeparator alwaysRender={shouldAlwaysRenderSeparator} className="my-2" />

                    <CommandGroup heading="Administration" className="px-1">
                        <CommandItem asChild className="cursor-pointer" value="admin dashboard administration panel">
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
                    <CommandSeparator alwaysRender={shouldAlwaysRenderSeparator} className="my-2" />

                    <CommandGroup heading="Gestion de projet" className="px-1">
                        <CommandItem asChild className="cursor-pointer" value="workspace projet gestion taches tâches">
                            <Link href={overview()}>
                                <LayoutGrid className="size-4" />
                                <span>Workspace</span>
                            </Link>
                        </CommandItem>
                    </CommandGroup>
                </>
            )}

            {isAuthenticated && (
                <>
                    <CommandSeparator alwaysRender={shouldAlwaysRenderSeparator} className="my-2" />

                    <CommandGroup className="px-1">
                        <CommandItem asChild className="w-full cursor-pointer" value="deconnexion déconnexion logout se déconnecter deconnecter">
                            <Link href={logout()}>
                                <LogOut className="size-4" />
                                <span>Déconnexion</span>
                            </Link>
                        </CommandItem>
                    </CommandGroup>
                </>
            )}
        </>
    );

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'relative h-8 min-w-full justify-start pl-3 font-normal text-foreground shadow-none hover:bg-muted/50 sm:pr-12 md:w-48 lg:w-56 xl:w-64 dark:bg-card',
                    )}
                >
                    <span className="inline-flex text-muted-foreground">Rechercher un produit, une page...</span>
                    <div className="absolute top-1.5 right-1.5 hidden gap-1 group-has-data-[slot=designer]/body:hidden sm:flex">
                        <Kbd>⌘K</Kbd>
                    </div>
                </Button>
            </DialogTrigger>

            <DialogContent showCloseButton={false} className="border-none bg-transparent p-0">
                <DialogTitle className="sr-only">Rechercher un produit, une page...</DialogTitle>
                <DialogDescription className="sr-only">Rechercher un produit, une page...</DialogDescription>

                <Command
                    filter={isCommandMode ? customFilter : () => 1}
                    className="shadow-dialog rounded-2xl bg-background py-2 **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:h-9! **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border **:data-[slot=command-input-wrapper]:border-input **:data-[slot=command-input-wrapper]:bg-input/50"
                >
                    {currentPage === 'home' && (
                        <>
                            <div className="px-2">
                                <CommandInput placeholder="Rechercher un produit..." value={query} onValueChange={handleSearch} />
                            </div>

                            <div className="flex items-center gap-2 border-b px-3 py-1.5">
                                <Badge
                                    variant={isCommandMode ? 'default' : 'secondary'}
                                    className={cn('cursor-pointer gap-1 text-xs transition-colors', isCommandMode && 'bg-primary')}
                                    onClick={() => setQuery(isCommandMode ? '' : '>')}
                                >
                                    <Terminal className="size-3" />
                                    Commandes
                                </Badge>
                                <Badge
                                    variant={!isCommandMode ? 'default' : 'secondary'}
                                    className={cn('cursor-pointer gap-1 text-xs transition-colors', !isCommandMode && 'bg-primary')}
                                    onClick={() => setQuery('')}
                                >
                                    <Search className="size-3" />
                                    Produits
                                </Badge>
                                <span className="ml-auto text-xs text-muted-foreground">
                                    {isCommandMode ? 'Tapez pour filtrer' : 'Tapez pour chercher'}
                                </span>
                            </div>

                            <CommandList className="no-scrollbar">
                                {!isCommandMode && loading && (
                                    <div className="flex items-center justify-center py-6">
                                        <Spinner />
                                    </div>
                                )}

                                {!isCommandMode && !loading && isSearching && products.length === 0 && (
                                    <CommandEmpty>Aucun produit trouvé pour "{searchQuery}"</CommandEmpty>
                                )}

                                {!isCommandMode && !loading && products.length > 0 && (
                                    <CommandGroup
                                        heading="Produits"
                                        className="px-1"
                                        headingAction={
                                            <Link
                                                href={indexProduct.url({
                                                    query: { search: searchQuery },
                                                })}
                                                className="text-xs hover:underline"
                                            >
                                                Voir tout
                                            </Link>
                                        }
                                    >
                                        {products.map((product) => (
                                            <CommandItem
                                                asChild
                                                key={product.id}
                                                value={`product-${product.id}`}
                                                className="flex cursor-pointer items-center gap-3 py-2"
                                            >
                                                <Link href={productShow(product.slug)}>
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
                                                                <span className="mb-auto text-xs text-muted-foreground line-through">
                                                                    {product.price.toFixed(2)} €
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm font-medium">{product.price.toFixed(2)} €</span>
                                                        )}
                                                    </div>
                                                </Link>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}

                                {!isCommandMode && !loading && !isSearching && defaultSearchProducts.length > 0 && (
                                    <CommandGroup heading="Suggestions" className="px-1">
                                        {defaultSearchProducts.map((product) => (
                                            <CommandItem
                                                asChild
                                                key={product.id}
                                                value={`suggestion-${product.id}`}
                                                className="flex cursor-pointer items-center gap-3 py-2"
                                            >
                                                <Link href={productShow(product.slug)}>
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
                                                                <span className="mb-auto text-xs text-muted-foreground line-through">
                                                                    {product.price.toFixed(2)} €
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm font-medium">{product.price.toFixed(2)} €</span>
                                                        )}
                                                    </div>
                                                </Link>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}

                                {!isCommandMode && !loading && !isSearching && (
                                    <CommandSeparator alwaysRender={shouldAlwaysRenderSeparator} className="my-2" />
                                )}

                                {(isCommandMode || (!loading && !isSearching)) && <CommandMenuItems />}
                            </CommandList>
                        </>
                    )}

                    {currentPage === 'theme' && (
                        <>
                            <div className="flex items-center gap-2 border-b px-3 py-2">
                                <button
                                    onClick={() => {
                                        setCurrentPage('home');
                                    }}
                                    className="rounded-md p-1 transition-colors hover:bg-muted"
                                >
                                    <ArrowLeft className="size-4" />
                                </button>
                                <span className="text-sm font-medium">Choisir un thème</span>
                            </div>

                            <CommandList className="no-scrollbar mt-2">
                                <CommandGroup className="px-1">
                                    {themeItems.map(({ value, icon: Icon, label }) => (
                                        <CommandItem key={value} onSelect={() => handleThemeChange(value)} className="cursor-pointer">
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

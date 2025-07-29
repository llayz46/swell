import { Input } from '@/components/ui/input';
import { Heart, SearchIcon, User } from 'lucide-react';
import { Link, router, usePage } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/button';
import type { SharedData } from '@/types';
import { UserDropdown } from '@/components/user-dropdown';
import { CartSheet } from '@/components/swell/cart-sheet';
import { SetStateAction, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import AppLogoIcon from '@/components/app-logo-icon';

export function Header() {
    const { auth, swell } = usePage<SharedData>().props;

    const [search, setSearch] = useState<string>(() => new URLSearchParams(window.location.search).get('search') || '');

    const debouncedSearch = useMemo(() =>
        debounce((value) => {
            router.get(
                route('product.index'),
                { search: value },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 300),
    []);

    const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    return (
        <header className="layout-container flex items-center justify-between gap-6 lg:gap-12 border-b py-6">
            <div className="inline-flex w-full items-center gap-4 lg:gap-8">
                <Link prefetch href="/">
                    <div className="flex items-center gap-2 group">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground group-hover:invert transition duration-300">
                            <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                        </div>
                        <div className="hidden lg:block ml-1 grid flex-1 text-left text-2xl">
                            <span className="mb-0.5 leading-tight font-semibold">Swell</span>
                        </div>
                    </div>
                </Link>

                <div className="w-full *:not-first:mt-2">
                    <form className="relative w-full" onSubmit={(e) => e.preventDefault()}>
                        <Input
                            className="peer sm:min-w-60 ps-9 sm:pe-9"
                            placeholder="Rechercher un produit..."
                            value={search}
                            onChange={handleChange}
                        />
                        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                            <SearchIcon size={16} />
                        </div>
                    </form>
                </div>
            </div>

            <div className="inline-flex shrink-0 gap-4">
                <nav className="hidden md:block">
                    <Link href="/promotions" className={buttonVariants({ variant: 'link' })}>
                        Promotions
                    </Link>
                    <Link href="/news" className={buttonVariants({ variant: 'link' })}>
                        Nouveautés
                    </Link>
                    <Link href="/brands" className={buttonVariants({ variant: 'link' })}>
                        Marques
                    </Link>
                </nav>

                <div className="flex items-center gap-2">
                    {auth.user ? (
                        <UserDropdown user={auth.user} />
                    ) : (
                        <Link prefetch="mount" href="/login" className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
                            <User size={20} />
                        </Link>
                    )}

                    <CartSheet />

                    {swell.wishlist.enabled && (
                        <Link href="/wishlist" className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
                            <Heart size={20} />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

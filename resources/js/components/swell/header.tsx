import AppLogoIcon from '@/components/app-logo-icon';
import { CartSheet } from '@/components/swell/cart-sheet';
import { CommandMenu } from '@/components/swell/command-menu';
import { buttonVariants } from '@/components/ui/button';
import { UserDropdown } from '@/components/user-dropdown';
import { NavCategories } from '@/components/swell/nav-categories';
import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Heart, User } from 'lucide-react';

export function Header() {
    const { auth, swell } = usePage<SharedData>().props;
    const isMobile = useIsMobile();

    return (
        <>
            <header className="layout-container flex items-center justify-between gap-3 sm:gap-6 border-b py-6 lg:gap-12">
                <div className="inline-flex w-full items-center gap-4 lg:gap-8">
                    <Link prefetch href="/">
                        <div className="group flex items-center gap-2">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-sidebar-primary-foreground transition duration-300 group-hover:invert">
                                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                            </div>
                            <div className="ml-1 hidden flex-1 text-left text-2xl md:block">
                                <span className="mb-0.5 leading-tight font-semibold">Swell</span>
                            </div>
                        </div>
                    </Link>
    
                    <div className="w-full">
                        <CommandMenu />
                    </div>
                </div>
    
                <div className="inline-flex shrink-0 gap-4">
                    <nav className="hidden lg:block">
                        <Link href="/promotions" className={buttonVariants({ variant: 'link' })}>
                            Promotions
                        </Link>
                        <Link href="/products?sort=news" className={buttonVariants({ variant: 'link' })}>
                            Nouveautés
                        </Link>
                        <Link href="/brands" className={buttonVariants({ variant: 'link' })}>
                            Marques
                        </Link>
                    </nav>
    
                    <div className="flex items-center sm:gap-2">
                        {auth.user ? (
                            <UserDropdown />
                        ) : (
                            <Link prefetch="mount" href="/login" className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
                                <User size={20} />
                            </Link>
                        )}
    
                        <CartSheet />
    
                        {swell.wishlist.enabled && (
                            <Link href="/wishlist" className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'hidden md:flex')}>
                                <Heart size={20} />
                            </Link>
                        )}
                        
                        {isMobile && <NavCategories />}
                    </div>
                </div>
            </header>
            
            {!isMobile && <NavCategories />}
        </>
    );
}

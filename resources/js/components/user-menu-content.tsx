import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { House, LayoutGrid, LogOut, Settings, ShieldCheckIcon } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
    page: { url: string };
}

export function UserMenuContent({ user, page }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const isAdmin = user.roles.some(role => role.name === 'admin');

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('home')} as="button" prefetch onClick={cleanup}>
                        <House className="mr-2" />
                        Accueil
                    </Link>
                </DropdownMenuItem>
                {page && page.url.startsWith('/admin') && (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={route('dashboard')} as="button" prefetch onClick={cleanup}>
                            <LayoutGrid className="mr-2" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                )}

                {isAdmin && page && page.url !== '/admin' && (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={route('admin.dashboard')} as="button" prefetch onClick={cleanup}>
                            <ShieldCheckIcon className="mr-2" />
                            Admin Dashboard
                        </Link>
                    </DropdownMenuItem>
                )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Paramètres
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" method="post" href={route('logout')} as="button" onClick={handleLogout}>
                    <LogOut className="mr-2" />
                    Déconnexion
                </Link>
            </DropdownMenuItem>
        </>
    );
}

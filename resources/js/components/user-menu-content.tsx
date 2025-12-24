import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Calendar, Gift, House, LayoutGrid, LayoutListIcon, LogOut, Settings, ShieldCheckIcon } from 'lucide-react';

export function UserMenuContent() {
    const page = usePage<SharedData>();
    const { swell, auth } = page.props;
    const cleanup = useMobileNavigation();
    const isAdmin = auth.user.roles.some((role) => role.name === 'admin');

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={auth.user} showEmail={true} />
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
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('orders.index')} as="button" onClick={cleanup}>
                        <Calendar className="mr-2" />
                        Commandes
                    </Link>
                </DropdownMenuItem>
                {swell.loyalty.enabled && (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={route('loyalty.index')} as="button" onClick={cleanup}>
                            <Gift className="mr-2" />
                            Fidélité
                        </Link>
                    </DropdownMenuItem>
                )}
                {page && page.url.startsWith('/admin') && (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={route('dashboard')} as="button" prefetch onClick={cleanup}>
                            <LayoutGrid className="mr-2" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {auth.isWorkspaceUser && (
                <>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link href="/workspace" className="block w-full">
                                <LayoutListIcon className="mr-2" />
                                <span>Workspace</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />
                </>
            )}
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Paramètres
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            {isAdmin && page && page.url !== '/admin' && (
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link className="block w-full" href={route('admin.dashboard')} as="button" prefetch onClick={cleanup}>
                                <ShieldCheckIcon className="mr-2" />
                                Admin Dashboard
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </>
            )}
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

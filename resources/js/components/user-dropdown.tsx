import { destroy as logout } from '@/actions/Laravel/Fortify/Http/Controllers/AuthenticatedSessionController';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import type { SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { CalendarIcon, GiftIcon, HeartIcon, LayoutGridIcon, LayoutListIcon, LogOutIcon, SettingsIcon, ShieldCheckIcon, UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function UserDropdown() {
    const { t } = useTranslation();
    const { swell, auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const isAdmin = auth.user.roles.some((role) => role.name === 'admin');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="Open account menu">
                    <UserIcon size={20} />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="max-w-64" align="end">
                <DropdownMenuLabel className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={auth.user.avatar_url} alt={auth.user.name} />
                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                            {getInitials(auth.user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium text-foreground">{auth.user.name}</span>
                        <span className="truncate text-xs font-normal text-muted-foreground">{auth.user.email}</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <LayoutGridIcon size={16} className="opacity-60" aria-hidden="true" />
                            <span>{t('nav.dashboard')}</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/orders" className="flex items-center gap-2">
                            <CalendarIcon size={16} className="opacity-60" aria-hidden="true" />
                            <span>{t('nav.orders')}</span>
                        </Link>
                    </DropdownMenuItem>
                    {swell.wishlist.enabled && (
                        <DropdownMenuItem asChild>
                            <Link href="/wishlist" className="flex items-center gap-2">
                                <HeartIcon size={16} className="opacity-60" aria-hidden="true" />
                                <span>{t('nav.wishlist')}</span>
                            </Link>
                        </DropdownMenuItem>
                    )}
                    {swell.loyalty.enabled && (
                        <DropdownMenuItem asChild>
                            <Link href="/loyalty" className="flex items-center gap-2">
                                <GiftIcon size={16} className="opacity-60" aria-hidden="true" />
                                <span>{t('nav.loyalty')}</span>
                            </Link>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {auth.isWorkspaceUser && (
                    <>
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href="/workspace" className="flex items-center gap-2">
                                    <LayoutListIcon size={16} className="opacity-60" aria-hidden="true" />
                                    <span>{t('nav.workspace')}</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center gap-2">
                            <SettingsIcon size={16} className="opacity-60" aria-hidden="true" />
                            <span>{t('nav.settings')}</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                {isAdmin && (
                    <>
                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href="/admin" className="flex items-center gap-2">
                                    <ShieldCheckIcon size={16} className="opacity-60" aria-hidden="true" />
                                    <span>{t('nav.admin')}</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link className="flex items-center gap-2" method="post" href={logout.url()} as="button" onClick={() => router.flushAll()}>
                        <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
                        <span>{t('nav.logout')}</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

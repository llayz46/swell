'use client';

import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { ComponentPropsWithoutRef, useEffect, useState } from 'react';

export function NavCategories() {
    const { categories } = usePage<SharedData>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

    const categoriesToRender = categories
        .filter((category) => category.is_active)
        .map((category) => ({
            ...category,
            children: category.children?.filter((child) => child.is_active),
        }));

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const isMobile = windowWidth < 768;

    if (isMobile) {
        return (
            <>
                <div className="my-2 flex justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="rounded-md p-2 hover:bg-accent"
                        aria-label="Ouvrir le menu"
                    >
                        <Menu />
                    </Button>
                </div>

                {/* Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-hidden="true"
                    />
                )}

                {/* Drawer */}
                <div
                    className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-background shadow-xl transition-transform duration-300 ease-in-out ${
                        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b p-4">
                        <h2 className="text-lg font-semibold">Catégories</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="rounded-md hover:bg-accent"
                            aria-label="Fermer le menu"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Categories List */}
                    <div className="overflow-y-auto h-[calc(100%-4rem)] p-4">
                        <ul className="flex flex-col space-y-1">
                            {categoriesToRender.map((mainCategory) => (
                                <li key={mainCategory.id} className="w-full">
                                    {mainCategory.children && mainCategory.children.length > 0 ? (
                                        <details className="group w-full">
                                            <summary className="flex cursor-pointer items-center justify-between rounded-lg p-3 font-medium transition-colors hover:bg-accent list-none">
                                                <span>{mainCategory.name}</span>
                                                <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                                            </summary>
                                            <ul className="mt-1 space-y-1 pl-2 pr-2 pb-2">
                                                {mainCategory.children.map((category) => (
                                                    <li key={category.id}>
                                                        <Link
                                                            href={`/categories/${category.slug}`}
                                                            className="block rounded-lg p-3 transition-colors hover:bg-accent border border-transparent hover:border-border"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <div className="font-medium text-sm">{category.name}</div>
                                                            {category.description && (
                                                                <p className="line-clamp-2 text-xs text-muted-foreground mt-1">
                                                                    {category.description}
                                                                </p>
                                                            )}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    ) : (
                                        <Link
                                            href={`/categories/${mainCategory.slug}`}
                                            className="block w-full rounded-lg p-3 font-medium transition-colors hover:bg-accent"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {mainCategory.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </>
        );
    }

    return (
        <NavigationMenu className="mt-4 mb-8 max-w-full *:w-full" viewport={false}>
            <NavigationMenuList className="layout-container flex justify-start">
                {categoriesToRender.map((mainCategory) => (
                    <NavigationMenuItem key={mainCategory.id}>
                        {mainCategory.children && mainCategory.children.length > 0 ? (
                            <NavigationMenuTrigger>{mainCategory.name}</NavigationMenuTrigger>
                        ) : (
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href={`/categories/${mainCategory.slug}`}>{mainCategory.name}</Link>
                            </NavigationMenuLink>
                        )}

                        {mainCategory.children && mainCategory.children.length > 0 && (
                            <NavigationMenuContent className="z-40">
                                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    {mainCategory.children?.map((category) => (
                                        <ListItem key={category.id} title={category.name} href={`/categories/${category.slug}`}>
                                            {category.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        )}
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

function ListItem({ title, children, href, ...props }: ComponentPropsWithoutRef<'li'> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href} className="block rounded-md p-2 hover:bg-secondary">
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}

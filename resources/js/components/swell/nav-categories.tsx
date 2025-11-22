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
import { Menu, X } from 'lucide-react';
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

    const isMobile = windowWidth < 768;

    if (isMobile) {
        return (
            <>
                <div className="my-2 flex justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="rounded-md p-2 hover:bg-accent"
                        aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </Button>
                </div>

                {isMobileMenuOpen && (
                    <div className="layout-container mb-4">
                        <ul className="flex flex-col space-y-2">
                            {categoriesToRender.map((mainCategory) => (
                                <li key={mainCategory.id} className="w-full">
                                    {mainCategory.children && mainCategory.children.length > 0 ? (
                                        <details className="w-full">
                                            <summary className="cursor-pointer rounded-md p-2 font-medium hover:bg-accent">
                                                {mainCategory.name}
                                            </summary>
                                            <ul className="mt-1 space-y-1 pl-4">
                                                {mainCategory.children.map((category) => (
                                                    <li key={category.id}>
                                                        <Link
                                                            href={`/categories/${category.slug}`}
                                                            className="block rounded-md p-2 text-sm hover:bg-accent"
                                                        >
                                                            <div className="font-medium">{category.name}</div>
                                                            {category.description && (
                                                                <p className="line-clamp-2 text-sm text-muted-foreground">{category.description}</p>
                                                            )}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    ) : (
                                        <Link
                                            href={`/categories/${mainCategory.slug}`}
                                            className="block w-full rounded-md p-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            {mainCategory.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
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

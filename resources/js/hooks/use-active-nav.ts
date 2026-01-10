import { usePage } from '@inertiajs/react';

/**
 * Hook to determine if a navigation item is active based on the current URL
 *
 * @param href - The href of the navigation item to check
 * @returns boolean indicating if the navigation item is active
 *
 * @example
 * const isActive = useActiveNav('/admin/products');
 */
export function useActiveNav(href: string): boolean {
    const page = usePage();
    const currentUrl = page.url;

    // Special case for /admin route - only active when URL is exactly /admin
    if (href === '/admin') {
        return currentUrl === '/admin';
    }

    // Special case for /workspace route - only active when URL is exactly /workspace
    if (href === '/workspace') {
        return currentUrl === '/workspace';
    }

    // Special case for /workspace route - only active when URL is exactly /workspace
    if (href === '/workspace/teams') {
        return currentUrl === '/workspace/teams';
    }

    // For other routes, check if:
    // 1. URL matches exactly
    // 2. URL starts with href followed by a slash (subpage)
    // 3. URL starts with href followed by a query string
    return currentUrl === href || currentUrl.startsWith(`${href}/`) || currentUrl.startsWith(`${href}?`);
}

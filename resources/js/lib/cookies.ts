/**
 * Cookie utility functions for client-side cookie management
 */

export interface CookieOptions {
    path?: string;
    maxAge?: number;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | undefined {
    const cookies = document.cookie.split(';');
    const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));
    if (!cookie) return undefined;
    return cookie.split('=')[1];
}

/**
 * Get a cookie value and parse it as a boolean
 */
export function getCookieBoolean(name: string): boolean | undefined {
    const value = getCookie(name);
    if (value === undefined) return undefined;
    return value === 'true';
}

/**
 * Set a cookie with optional configuration
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
    const {
        path = '/',
        maxAge,
        domain,
        secure,
        sameSite = 'lax',
    } = options;

    let cookieString = `${name}=${value}`;

    if (path) cookieString += `; path=${path}`;
    if (maxAge !== undefined) cookieString += `; max-age=${maxAge}`;
    if (domain) cookieString += `; domain=${domain}`;
    if (secure) cookieString += `; secure`;
    if (sameSite) cookieString += `; samesite=${sameSite}`;

    document.cookie = cookieString;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string, path: string = '/'): void {
    setCookie(name, '', { path, maxAge: 0 });
}

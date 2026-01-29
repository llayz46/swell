import { CartProvider } from '@/contexts/cart-context';
import { ConfirmProvider } from '@/contexts/confirm-context';
import { WishlistProvider } from '@/contexts/wishlist-context';
import { initI18n } from '@/i18n';
import { Cart } from '@/types';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const cart = (props.initialPage.props as unknown as { cart?: Cart | null }).cart ?? null;
        const wishlistEnabled = (props.initialPage.props as unknown as { swell?: { wishlist?: { enabled?: boolean } } }).swell?.wishlist?.enabled ?? false;
        const locale = (props.initialPage.props as unknown as { locale?: string }).locale ?? 'fr';

        initI18n(locale);

        root.render(
            <ConfirmProvider>
                <CartProvider initialCart={cart}>
                    {wishlistEnabled ? (
                        <WishlistProvider enabled={wishlistEnabled}>
                            <App {...props} />
                        </WishlistProvider>
                    ) : (
                        <App {...props} />
                    )}
                </CartProvider>
            </ConfirmProvider>,
        );
    },
    progress: {
        color: '#6b6b72',
    },
});

// This will set light / dark mode on load...
initializeTheme();

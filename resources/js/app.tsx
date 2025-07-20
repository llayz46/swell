import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { CartProvider } from '@/contexts/cart-context';
import { Cart } from '@/types';
import { WishlistProvider } from '@/contexts/wishlist-context';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const cart = (props.initialPage.props as unknown as { cart: Cart | null }).cart;

        root.render(
            <WishlistProvider>
                <CartProvider initialCart={cart}>
                    <App {...props} />
                </CartProvider>
            </WishlistProvider>
        );
    },
    progress: {
        color: '#6b6b72',
    },
});

// This will set light / dark mode on load...
initializeTheme();

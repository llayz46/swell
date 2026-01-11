import { useAppearance } from '@/hooks/use-appearance';
import { useCallback } from 'react';

/**
 * Returns a function to get storage URL with theme-aware placeholder.
 * Must be called from a React component or custom hook.
 */
export function useStorageUrl() {
    const { appearance } = useAppearance();

    return useCallback(
        (imagePath: string | null | undefined): string => {
            if (!imagePath) {
                return appearance === 'dark' ? '/placeholder-image-dark.svg' : '/placeholder-image-light.svg';
            }
            return imagePath;
        },
        [appearance],
    );
}

/**
 * Get storage URL without theme-aware placeholder.
 * Use this for non-reactive contexts or when appearance is passed explicitly.
 */
export function getStorageUrl(imagePath: string | null | undefined, appearance?: 'light' | 'dark'): string {
    if (!imagePath) {
        return appearance === 'dark' ? '/placeholder-image-dark.svg' : '/placeholder-image-light.svg';
    }
    return imagePath;
}

export function getStorageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return '/placeholder-image.svg';

    return imagePath;
}

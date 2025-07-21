export function getStorageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) {
        return '/placeholder-image.svg';
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:')) {
        return imagePath;
    }

    return `/storage/${imagePath}`;
}

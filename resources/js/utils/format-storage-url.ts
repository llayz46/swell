export function getStorageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) {
        return '/storage/images/default.png';
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:')) {
        return imagePath;
    }

    return `/storage/${imagePath}`;
}

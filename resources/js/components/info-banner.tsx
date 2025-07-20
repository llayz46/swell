import { WordRotate } from '@/components/ui/word-rotate';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

export function InfoBanner() {
    const { infoBanner } = usePage<SharedData>().props;

    const banners = infoBanner.filter(item => item.is_active);

    return (
        <div className="w-full bg-black dark:bg-white">
            <WordRotate
                duration={4000}
                className="font-bold text-center text-white dark:text-black"
                words={banners.map(item => item.message)}
            />
        </div>
    )
}

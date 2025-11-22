import { WordRotate } from '@/components/ui/word-rotate';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function InfoBanner() {
    const { infoBanner } = usePage<SharedData>().props;

    const banners = infoBanner.filter((item) => item.is_active);

    return (
        <div className="w-full bg-black dark:bg-white">
            <WordRotate duration={4000} className="text-center font-bold text-white dark:text-black" words={banners.map((item) => item.message)} />
        </div>
    );
}

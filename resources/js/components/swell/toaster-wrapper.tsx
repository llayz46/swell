import { useAppearance } from '@/hooks/use-appearance';
import { Toaster } from 'sileo';

export function ToasterWrapper() {
    const { appearance } = useAppearance();

    return (
        <Toaster
            theme={appearance}
            position="bottom-right"
        />
    );
}

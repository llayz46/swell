import { useAppearance } from '@/hooks/use-appearance';
import { Toaster } from 'sonner';

export function ToasterWrapper() {
    const { appearance } = useAppearance();

    return (
        <Toaster
            theme={appearance}
            toastOptions={{
                classNames: {
                    toast: '!bg-background !border !border-border !text-sm !font-medium !font-sans',
                    description: '!text-sm !text-muted-foreground !font-sans',
                },
            }}
        />
    );
}

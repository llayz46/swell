import { ReactNode, useCallback, useState } from 'react';

export type ConfirmOptions = {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
    icon?: ReactNode;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
};

export function useConfirm() {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions | null>(null);
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setOptions(options);
            setOpen(true);
            setResolvePromise(() => resolve);
        });
    }, []);

    const handleConfirm = async () => {
        if (options?.onConfirm) {
            await options.onConfirm();
        }
        setOpen(false);
        resolvePromise?.(true);
        setResolvePromise(null);
    };

    const handleCancel = () => {
        if (options?.onCancel) {
            options.onCancel();
        }
        setOpen(false);
        resolvePromise?.(false);
        setResolvePromise(null);
    };

    return {
        open,
        options,
        confirm,
        handleConfirm,
        handleCancel,
    };
}

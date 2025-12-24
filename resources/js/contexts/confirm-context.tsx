import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useConfirm, type ConfirmOptions } from '@/hooks/use-confirm';
import { CircleAlertIcon } from 'lucide-react';
import { createContext, ReactNode, useContext } from 'react';

type ConfirmContextType = {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const { open, options, confirm, handleConfirm, handleCancel } = useConfirm();

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
                <DialogContent className="shadow-dialog rounded-2xl border-transparent">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
                            {options?.icon || <CircleAlertIcon className="opacity-80" size={16} />}
                        </div>
                        <DialogHeader>
                            <DialogTitle className="sm:text-center">{options?.title}</DialogTitle>
                            {options?.description && <DialogDescription className="sm:text-center">{options.description}</DialogDescription>}
                        </DialogHeader>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>
                                {options?.cancelText || 'Annuler'}
                            </Button>
                        </DialogClose>
                        <Button type="button" className="flex-1" variant={options?.variant || 'default'} onClick={handleConfirm}>
                            {options?.confirmText || 'Confirmer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ConfirmContext.Provider>
    );
}

export const useConfirmContext = () => {
    const context = useContext(ConfirmContext);

    if (!context) {
        throw new Error('useConfirmContext doit être utilisé dans un ConfirmProvider');
    }

    return context;
};

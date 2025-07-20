import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function CartClearConfirmationDialog({ clearCart, open, onClose }: { clearCart: () => void, open: boolean, onClose: () => void }) {
    return (
        <AlertDialog open={open} onOpenChange={open => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Confirmation de la suppression du panier
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Êtes-vous sûr de vouloir vider votre panier ? Cette action est irréversible et supprimera tous les articles de votre panier.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={clearCart}>Vider le panier</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

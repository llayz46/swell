import { cn } from '@/lib/utils';
import { Inbox, PartyPopper, Sparkles } from 'lucide-react';

interface InboxEmptyStateProps {
    variant?: 'empty' | 'filtered' | 'zero';
    className?: string;
}

export function InboxEmptyState({ variant = 'empty', className }: InboxEmptyStateProps) {
    if (variant === 'zero') {
        return (
            <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
                <div className="relative">
                    <div className="flex size-20 items-center justify-center rounded-full bg-emerald-500/10">
                        <PartyPopper className="size-10 text-emerald-500" />
                    </div>
                    <Sparkles className="absolute -right-1 -top-1 size-6 text-amber-500" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Inbox Zero !</h3>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                    Vous avez traité toutes vos notifications. Profitez de ce moment de calme.
                </p>
            </div>
        );
    }

    if (variant === 'filtered') {
        return (
            <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
                <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                    <Inbox className="size-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Aucun résultat</h3>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                    Aucune notification ne correspond à vos filtres actuels. Essayez de modifier vos critères.
                </p>
            </div>
        );
    }

    return (
        <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <Inbox className="size-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Aucune notification</h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Vous n'avez pas encore de notifications. Elles apparaîtront ici lorsque quelqu'un interagira avec vos
                issues.
            </p>
        </div>
    );
}

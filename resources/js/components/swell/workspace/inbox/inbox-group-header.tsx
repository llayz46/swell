import { cn } from '@/lib/utils';

interface InboxGroupHeaderProps {
    label: string;
    count?: number;
    className?: string;
}

export function InboxGroupHeader({ label, count, className }: InboxGroupHeaderProps) {
    return (
        <div
            className={cn(
                'sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60',
                className,
            )}
        >
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
            </span>
            {count !== undefined && (
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {count}
                </span>
            )}
        </div>
    );
}

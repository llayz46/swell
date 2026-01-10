import { CardTitle, SwellCard, SwellCardContent, SwellCardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    description?: string;
    variant?: 'default' | 'warning' | 'danger' | 'success';
}

const variantStyles = {
    default: 'text-muted-foreground',
    warning: 'text-amber-500',
    danger: 'text-red-500',
    success: 'text-emerald-500',
};

const variantValueStyles = {
    default: '',
    warning: 'text-amber-600 dark:text-amber-400',
    danger: 'text-red-600 dark:text-red-400',
    success: 'text-emerald-600 dark:text-emerald-400',
};

export function StatCard({ title, value, icon: Icon, description, variant = 'default' }: StatCardProps) {
    return (
        <SwellCard>
            <SwellCardHeader>
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={cn('size-4', variantStyles[variant])} />
            </SwellCardHeader>

            <SwellCardContent>
                <div className={cn('text-2xl font-bold', variantValueStyles[variant])}>{value}</div>
                {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
            </SwellCardContent>
        </SwellCard>
    );
}

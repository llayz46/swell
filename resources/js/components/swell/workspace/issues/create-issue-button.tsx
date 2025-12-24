import { Button } from '@/components/ui/button';
import { useWorkspaceIssuesStore } from '@/stores/workspace-issues-store';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateIssueButtonProps {
    statusId?: number;
    variant?: 'default' | 'outline' | 'ghost' | 'secondary';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    children?: React.ReactNode;
}

export function CreateIssueButton({
    statusId,
    variant = 'ghost',
    size = 'icon',
    className,
    children,
}: CreateIssueButtonProps) {
    const { openIssueDialog } = useWorkspaceIssuesStore();

    return (
        <Button
            onClick={() => openIssueDialog({ statusId })}
            variant={variant}
            size={size}
            className={cn(className, 'size-6')}
        >
            {children || <Plus size={16} />}
        </Button>
    );
}

import { Button } from '@/components/ui/button';
import { useWorkspaceIssuesStore } from '@/stores/workspace-issues-store';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateIssueButtonProps {
    statusId?: string;
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
    const { openCreateIssueDialog } = useWorkspaceIssuesStore();

    return (
        <Button
            onClick={() => openCreateIssueDialog(statusId)}
            variant={variant}
            size={size}
            className={cn(className, 'size-6')}
        >
            {children || <Plus size={16} />}
        </Button>
    );
}

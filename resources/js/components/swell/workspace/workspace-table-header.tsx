import { cn } from '@/lib/utils';

interface Column {
    label: string;
    className: string;
}

interface WorkspaceTableHeaderProps {
    columns: Column[];
}

export function WorkspaceTableHeader({ columns }: WorkspaceTableHeaderProps) {
    return (
        <div className="flex items-center border-b bg-workspace px-6 py-1.5 text-sm text-muted-foreground">
            {columns.map((column, index) => (
                <div key={index} className={cn(column.className)}>
                    {column.label}
                </div>
            ))}
        </div>
    );
}

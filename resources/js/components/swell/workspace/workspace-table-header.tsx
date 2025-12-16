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
        <div className="sticky top-0 z-10 flex items-center border-b px-6 py-1.5 text-sm text-muted-foreground">
            {columns.map((column, index) => (
                <div key={index} className={cn(column.className)}>
                    {column.label}
                </div>
            ))}
        </div>
    );
}

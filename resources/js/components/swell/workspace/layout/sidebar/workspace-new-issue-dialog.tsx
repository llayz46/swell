import { Button } from '@/components/ui/button';
import { CircleFadingPlusIcon } from 'lucide-react';

export default function WorkspaceNewIssueDialog() {
    return (
        <Button size="icon" variant="ghost" className="size-8 shrink-0">
            <CircleFadingPlusIcon />
        </Button>
    );
}

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { type ComponentPropsWithoutRef } from 'react';

interface AdminSearchInputProps extends Omit<ComponentPropsWithoutRef<typeof Input>, 'className'> {
    children?: React.ReactNode;
    placeholder?: string;
}

export default function AdminSearchInput({
    children,
    placeholder = "Rechercher...",
    ...inputProps
}: AdminSearchInputProps) {
    return (
        <Card className="p-1">
            <CardContent className="p-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                                placeholder={placeholder}
                                className="border-border bg-background pl-8 text-foreground placeholder:text-muted-foreground"
                                {...inputProps}
                            />
                        </div>
                    </div>
                    {children}
                </div>
            </CardContent>
        </Card>
    );
}
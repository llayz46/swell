import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { type ComponentPropsWithoutRef } from 'react';

interface AdminSearchInputProps extends Omit<ComponentPropsWithoutRef<typeof Input>, 'className'> {
    children?: React.ReactNode;
    inputClassName?: string;
    cardClassName?: string;
}

export default function AdminSearchInput({
    children,
    inputClassName,
    cardClassName,
    placeholder = "Rechercher...",
    ...inputProps
}: AdminSearchInputProps) {
    return (
        <Card className={cardClassName ?? "border-border bg-card py-3 sm:py-4"}>
            <CardContent className="px-3 sm:px-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                                placeholder={placeholder}
                                className={inputClassName ?? "border-border bg-background pl-10 text-foreground placeholder:text-muted-foreground"}
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
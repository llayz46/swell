import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { LucideIcon, Moon, Sun, Monitor } from 'lucide-react';

export default function ThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();
    
    const items: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Clair' },
        { value: 'dark', icon: Moon, label: 'Sombre' },
        { value: 'system', icon: Monitor, label: 'Système' },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 shrink-0">
                    {appearance === 'light' ? (
                        <Sun className="size-4" />
                    ) : appearance === 'dark' ? (
                        <Moon className="size-4" />
                    ) : (
                        <Monitor className="size-4" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {items.map(({ value, icon: Icon, label }) => {
                    return (
                        <DropdownMenuItem key={value} onClick={() => updateAppearance(value)} data-state={value === appearance ? 'active' : 'inactive'} className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                            <Icon className="mr-2 size-4" />
                            <span>{label}</span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

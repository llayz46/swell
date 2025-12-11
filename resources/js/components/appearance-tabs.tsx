import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { Divide, LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function AppearanceToggleTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Clair' },
        { value: 'dark', icon: Moon, label: 'Sombre' },
        { value: 'system', icon: Monitor, label: 'Système' },
    ];

    return (
        <div
            className={cn(className)} 
            {...props}
        >
            <Tabs 
                value={appearance}
                onValueChange={(value) => updateAppearance(value as Appearance)}
            >
                <TabsList>
                    {tabs.map(({ value, icon: Icon, label }) => (
                        <TabsTrigger
                            key={value}
                            value={value}
                        >
                            <Icon />
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    );
}

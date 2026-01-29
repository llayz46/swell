import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

export default function AppearanceToggleTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();
    const { t } = useTranslation();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: t('settings.appearance.light') },
        { value: 'dark', icon: Moon, label: t('settings.appearance.dark') },
        { value: 'system', icon: Monitor, label: t('settings.appearance.system') },
    ];

    return (
        <div className={cn(className)} {...props}>
            <Tabs value={appearance} onValueChange={(value) => updateAppearance(value as Appearance)}>
                <TabsList>
                    {tabs.map(({ value, icon: Icon, label }) => (
                        <TabsTrigger key={value} value={value}>
                            <Icon />
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    );
}

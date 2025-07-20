import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        setVisible(consent === null);
    }, []);

    const handleConsent = (value: 'accepted' | 'refused') => {
        localStorage.setItem('cookieConsent', value);
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-[400px] rounded-md border bg-background p-4 shadow-lg">
            <div className="flex gap-2">
                <div className="flex grow flex-col gap-3">
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Nous respectons votre vie privée 🍪</p>
                        <p className="text-sm text-muted-foreground">Nous utilisons des cookies pour améliorer votre expérience et afficher du contenu personnalisé.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleConsent('accepted')}>Accepter</Button>
                        <Button size="sm" variant="outline" onClick={() => handleConsent('refused')}>
                            Refuser
                        </Button>
                    </div>
                </div>
                <Button variant="ghost" className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent" aria-label="Fermer la notification" onClick={() => setVisible(false)}>
                    <XIcon size={16} className="opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </Button>
            </div>
        </div>
    );
}

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { router } from '@inertiajs/react';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useEffect, useState } from 'react';

interface FilterSheetProps {
    stock: { in: boolean; out: boolean };
    price?: { min: number | null; max: number | null; max_available: number };
}

export function FilterSheet({ stock, price }: FilterSheetProps) {
    const maxPrice = price?.max_available ?? 1000;
    const [priceRange, setPriceRange] = useState<[number, number]>([price?.min ?? 0, price?.max ?? maxPrice]);
    const [disponibilityFilter, setDisponibilityFilter] = useState<{ in: boolean; out: boolean }>({
        in: stock.in,
        out: stock.out,
    });

    useEffect(() => {
        setPriceRange([price?.min ?? 0, price?.max ?? maxPrice]);
    }, [price?.min, price?.max, maxPrice]);

    const handleDisponibilityChange = (type: 'in' | 'out', checked: CheckedState) => {
        const updated = {
            ...disponibilityFilter,
            [type]: checked === true,
        };

        setDisponibilityFilter(updated);

        const currentParams = new URLSearchParams(window.location.search);

        if (updated.in) currentParams.set('in', '1');
        else currentParams.delete('in');

        if (updated.out) currentParams.set('out', '1');
        else currentParams.delete('out');

        currentParams.set('page', '1');

        const paramsObj: Record<string, string> = {};
        currentParams.forEach((value, key) => {
            paramsObj[key] = value;
        });

        router.get(window.location.pathname, paramsObj, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handlePriceChange = (value: number[]) => {
        setPriceRange([value[0], value[1]]);
    };

    const applyPriceFilter = () => {
        const currentParams = new URLSearchParams(window.location.search);

        currentParams.delete('min_price');
        currentParams.delete('max_price');

        const paramsObj: Record<string, string> = {};

        currentParams.forEach((value, key) => {
            if (key !== 'page') {
                paramsObj[key] = value;
            }
        });

        if (priceRange[0] > 0) {
            paramsObj['min_price'] = priceRange[0].toString();
        }

        if (priceRange[1] < maxPrice) {
            paramsObj['max_price'] = priceRange[1].toString();
        }

        paramsObj['page'] = '1';

        router.get(window.location.pathname, paramsObj, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                    Filtrer
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>Filtres</SheetTitle>
                    <SheetDescription>Affinez votre recherche avec les filtres ci-dessous</SheetDescription>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                    <div className="w-full *:not-first:mt-2">
                        <Label>Disponibilité</Label>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Checkbox id="in-stock" onCheckedChange={(e) => handleDisponibilityChange('in', e)} defaultChecked={stock.in} />
                                <Label htmlFor="in-stock">Disponible</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="out-stock" onCheckedChange={(e) => handleDisponibilityChange('out', e)} defaultChecked={stock.out} />
                                <Label htmlFor="out-stock">Indisponible</Label>
                            </div>
                        </div>
                    </div>
                    <div className="w-full space-y-3 *:not-first:mt-2">
                        <div className="flex items-center justify-between">
                            <Label>Prix</Label>
                            <span className="text-sm text-muted-foreground">
                                {priceRange[0]}€ - {priceRange[1]}€
                            </span>
                        </div>

                        <Slider value={priceRange} onValueChange={handlePriceChange} max={maxPrice} min={0} step={1} />

                        <Button onClick={applyPriceFilter} variant="outline" size="sm" className="w-full">
                            Appliquer le filtre de prix
                        </Button>
                    </div>
                </div>
                <SheetFooter className="flex-row-reverse justify-between">
                    <SheetClose asChild>
                        <Button variant="outline">Fermer</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

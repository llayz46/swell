import InputError from '@/components/input-error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import { FormTabContentProps, ProductForm } from '@/types';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Button as AriaButton, Input as AriaInput, Label as AriaLabel, Group, NumberField } from 'react-aria-components';

export function InventoryTabContent({ data, setData, errors, processing }: FormTabContentProps<ProductForm>) {
    return (
        <TabsContent value="inventory" className="space-y-4">
            <Card className="border-border bg-card max-sm:py-4">
                <CardHeader className="max-sm:px-4">
                    <CardTitle className="text-foreground">Gestion des stocks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-sm:px-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <NumberField defaultValue={data.stock} onChange={(value) => setData('stock', value)}>
                            <div className="*:not-first:mt-2">
                                <AriaLabel className="text-sm font-medium text-foreground">Stock actuel *</AriaLabel>
                                <Group className="doutline-none relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border border-input text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] data-disabled:opacity-50 data-focus-within:border-ring data-focus-within:ring-[3px] data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:border-destructive data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40">
                                    <AriaInput className="flex-1 bg-background px-3 py-2 text-foreground tabular-nums" />
                                    <div className="flex h-[calc(100%+2px)] flex-col">
                                        <AriaButton
                                            slot="increment"
                                            className="-me-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-sm text-muted-foreground/80 transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <ChevronUpIcon size={12} aria-hidden="true" />
                                        </AriaButton>
                                        <AriaButton
                                            slot="decrement"
                                            className="-me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-sm text-muted-foreground/80 transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <ChevronDownIcon size={12} aria-hidden="true" />
                                        </AriaButton>
                                    </div>
                                </Group>
                                <InputError message={errors && errors.stock} />
                            </div>
                        </NumberField>
                        <NumberField defaultValue={data.reorder_level} onChange={(value) => setData('reorder_level', value)}>
                            <div className="*:not-first:mt-2">
                                <AriaLabel className="text-sm font-medium text-foreground">Seuil de réapprovisionnement *</AriaLabel>
                                <Group className="doutline-none relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border border-input text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] data-disabled:opacity-50 data-focus-within:border-ring data-focus-within:ring-[3px] data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:border-destructive data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40">
                                    <AriaInput className="flex-1 bg-background px-3 py-2 text-foreground tabular-nums" />
                                    <div className="flex h-[calc(100%+2px)] flex-col">
                                        <AriaButton
                                            slot="increment"
                                            className="-me-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-sm text-muted-foreground/80 transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <ChevronUpIcon size={12} aria-hidden="true" />
                                        </AriaButton>
                                        <AriaButton
                                            slot="decrement"
                                            className="-me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-sm text-muted-foreground/80 transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <ChevronDownIcon size={12} aria-hidden="true" />
                                        </AriaButton>
                                    </div>
                                </Group>
                                <InputError message={errors && errors.reorder_level} />
                            </div>
                        </NumberField>
                    </div>
                    <div className="*:not-first:mt-2">
                        <Label htmlFor="sku">SKU (unité de gestion des stocks)</Label>
                        <Input
                            id="sku"
                            disabled={processing}
                            value={data.sku ?? ''}
                            onChange={(e) => setData('sku', e.target.value)}
                            type="text"
                            placeholder="###-###-###-#####"
                        />
                        <p className="text-xs text-muted-foreground">
                            Le SKU est un identifiant unique pour chaque produit, utilisé pour la gestion des stocks. <br />
                            Exemple : TEE-NIKE-DRF-MBLK pour un <b>t-shirt</b> de marque <b>Nike</b>,{' '}
                            <b>Dri-FIT, M Noir</b>.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}

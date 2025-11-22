import InputError from '@/components/input-error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import { FormTabContentProps, ProductForm } from '@/types';
import { calculateMargin, calculateProfit } from '@/utils/product-price-calculating';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Button as AriaButton, Input as AriaInput, Label as AriaLabel, Group, NumberField } from 'react-aria-components';

export function PricingTabContent({ data, setData, errors }: FormTabContentProps<ProductForm>) {
    return (
        <TabsContent value="pricing" className="space-y-4">
            <Card className="border-border bg-card max-sm:py-4">
                <CardHeader className="max-sm:px-4">
                    <CardTitle className="text-foreground">Tarification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-sm:px-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <NumberField
                            defaultValue={data.price}
                            minValue={0}
                            formatOptions={{
                                style: 'currency',
                                currency: 'EUR',
                                currencySign: 'accounting',
                            }}
                            onChange={(value) => setData('price', value)}
                        >
                            <div className="*:not-first:mt-2">
                                <AriaLabel className="text-sm font-medium text-foreground">Prix de vente (€) *</AriaLabel>
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
                            </div>
                        </NumberField>
                        <InputError message={errors && errors.price} />
                        <NumberField
                            defaultValue={data.discount_price ?? 0}
                            minValue={0}
                            formatOptions={{
                                style: 'currency',
                                currency: 'EUR',
                                currencySign: 'accounting',
                            }}
                            onChange={(value) => setData('discount_price', value)}
                        >
                            <div className="*:not-first:mt-2">
                                <AriaLabel className="text-sm font-medium text-foreground">Prix promotionnel (€)</AriaLabel>
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
                            </div>
                        </NumberField>
                        <InputError message={errors && errors.discount_price} />
                        <NumberField
                            defaultValue={data.cost_price ?? 0}
                            minValue={0}
                            formatOptions={{
                                style: 'currency',
                                currency: 'EUR',
                                currencySign: 'accounting',
                            }}
                            onChange={(value) => setData('cost_price', value)}
                        >
                            <div className="*:not-first:mt-2">
                                <AriaLabel className="text-sm font-medium text-foreground">Prix coûtant (€) *</AriaLabel>
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
                            </div>
                        </NumberField>
                        <InputError message={errors && errors.cost_price} />
                        <div className="*:not-first:mt-2">
                            <Label>Marge calculée</Label>
                            <div className="rounded-md bg-muted p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Marge:</span>
                                    <span className="font-semibold text-green-500">
                                        {calculateMargin(data.cost_price, data.discount_price ?? data.price)}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Profit:</span>
                                    <span className="font-semibold text-green-500">
                                        €{calculateProfit(data.cost_price, data.discount_price ?? data.price)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
